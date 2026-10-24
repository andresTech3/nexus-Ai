import { type NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'
import { getAuthContext, hasMinRole, generateRequestId, errorResponse } from '@/lib/auth/server'
import type { AuthContext, OrgRole } from '@/types'

export interface ApiHandlerOptions<TBody = any, TQuery = any> {
  requireAuth?: boolean
  minRole?: OrgRole
  bodySchema?: ZodSchema<TBody>
  querySchema?: ZodSchema<TQuery>
}

export interface ApiContext<TBody = any, TQuery = any> {
  req: NextRequest
  auth: AuthContext
  body: TBody
  query: TQuery
  requestId: string
  params: Record<string, string>
}

function applySecurityHeaders(res: Response | NextResponse, requestId: string): Response | NextResponse {
  res.headers.set('X-Request-ID', requestId)
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return res
}

/**
 * Wrapper de seguridad para Route Handlers de Next.js (/api/v1/*).
 * Garantiza:
 * 1. Trazabilidad con requestId único en headers y respuestas.
 * 2. Validación de sesión y contexto multi-tenant (organization_id).
 * 3. Control de acceso por rol (RBAC: admin, employee, client).
 * 4. Validación de entrada estricta con Zod (body y query params).
 * 5. Sanitización de respuestas de error (cero fugas de SQL/traces).
 */
export function createApiHandler<TBody = any, TQuery = any>(
  options: ApiHandlerOptions<TBody, TQuery>,
  handler: (ctx: ApiContext<TBody, TQuery>) => Promise<NextResponse | Response>
) {
  return async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> | Record<string, string> } = {}) => {
    const requestId = req.headers.get('x-request-id') || generateRequestId()
    const resolvedParams = params ? (params instanceof Promise ? await params : params) : {}

    try {
      // 1. Verificación de Autenticación y Rol
      let authCtx: AuthContext | null = null
      if (options.requireAuth !== false) {
        authCtx = await getAuthContext()
        if (!authCtx) {
          return applySecurityHeaders(
            errorResponse('Acceso no autorizado. Sesión requerida.', 401, requestId),
            requestId
          )
        }

        if (options.minRole && !hasMinRole(authCtx, options.minRole)) {
          return applySecurityHeaders(
            errorResponse(
              `Acceso denegado. Se requiere rol de ${options.minRole} o superior.`,
              403,
              requestId
            ),
            requestId
          )
        }
      }

      // 2. Validación de Query Params
      let parsedQuery: any = {}
      if (options.querySchema) {
        const rawQuery: Record<string, string> = {}
        req.nextUrl.searchParams.forEach((val, key) => {
          rawQuery[key] = val
        })
        const queryResult = options.querySchema.safeParse(rawQuery)
        if (!queryResult.success) {
          const firstIssue = (queryResult.error as ZodError).issues[0]
          return applySecurityHeaders(
            errorResponse(
              `Parámetro inválido '${firstIssue.path.join('.')}': ${firstIssue.message}`,
              400,
              requestId
            ),
            requestId
          )
        }
        parsedQuery = queryResult.data
      }

      // 3. Validación de Body (para métodos POST, PUT, PATCH)
      let parsedBody: any = {}
      if (options.bodySchema && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        let rawBody = {}
        try {
          rawBody = await req.json()
        } catch {
          return applySecurityHeaders(
            errorResponse('El cuerpo de la solicitud no es un JSON válido', 400, requestId),
            requestId
          )
        }

        const bodyResult = options.bodySchema.safeParse(rawBody)
        if (!bodyResult.success) {
          const firstIssue = (bodyResult.error as ZodError).issues[0]
          return applySecurityHeaders(
            errorResponse(
              `Campo inválido '${firstIssue.path.join('.')}': ${firstIssue.message}`,
              422,
              requestId
            ),
            requestId
          )
        }
        parsedBody = bodyResult.data
      }

      // 4. Ejecutar el Handler
      const response = await handler({
        req,
        auth: authCtx as AuthContext,
        body: parsedBody,
        query: parsedQuery,
        requestId,
        params: resolvedParams,
      })

      // 5. Inyectar Headers de Seguridad y Trazabilidad en la respuesta exitosa
      return applySecurityHeaders(response, requestId)
    } catch (err: any) {
      console.error(`[API Error][${requestId}]`, err?.message || err)
      return applySecurityHeaders(
        errorResponse('Ha ocurrido un error interno en el servidor.', 500, requestId),
        requestId
      )
    }
  }
}
