import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import {
  exchangeCodeForToken,
  extendToken,
  fetchMetaUserInfo,
  fetchAdAccounts,
  fetchInstagramAccounts,
  fetchInstagramProfile,
  getAppUrl,
  getMetaCallbackUri,
} from '@/lib/meta/oauth'

/**
 * GET /api/v1/meta/callback?code=XXX&state=YYY
 *
 * Meta OAuth callback handler.
 * 1. Validates CSRF state against the cookie.
 * 2. Exchanges the authorization code for a long-lived access token (60 days).
 * 3. Fetches the user's Meta profile + ad accounts or Instagram accounts.
 * 4. Saves the connection to social_connections in Supabase.
 * 5. Strictly redirects with error if anything failed — NEVER pretends success.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state') // format: "mode:randomToken"
  const oauthError = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const appUrl = getAppUrl(request)
  const callbackUri = getMetaCallbackUri(appUrl)

  // Determine fallback target page from state
  const targetMode = returnedState?.startsWith('instagram:') ? 'instagram' : 'facebook-ads'

  // ── 1. User cancelled or Meta returned an error ───────────────────────────
  if (oauthError) {
    console.error('[meta/callback] Meta error:', oauthError, errorDescription)
    return NextResponse.redirect(
      `${appUrl}/dashboard/${targetMode}?meta_error=cancelled&desc=${encodeURIComponent(errorDescription || oauthError)}`
    )
  }

  if (!code || !returnedState) {
    return NextResponse.redirect(
      `${appUrl}/dashboard/${targetMode}?meta_error=missing_params`
    )
  }

  // ── 2. Validate CSRF state ────────────────────────────────────────────────
  const cookieStore = await cookies()
  const storedStateCookie = cookieStore.get('meta_oauth_state')?.value
  // Cookie format: "mode:randomToken:userId"
  const [cookieMode, cookieRandom, cookieUserId] = (storedStateCookie ?? '').split(':')
  // State returned by Meta format: "mode:randomToken"
  const [returnedMode, returnedRandom] = returnedState.split(':')

  const effectiveMode = (returnedMode === 'instagram' || cookieMode === 'instagram') ? 'instagram' : 'facebook-ads'

  let mode = (returnedMode === 'instagram' ? 'instagram' : 'ads') as 'ads' | 'instagram'
  let userId = cookieUserId

  if (storedStateCookie) {
    if (returnedRandom !== cookieRandom || (cookieMode && returnedMode !== cookieMode)) {
      console.error('[meta/callback] CSRF state mismatch:', { returnedRandom, cookieRandom })
      return NextResponse.redirect(
        `${appUrl}/dashboard/${effectiveMode}?meta_error=state_mismatch`
      )
    }
    mode = (cookieMode as 'ads' | 'instagram') || mode
  }

  // ── 3. Exchange code for token ────────────────────────────────────────────
  const shortToken = await exchangeCodeForToken(code, callbackUri)
  if (!shortToken || shortToken.error || !shortToken.access_token) {
    console.error('[meta/callback] Token exchange failed:', shortToken)
    return NextResponse.redirect(
      `${appUrl}/dashboard/${effectiveMode}?meta_error=token_exchange&desc=${encodeURIComponent(shortToken?.error || 'No se pudo canjear el token con Meta')}`
    )
  }

  // ── 4. Extend to long-lived token (60 days) ───────────────────────────────
  const longToken = await extendToken(shortToken.access_token)
  if (!longToken || longToken.error || !longToken.access_token) {
    console.error('[meta/callback] Token extension failed:', longToken)
    return NextResponse.redirect(
      `${appUrl}/dashboard/${effectiveMode}?meta_error=token_extension&desc=${encodeURIComponent(longToken?.error || 'Fallo al extender vigencia del token')}`
    )
  }

  const accessToken = longToken.access_token
  const expiresAt = new Date(Date.now() + (longToken.expires_in ?? 5184000) * 1000).toISOString()

  // ── 5. Fetch profile data from Meta Graph API ──────────────────────────────
  const metaUser = await fetchMetaUserInfo(accessToken)

  if (!metaUser || (metaUser as any).error || !metaUser.id) {
    console.error('[meta/callback] Invalid meta user response:', metaUser)
    return NextResponse.redirect(
      `${appUrl}/dashboard/${effectiveMode}?meta_error=user_fetch_failed&desc=${encodeURIComponent((metaUser as any)?.error?.message || 'No se pudo leer el perfil de Meta')}`
    )
  }

  let accountId: string | null = null
  let rawProfile: Record<string, unknown> = { meta_user: metaUser }
  let provider: 'meta_ads' | 'instagram' = 'meta_ads'

  if (mode === 'ads') {
    provider = 'meta_ads'
    const adAccounts = await fetchAdAccounts(accessToken)
    rawProfile = { meta_user: metaUser, ad_accounts: adAccounts }
    const firstActive = adAccounts.data?.find((a) => a.account_status === 1)
    accountId = firstActive?.id ?? adAccounts.data?.[0]?.id ?? null
  } else {
    provider = 'instagram'
    const pages = await fetchInstagramAccounts(accessToken)
    const pageWithIG = pages.data?.find((p) => p.instagram_business_account)
    const igAccountId = pageWithIG?.instagram_business_account?.id ?? null

    if (igAccountId) {
      const igProfile = await fetchInstagramProfile(igAccountId, accessToken)
      rawProfile = { meta_user: metaUser, ig_profile: igProfile, pages: pages.data }
      accountId = igAccountId
    } else {
      rawProfile = { meta_user: metaUser, pages: pages.data }
    }
  }

  // ── 6. Save to Supabase social_connections ────────────────────────────────
  const supabase = await createClient()

  const {
    data: { user },
    error: userAuthError,
  } = await supabase.auth.getUser()

  if (userAuthError || !user) {
    return NextResponse.redirect(
      `${appUrl}/dashboard/${effectiveMode}?meta_error=auth_mismatch&desc=Sesion_de_usuario_invalida`
    )
  }

  if (userId && user.id !== userId) {
    return NextResponse.redirect(
      `${appUrl}/dashboard/${effectiveMode}?meta_error=auth_mismatch&desc=Sesion_de_usuario_invalida`
    )
  }

  const { error: upsertError } = await supabase.from('social_connections').upsert(
    {
      user_id: user.id,
      provider,
      external_user_id: metaUser.id,
      account_name: metaUser.name,
      account_id: accountId,
      access_token: accessToken,
      token_expires_at: expiresAt,
      scopes: mode === 'ads'
        ? ['ads_read', 'ads_management', 'pages_read_engagement']
        : ['pages_show_list', 'pages_read_engagement'],
      raw_profile: rawProfile,
      connected_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,provider' }
  )

  if (upsertError) {
    console.error('[meta/callback] DB upsert error:', upsertError)
    // NEVER lie about success if DB write failed
    return NextResponse.redirect(
      `${appUrl}/dashboard/${effectiveMode}?meta_error=db_error&desc=${encodeURIComponent(upsertError.message || 'Error guardando en Supabase. Verifica que la tabla social_connections exista.')}`
    )
  }

  // Clear the state cookie
  const redirectUrl = `${appUrl}/dashboard/${effectiveMode}?meta_connected=1`

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.delete('meta_oauth_state')
  return response
}
