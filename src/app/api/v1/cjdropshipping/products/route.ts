import { NextRequest, NextResponse } from 'next/server'
import { searchCJProducts } from '@/lib/cjdropshipping/client'
import { getGoogleTrendsInterest } from '@/lib/trends/googleTrends'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get('keyword') || 'moon lamp'
    const geo = searchParams.get('geo') || 'ES'
    const size = parseInt(searchParams.get('size') || '8', 10)

    // Execute in parallel: CJ Dropshipping live products + Google Trends interest
    const [products, trends] = await Promise.all([
      searchCJProducts({ keyword, size }).catch((err) => {
        console.error('CJ fetch error in route:', err)
        return []
      }),
      getGoogleTrendsInterest({ keyword, geo }).catch((err) => {
        console.error('Trends fetch error in route:', err)
        return null
      }),
    ])

    return NextResponse.json({
      success: true,
      data_source: 'CJ_DROPSHIPPING_OFFICIAL_API_V2',
      trends_source: 'GOOGLE_TRENDS_REALTIME',
      keyword,
      geo,
      trends,
      total_products: products.length,
      products,
    })
  } catch (error: any) {
    console.error('API /api/v1/cjdropshipping/products error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error consultando APIs de proveedores y tendencias.',
      },
      { status: 500 }
    )
  }
}
