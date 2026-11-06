import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchAdAccounts } from '@/lib/meta/oauth'

/**
 * GET /api/v1/meta/ads/accounts
 *
 * Returns the user's connected Meta Ads account data
 * including ad accounts and their status.
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

  const { data: connection, error: connError } = await supabase
    .from('social_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', 'meta_ads')
    .single()

  if (connError || !connection) {
    return NextResponse.json({ error: 'No conectado a Meta Ads', connected: false }, { status: 404 })
  }

  if (connection.token_expires_at && new Date(connection.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expirado. Vuelve a conectar.', expired: true }, { status: 401 })
  }

  const adAccounts = await fetchAdAccounts(connection.access_token)

  return NextResponse.json({
    connected: true,
    meta_user: connection.raw_profile?.meta_user ?? null,
    account_name: connection.account_name,
    primary_account_id: connection.account_id,
    ad_accounts: adAccounts.data ?? [],
    token_expires_at: connection.token_expires_at,
  })
}

/**
 * DELETE /api/v1/meta/ads/accounts
 * Disconnect the Meta Ads integration.
 */
export async function DELETE() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { error } = await supabase
    .from('social_connections')
    .delete()
    .eq('user_id', user.id)
    .eq('provider', 'meta_ads')

  if (error) {
    return NextResponse.json({ error: 'Error al desconectar' }, { status: 500 })
  }

  return NextResponse.json({ disconnected: true })
}

