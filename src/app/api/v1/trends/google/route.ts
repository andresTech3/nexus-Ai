import { NextRequest, NextResponse } from 'next/server'
import { getGoogleTrendsInterest } from '@/lib/trends/googleTrends'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get('keyword')
    const geo = searchParams.get('geo') || 'ES'
    const days = parseInt(searchParams.get('days') || '30', 10)

    if (!keyword) {
      return NextResponse.json({ error: 'Parámetro keyword es requerido' }, { status: 400 })
    }

    const trends = await getGoogleTrendsInterest({ keyword, geo, days })

    return NextResponse.json({
      success: true,
      source: 'GOOGLE_TRENDS_OFFICIAL_REALTIME',
      keyword,
      geo,
      data: trends,
    })
  } catch (error: any) {
    console.error('API /api/v1/trends/google error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error consultando Google Trends' },
      { status: 500 }
    )
  }
}

