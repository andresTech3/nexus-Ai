/**
 * Meta OAuth 2.0 utilities
 * Handles Facebook Login for Ads + Instagram Basic Display API
 *
 * Docs:
 * - Meta Login: https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
 * - Instagram Basic Display: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
 */

export const META_APP_ID = process.env.META_APP_ID ?? ''
export const META_APP_SECRET = process.env.META_APP_SECRET ?? ''
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

/** Redirect URI registered in the Meta App Dashboard */
export const META_CALLBACK_URI = `${APP_URL}/api/v1/meta/callback`

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
  mode: 'ads' | 'instagram' = 'ads'
): string {
  const scopes = mode === 'ads' ? META_ADS_SCOPES : INSTAGRAM_SCOPES
  const params = new URLSearchParams({
    client_id: META_APP_ID,
    redirect_uri: META_CALLBACK_URI,
    scope: scopes,
    response_type: 'code',
    state: `${mode}:${state}`,
  })
  return `https://www.facebook.com/v22.0/dialog/oauth?${params.toString()}`
}

/** Exchange the authorization code for a long-lived token */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  token_type: string
  expires_in?: number
  error?: string
}> {
  const params = new URLSearchParams({
    client_id: META_APP_ID,
    client_secret: META_APP_SECRET,
    redirect_uri: META_CALLBACK_URI,
    code,
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
  error?: string
}> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: META_APP_ID,
    client_secret: META_APP_SECRET,
    fb_exchange_token: shortToken,
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

