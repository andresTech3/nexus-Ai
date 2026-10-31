import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { checkBotAndMultiIpSecurity, createBlockedResponse, unblockEntity } from '@/lib/security/bot-protection'

/* ============================================================
   MIDDLEWARE — Protección de rutas, control anti-bots y concurrencia
   ============================================================ */

const PROTECTED_PREFIXES: string[] = ['/dashboard']
const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Extraer IP de origen y User-Agent
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || ''
  const sessionToken = request.cookies.get('nexus_session_token')?.value

  // Soporte de auto-desbloqueo explícito
  if (request.nextUrl.searchParams.get('unblock') === 'true') {
    unblockEntity(ip)
    if (sessionToken) unblockEntity(sessionToken)
  }

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

  // Refrescar sesión
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
    const response = NextResponse.redirect(loginUrl)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  }

  // Rutas de auth → redirigir a /dashboard si ya hay sesión
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  if (isAuthRoute && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.searchParams.delete('redirect')
    return NextResponse.redirect(dashboardUrl)
  }

  // Evitar almacenamiento en caché del navegador en el dashboard
  if (isProtected) {
    supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
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
