/**
 * Supabase migration: social_connections table
 * Run via: Supabase Dashboard > SQL Editor, or supabase db push
 *
 * Stores OAuth tokens for Meta (Facebook Ads + Instagram) and future providers.
 * Tokens are encrypted at rest by Supabase; this table is RLS-protected.
 */

export const MIGRATION_SQL = `
-- ================================================================
-- social_connections
-- ================================================================
-- Each row links one platform account to one app user.
-- Tokens are stored server-side only — never exposed to the browser.
-- ================================================================

CREATE TABLE IF NOT EXISTS public.social_connections (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider         text NOT NULL,          -- 'meta_ads' | 'instagram'
  external_user_id text,                   -- Meta user ID or Instagram user ID
  account_name     text,                   -- Display name from the platform
  account_id       text,                   -- Ad Account ID or IG Business Account ID
  access_token     text NOT NULL,          -- Long-lived token (server-only)
  token_expires_at timestamptz,            -- Expiry date of the token
  scopes           text[],                 -- Scopes granted
  raw_profile      jsonb,                  -- Full profile blob from the API
  connected_at     timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

-- RLS: users can only read/write their own connections
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own connections"
  ON public.social_connections
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_social_connections_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_social_connections_updated_at ON public.social_connections;
CREATE TRIGGER trg_social_connections_updated_at
  BEFORE UPDATE ON public.social_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_social_connections_updated_at();
`

export const ROLLBACK_SQL = `
DROP TABLE IF EXISTS public.social_connections CASCADE;
DROP FUNCTION IF EXISTS public.update_social_connections_updated_at();
`

