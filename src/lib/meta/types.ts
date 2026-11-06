/**
 * Types for Meta (Facebook/Instagram) API integration
 */

import type { Database } from '@/types/database'

export interface MetaOAuthTokens {
  access_token: string
  token_type: string
  expires_in: number
  error?: string
}

export interface MetaUser {
  id: string
  name: string
  email?: string
}

export interface MetaAdAccount {
  id: string
  name: string
  account_status: number  // 1 = Active, 2 = Pending, 3 = Disabled
  currency: string
}

export interface InstagramAccount {
  id: string
  name: string
  instagram_business_account?: { id: string }
}

export interface InstagramProfile {
  id: string
  username: string
  name: string
  biography: string
  followers_count: number
  follows_count: number
  media_count: number
  profile_picture_url: string
  website?: string
}

export interface InstagramMedia {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  caption?: string
  like_count: number
  comments_count: number
  timestamp: string
  insights?: Array<{ name: string; values: Array<{ value: number }> }>
}

export interface SocialConnection extends Database['public']['Tables']['social_connections']['Row'] {}

export interface MetaConnectionState {
  connected: boolean
  loading: boolean
  error: string | null
  accountName: string | null
  accountId: string | null
  tokenExpiresAt: string | null
  igProfile?: InstagramProfile | null
  igMedia?: InstagramMedia[]
  adAccounts?: MetaAdAccount[]
}

export type MetaMode = 'ads' | 'instagram'

export interface MetaConnectResult {
  connected: boolean
  accountName?: string | null
  accountId?: string | null
  error?: string | null
  expired?: boolean
  meta_user?: MetaUser
  ad_accounts?: MetaAdAccount[]
  profile?: InstagramProfile
  media?: { data: InstagramMedia[] }
  token_expires_at?: string
}