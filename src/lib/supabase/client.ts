import { createBrowserClient } from '@supabase/ssr'

/**
 * Crea un cliente Supabase para uso en el navegador (Client Components).
 * Las variables de entorno son públicas (NEXT_PUBLIC_*).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
