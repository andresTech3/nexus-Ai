import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchInstagramProfile, fetchInstagramMedia } from '@/lib/meta/oauth'

/**
 * GET /api/v1/meta/instagram/profile
 *
 * Returns the authenticated user's connected Instagram profile data
 * including real followers, media count, biography, and recent posts.
 * Data is fetched live from the Instagram Graph API using the stored access token.
 */
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Load the stored Instagram connection
  const { data: connection, error: connError } = await supabase
    .from('social_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', 'instagram')
    .single()

  if (connError || !connection) {
    return NextResponse.json({ error: 'No conectado a Instagram', connected: false }, { status: 404 })
  }

  // Check token expiry
  if (connection.token_expires_at && new Date(connection.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token de Instagram expirado. Vuelve a conectar.', expired: true }, { status: 401 })
  }

  const igAccountId = connection.account_id
  const accessToken = connection.access_token

  if (!igAccountId) {
    // No IG Business account linked — return cached raw profile if available
    return NextResponse.json({
      connected: true,
      profile: connection.raw_profile?.ig_profile ?? null,
      media: [],
      account_id: null,
      cached: true,
    })
  }

  // Fetch live data from Instagram Graph API
  const [profile, media] = await Promise.all([
    fetchInstagramProfile(igAccountId, accessToken),
    fetchInstagramMedia(igAccountId, accessToken),
  ])

  // Update raw_profile cache in Supabase
  await supabase
    .from('social_connections')
    .update({
      raw_profile: {
        ...(connection.raw_profile as Record<string, unknown>),
        ig_profile: profile,
      },
    })
    .eq('id', connection.id)

  return NextResponse.json({
    connected: true,
    profile,
    media: media.data ?? [],
    account_id: igAccountId,
    cached: false,
    token_expires_at: connection.token_expires_at,
  })
}

