import { NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/v1/auth/me
 * Retorna la información de identidad del usuario autenticado, su perfil público
 * y su rol en la organización activa.
 */
export const GET = createApiHandler(
  { requireAuth: true },
  async ({ auth, requestId }) => {
    const supabase = await createClient()

    // Obtener perfil público
    const { data: profile, error: profileErr } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, avatar_url, updated_at')
      .eq('id', auth.userId)
      .single()

    // Obtener detalles de la organización
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .select('id, name, slug, logo_url')
      .eq('id', auth.organizationId)
      .single()

    return NextResponse.json({
      data: {
        userId: auth.userId,
        email: auth.email,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        avatarUrl: profile?.avatar_url || null,
        organization: {
          id: auth.organizationId,
          name: org?.name || 'Mi Organización',
          slug: org?.slug || '',
          logoUrl: org?.logo_url || null,
          role: auth.role,
        },
      },
      requestId,
    })
  }
)
