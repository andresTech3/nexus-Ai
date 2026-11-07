import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildMetaAuthUrl, getAppUrl, getMetaCallbackUri, META_APP_ID } from '@/lib/meta/oauth'
import crypto from 'crypto'

/**
 * GET /api/v1/meta/connect?mode=ads|instagram
 *
 * Generates a Meta OAuth authorization URL with a CSRF state token.
 * Validates that credentials are configured before attempting to redirect.
 */
export async function GET(request: Request) {
  const supabase = await createClient()

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Debes iniciar sesión para conectar una cuenta.' }, { status: 401 })
  }

  // Check if META_APP_ID is properly configured in environment
  if (!META_APP_ID || META_APP_ID.includes('REEMPLAZA') || META_APP_ID.trim() === '') {
    return NextResponse.json(
      {
        error: 'Credenciales de Meta no configuradas. Agrega tu META_APP_ID y META_APP_SECRET en las Variables de Entorno de Vercel (o en .env.local) antes de conectar.',
        notConfigured: true,
      },
      { status: 400 }
    )
  }

  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') === 'instagram' ? 'instagram' : 'ads'

  // Dynamic host & callback URL resolution
  const appUrl = getAppUrl(request)
  const callbackUri = getMetaCallbackUri(appUrl)

  // Generate a CSRF state token
  const random = crypto.randomBytes(16).toString('hex')
  const state = `${random}`

  const response = NextResponse.json({
    url: buildMetaAuthUrl(state, mode, callbackUri),
    state,
    mode,
    appUrl,
    callbackUri,
  })

  // Store state in a secure httpOnly cookie so the callback can validate CSRF
  response.cookies.set('meta_oauth_state', `${mode}:${state}:${user.id}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  return response
}
