import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/* ============================================================
   GET /api/v1/auth/callback
   ============================================================
   Maneja el callback OAuth de Supabase (Google, GitHub, etc.)
   y el magic link de email.

   Flujo:
   1. Supabase redirige aquí con ?code=XXX
   2. Intercambiamos el código por una sesión
   3. Redirigimos al dashboard o a la URL de retorno
   ============================================================ */

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Si Supabase devolvió un error (ej. el usuario canceló)
  if (error) {
    console.error('[auth/callback] Provider error:', error, errorDescription)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('auth_error', 'provider_error')
    return NextResponse.redirect(loginUrl)
  }

  if (!code) {
    // Sin código — redirigir a login con error
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('auth_error', 'missing_code')
    return NextResponse.redirect(loginUrl)
  }

  const supabase = await createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[auth/callback] Code exchange error:', exchangeError.message)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('auth_error', 'session_error')
    return NextResponse.redirect(loginUrl)
  }

  // Validar que next solo apunte a rutas internas (prevenir open redirect / protocol-relative URLs)
  const isSafePath = next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')
  const safeNext = isSafePath ? next : '/dashboard'
  return NextResponse.redirect(new URL(safeNext, origin))
}
