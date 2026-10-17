import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRequestId } from '@/lib/auth/server'

/* ============================================================
   POST /api/v1/auth/sign-out
   ============================================================
   Cierra la sesión del usuario actual y limpia las cookies.
   Requiere autenticación activa (no falla si ya no hay sesión).
   ============================================================ */

export async function POST(request: Request) {
  const requestId = generateRequestId()

  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Redirigir al login después del sign-out
    const origin = new URL(request.url).origin
    const response = NextResponse.redirect(new URL('/login', origin))
    return response
  } catch (err) {
    console.error('[auth/sign-out] Unexpected error:', err)
    return Response.json(
      { error: 'INTERNAL_ERROR', message: 'Error al cerrar sesión', requestId },
      { status: 500 }
    )
  }
}
