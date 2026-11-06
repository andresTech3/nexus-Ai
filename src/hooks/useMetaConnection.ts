'use client'

import { useState, useEffect, useCallback } from 'react'

export interface MetaConnection {
  connected: boolean
  loading: boolean
  error: string | null
  accountName: string | null
  accountId: string | null
  tokenExpiresAt: string | null
  // Instagram-specific
  igProfile?: {
    id: string
    username: string
    name: string
    biography: string
    followers_count: number
    follows_count: number
    media_count: number
    profile_picture_url: string
    website: string
  } | null
  igMedia?: Array<{
    id: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    media_url: string
    thumbnail_url?: string
    permalink: string
    caption?: string
    like_count: number
    comments_count: number
    timestamp: string
  }>
  // Ads-specific
  adAccounts?: Array<{
    id: string
    name: string
    account_status: number
    currency: string
  }>
}

export function useMetaConnection(mode: 'ads' | 'instagram') {
  const [state, setState] = useState<MetaConnection>({
    connected: false,
    loading: true,
    error: null,
    accountName: null,
    accountId: null,
    tokenExpiresAt: null,
  })
  const [connecting, setConnecting] = useState(false)

  const checkConnection = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const endpoint =
        mode === 'instagram'
          ? '/api/v1/meta/instagram/profile'
          : '/api/v1/meta/ads/accounts'

      const res = await fetch(endpoint)
      const data = await res.json()

      if (!res.ok || data.error) {
        setState({
          connected: false,
          loading: false,
          error: data.error ?? null,
          accountName: null,
          accountId: null,
          tokenExpiresAt: null,
        })
        return
      }

      if (mode === 'instagram') {
        setState({
          connected: true,
          loading: false,
          error: null,
          accountName: data.profile?.username ?? data.profile?.name ?? null,
          accountId: data.account_id ?? null,
          tokenExpiresAt: data.token_expires_at ?? null,
          igProfile: data.profile ?? null,
          igMedia: data.media ?? [],
        })
      } else {
        setState({
          connected: true,
          loading: false,
          error: null,
          accountName: data.account_name ?? null,
          accountId: data.primary_account_id ?? null,
          tokenExpiresAt: data.token_expires_at ?? null,
          adAccounts: data.ad_accounts ?? [],
        })
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Error al verificar la conexión',
      }))
    }
  }, [mode])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  /** Opens the Meta OAuth popup / redirect */
  const connect = useCallback(async () => {
    setConnecting(true)
    setState((prev) => ({ ...prev, error: null }))
    try {
      const res = await fetch(`/api/v1/meta/connect?mode=${mode}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo iniciar la conexión con Meta')
      }
      // Redirect to Meta OAuth
      window.location.href = data.url
    } catch (err: any) {
      setConnecting(false)
      setState((prev) => ({
        ...prev,
        error: err.message || 'Error al iniciar la conexión con Meta',
      }))
    }
  }, [mode])

  /** Disconnect the integration */
  const disconnect = useCallback(async () => {
    if (!confirm('¿Seguro que quieres desconectar esta cuenta?')) return
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const endpoint =
        mode === 'instagram'
          ? '/api/v1/meta/instagram/profile'
          : '/api/v1/meta/ads/accounts'
      await fetch(endpoint, { method: 'DELETE' })
      setState({
        connected: false,
        loading: false,
        error: null,
        accountName: null,
        accountId: null,
        tokenExpiresAt: null,
      })
    } catch {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [mode])

  return { ...state, connecting, connect, disconnect, refresh: checkConnection }
}

