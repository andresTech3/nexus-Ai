import { NextRequest, NextResponse } from 'next/server'
import { searchCJProducts } from '@/lib/cjdropshipping/client'
import { getGoogleTrendsInterest } from '@/lib/trends/googleTrends'
import { searchMetaAdLibrary } from '@/lib/meta/adLibrary'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get('keyword') || 'moon lamp'
    const geo = searchParams.get('geo') || 'ES'
    const size = parseInt(searchParams.get('size') || '16', 10)
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const minStock = searchParams.get('minStock') ? parseInt(searchParams.get('minStock')!, 10) : undefined
    const sortBy = (searchParams.get('sortBy') || 'profit') as any

    // Execute in parallel: CJ Dropshipping live products + Google Trends interest + Meta Ad Library competitor ads
    const [cjResult, trends, metaAds] = await Promise.all([
      searchCJProducts({ keyword, size, minPrice, maxPrice, minStock, sortBy }).catch((err) => {
        console.error('CJ fetch error in route:', err)
        return { products: [], originalQuery: keyword, queryUsed: keyword, wasTranslated: false }
      }),
      getGoogleTrendsInterest({ keyword, geo }).catch((err) => {
        console.error('Trends fetch error in route:', err)
        return null
      }),
      searchMetaAdLibrary({ query: keyword, country: geo }).catch((err) => {
        console.error('Meta Ad Library fetch error in route:', err)
        return null
      }),
    ])

    return NextResponse.json({
      success: true,
      data_source: 'CJ_DROPSHIPPING_OFFICIAL_API_V2',
      trends_source: 'GOOGLE_TRENDS_REALTIME',
      competitors_source: 'META_AD_LIBRARY_OFFICIAL_V22',
      keyword,
      query_used: cjResult.queryUsed,
      was_translated: cjResult.wasTranslated,
      geo,
      trends,
      meta_ads: metaAds,
      total_products: cjResult.products.length,
      products: cjResult.products,
    })
  } catch (error: any) {
    console.error('API /api/v1/cjdropshipping/products error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error consultando APIs de proveedores, tendencias y competencia.',
      },
      { status: 500 }
    )
  }
}

