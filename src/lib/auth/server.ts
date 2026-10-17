import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { OrgRole, AuthContext } from '@/types'

/* ============================================================
   AUTH HELPERS — Servidor (Server Components & Route Handlers)
   ============================================================ */

/**
 * Obtiene el usuario autenticado actual desde las cookies de sesión.
 * Retorna null si no hay sesión válida.
 * NUNCA usa la service_role key — usa la anon key con RLS.
 */
export async function getServerUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Server Component — ignora */ }
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Construye el contexto de autenticación completo para un usuario.
 * Verifica: identidad → membresía de organización → rol.
 *
 * Retorna null si falta cualquiera de las capas.
 * Los handlers HTTP deben llamar esto y responder 401/403 si es null.
 */
export async function getAuthContext(
  organizationId?: string
): Promise<AuthContext | null> {
  const user = await getServerUser()
  if (!user) return null

  // Si no se especifica org, obtenemos la primera membresía activa del usuario
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* ignora */ }
        },
      },
    }
  )

  const query = supabase
    .from('organization_memberships')
    .select('organization_id, role, status')
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (organizationId) {
    query.eq('organization_id', organizationId)
  }

  const { data: membership, error } = await query.single()

  if (error || !membership) return null

  return {
    userId: user.id,
    organizationId: membership.organization_id as string,
    role: membership.role as OrgRole,
    email: user.email ?? '',
  }
}

/**
 * Verifica si un contexto de auth tiene el rol mínimo requerido.
 * Jerarquía: admin > employee > client
 */
export function hasMinRole(ctx: AuthContext, required: OrgRole): boolean {
  const hierarchy: Record<OrgRole, number> = { admin: 3, employee: 2, client: 1 }
  return hierarchy[ctx.role] >= hierarchy[required]
}

/**
 * Genera un requestId único para trazabilidad de errores.
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Respuesta de error uniforme para Route Handlers.
 * NUNCA incluir stack traces, SQL ni credenciales.
 */
export function errorResponse(
  message: string,
  statusCode: number,
  requestId: string
) {
  return Response.json(
    { error: getErrorCode(statusCode), message, requestId, statusCode },
    { status: statusCode }
  )
}

function getErrorCode(status: number): string {
  const codes: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_ERROR',
  }
  return codes[status] ?? 'UNKNOWN_ERROR'
}
