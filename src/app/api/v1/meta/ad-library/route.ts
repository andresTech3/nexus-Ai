import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchMetaAdLibrary } from '@/lib/meta/adLibrary'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || 'luna lamp'
    const country = searchParams.get('country') || 'ES'
    const mediaType = (searchParams.get('mediaType') || 'ALL') as 'ALL' | 'VIDEO' | 'IMAGE'

    // Try reading active Meta token from user session
    let accessToken: string | undefined = undefined
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: connection } = await supabase
          .from('social_connections')
          .select('access_token')
          .eq('user_id', user.id)
          .eq('provider', 'meta_ads')
          .maybeSingle()

        if (connection?.access_token) {
          accessToken = connection.access_token
        }
      }
    } catch {
      // Non-fatal if Supabase not ready or user unauthenticated
    }

    const result = await searchMetaAdLibrary({
      query,
      country,
      mediaType,
      accessToken,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in /api/v1/meta/ad-library:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error consultando la Biblioteca de Anuncios de Meta.',
      },
      { status: 500 }
    )
  }
}

