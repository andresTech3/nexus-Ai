import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { checkBotAndMultiIpSecurity, createBlockedResponse } from '@/lib/security/bot-protection'

/* ============================================================
   MIDDLEWARE — Protección de rutas, control anti-bots y concurrencia
   ============================================================ */

const PROTECTED_PREFIXES = ['/dashboard']
const AUTH_ROUTES = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Extraer IP de origen y User-Agent
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || ''
  const sessionToken = request.cookies.get('nexus_session_token')?.value

  // 1. FILTRO DE SEGURIDAD: Detección de bots y múltiples IPs simultáneas
  const securityCheck = checkBotAndMultiIpSecurity(ip, userAgent, pathname, sessionToken)
  if (securityCheck.blocked) {
    return createBlockedResponse(
      securityCheck.reason || 'Tráfico automatizado o múltiples IPs simultáneas detectadas',
      pathname.startsWith('/api/')
    )
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Refrescar la sesión sin acceder a session.user
  // para evitar romper el flujo de autenticación de Supabase SSR.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas protegidas → redirigir a /login si no hay sesión
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar si la sesión de este dispositivo fue desplazada por otro
  if (isProtected && user) {
    const sessionToken = request.cookies.get('nexus_session_token')?.value
    if (sessionToken) {
      const { data: isValid } = await supabase.rpc('validate_user_session', {
        p_user_id: user.id,
        p_session_token: sessionToken,
      })

      if (isValid === false) {
        // La sesión en este navegador ya no es válida (iniciaron sesión en otro dispositivo)
        await supabase.auth.signOut()
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('auth_error', 'session_displaced')
        const response = NextResponse.redirect(loginUrl)
        response.cookies.delete('nexus_session_token')
        return response
      }

      // Mantener activo el timestamp de actividad
      await supabase.rpc('touch_user_session', {
        p_user_id: user.id,
        p_session_token: sessionToken,
      })
    }
  }

  // Rutas de auth → redirigir a /dashboard si ya hay sesión
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  if (isAuthRoute && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.searchParams.delete('redirect')
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, imágenes públicas
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
