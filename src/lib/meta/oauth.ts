/**
 * Meta OAuth 2.0 utilities
 * Handles Facebook Login for Ads + Instagram Basic Display API
 *
 * Docs:
 * - Meta Login: https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
 * - Instagram Basic Display: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
 */

export const META_APP_ID = (process.env.META_APP_ID ?? '1811184963497287').trim().replace(/['"]/g, '')
export const META_APP_SECRET = (process.env.META_APP_SECRET ?? '').trim().replace(/['"]/g, '')

/**
 * Resolves the application public URL dynamically based on environment or request headers.
 * Works seamlessly in localhost, Vercel preview, and Vercel production domains.
 */
export function getAppUrl(request?: Request): string {
  // 1. If incoming request has headers, that is the exact domain the browser visited
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '')
    }
    const host = request.headers.get('host')
    if (host) {
      const proto = host.includes('localhost') ? 'http' : 'https'
      return `${proto}://${host}`.replace(/\/$/, '')
    }
    try {
      const { origin } = new URL(request.url)
      if (origin && !origin.includes('undefined')) return origin.replace(/\/$/, '')
    } catch {}
  }

  // 2. Explicit production URL if set
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  // 3. Vercel project production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, '')
  }

  // 4. Default fallback
  return process.env.NODE_ENV === 'production'
    ? 'https://nexus-ai-six-azure.vercel.app'
    : 'http://localhost:3000'
}

/**
 * Returns the exact callback URI for Meta OAuth matching the given host
 */
export function getMetaCallbackUri(requestOrAppUrl?: Request | string): string {
  if (typeof requestOrAppUrl === 'string') {
    return `${requestOrAppUrl.replace(/\/$/, '')}/api/v1/meta/callback`
  }
  const appUrl = getAppUrl(requestOrAppUrl)
  return `${appUrl}/api/v1/meta/callback`
}

export const APP_URL = getAppUrl()

/** Default Redirect URI registered in the Meta App Dashboard */
export const META_CALLBACK_URI = getMetaCallbackUri()

/** Scopes needed strictly for Facebook Ads Management */
export const META_ADS_SCOPES = [
  'ads_read',
  'ads_management',
  'pages_read_engagement',
].join(',')

/** Scopes for Instagram Connection via Linked Facebook Page */
export const INSTAGRAM_SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
].join(',')

/** Build the Meta OAuth authorization URL */
export function buildMetaAuthUrl(
  state: string,
  mode: 'ads' | 'instagram' = 'ads',
  customRedirectUri?: string
): string {
  const scopes = mode === 'ads' ? META_ADS_SCOPES : INSTAGRAM_SCOPES
  const redirectUri = customRedirectUri || getMetaCallbackUri()
  const params = new URLSearchParams({
    client_id: META_APP_ID,
    redirect_uri: redirectUri,
    scope: scopes,
    response_type: 'code',
    state: `${mode}:${state}`,
  })
  return `https://www.facebook.com/v22.0/dialog/oauth?${params.toString()}`
}

/** Exchange the authorization code for a long-lived token */
export async function exchangeCodeForToken(
  code: string,
  customRedirectUri?: string
): Promise<{
  access_token: string
  token_type: string
  expires_in?: number
  error?: any
}> {
  const redirectUri = customRedirectUri || getMetaCallbackUri()
  const params = new URLSearchParams({
    client_id: META_APP_ID.trim(),
    client_secret: META_APP_SECRET.trim(),
    redirect_uri: redirectUri,
    code: code.trim(),
  })

  const res = await fetch(
    `https://graph.facebook.com/v22.0/oauth/access_token?${params.toString()}`
  )
  return res.json()
}

/** Extend a short-lived token to a long-lived one (60 days) */
export async function extendToken(shortToken: string): Promise<{
  access_token: string
  token_type: string
  expires_in: number
  error?: any
}> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: META_APP_ID.trim(),
    client_secret: META_APP_SECRET.trim(),
    fb_exchange_token: shortToken.trim(),
  })

  const res = await fetch(
    `https://graph.facebook.com/v22.0/oauth/access_token?${params.toString()}`
  )
  return res.json()
}

/** Fetch basic user info from Graph API */
export async function fetchMetaUserInfo(accessToken: string): Promise<{
  id: string
  name: string
  email?: string
}> {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/me?fields=id,name,email&access_token=${accessToken}`
  )
  return res.json()
}

/** Fetch Facebook Ad Accounts accessible by this token */
export async function fetchAdAccounts(accessToken: string): Promise<{
  data: Array<{ id: string; name: string; account_status: number; currency: string }>
}> {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/me/adaccounts?fields=id,name,account_status,currency&access_token=${accessToken}`
  )
  return res.json()
}

/** Fetch Instagram Business or Creator accounts linked to the user */
export async function fetchInstagramAccounts(accessToken: string): Promise<{
  data: Array<{
    id: string
    name: string
    instagram_business_account?: { id: string }
  }>
}> {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,instagram_business_account&access_token=${accessToken}`
  )
  return res.json()
}

/** Fetch Instagram profile data: followers, media count, biography */
export async function fetchInstagramProfile(
  igUserId: string,
  accessToken: string
): Promise<{
  id: string
  username: string
  name: string
  biography: string
  followers_count: number
  follows_count: number
  media_count: number
  profile_picture_url: string
  website: string
}> {
  const fields = [
    'id',
    'username',
    'name',
    'biography',
    'followers_count',
    'follows_count',
    'media_count',
    'profile_picture_url',
    'website',
  ].join(',')
  const res = await fetch(
    `https://graph.facebook.com/v22.0/${igUserId}?fields=${fields}&access_token=${accessToken}`
  )
  return res.json()
}

/** Fetch recent Instagram media (up to 25 posts: Reels, Carousels, Images) */
export async function fetchInstagramMedia(
  igUserId: string,
  accessToken: string
): Promise<{
  data: Array<{
    id: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    media_url: string
    thumbnail_url?: string
    permalink: string
    caption?: string
    like_count: number
    comments_count: number
    timestamp: string
    insights?: { data: Array<{ name: string; values: Array<{ value: number }> }> }
  }>
}> {
  const fields = [
    'id',
    'media_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'caption',
    'like_count',
    'comments_count',
    'timestamp',
  ].join(',')
  const res = await fetch(
    `https://graph.facebook.com/v22.0/${igUserId}/media?fields=${fields}&limit=25&access_token=${accessToken}`
  )
  return res.json()
}

