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
          return errorResponse('Acceso no autorizado. Sesión requerida.', 401, requestId)
        }

        if (options.minRole && !hasMinRole(authCtx, options.minRole)) {
          return errorResponse(
            `Acceso denegado. Se requiere rol de ${options.minRole} o superior.`,
            403,
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
          return errorResponse(
            `Parámetro inválido '${firstIssue.path.join('.')}': ${firstIssue.message}`,
            400,
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
          return errorResponse('El cuerpo de la solicitud no es un JSON válido', 400, requestId)
        }

        const bodyResult = options.bodySchema.safeParse(rawBody)
        if (!bodyResult.success) {
          const firstIssue = (bodyResult.error as ZodError).issues[0]
          return errorResponse(
            `Campo inválido '${firstIssue.path.join('.')}': ${firstIssue.message}`,
            422,
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

      // 5. Inyectar Headers de Seguridad y Trazabilidad
      response.headers.set('X-Request-ID', requestId)
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      return response
    } catch (err: any) {
      console.error(`[API Error][${requestId}]`, err?.message || err)
      return errorResponse('Ha ocurrido un error interno en el servidor.', 500, requestId)
    }
  }
}
