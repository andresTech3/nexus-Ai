/**
 * CJ Dropshipping Open API v2.0 Client
 * Official integration for real supplier products, live inventory, and factory costs.
 */

export interface CJProduct {
  id: string
  name: string
  sku: string
  image: string
  supplierPriceUsd: number
  supplierPriceEur: number
  suggestedSellPriceEur: number
  marginMultiple: number
  grossProfitEur: number
  stockQuantity: number
  listedCount: number
  hasVideo: boolean
  category: string
}

let cachedToken: string | null = null
let tokenExpiryTimestamp: number = 0

const USD_TO_EUR_ESTIMATE = 0.92

export async function getCJAccessToken(): Promise<string> {
  const apiKey =
    process.env.CJ_DROPSHIPPING_API_KEY ||
    'CJ5387534@api@63b939e84a274c17a1825827ddab7d50'

  // Return cached token if valid for at least 1 hour
  if (cachedToken && Date.now() < tokenExpiryTimestamp - 3600 * 1000) {
    return cachedToken
  }

  const endpoint = 'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken'
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  })

  if (!res.ok) {
    throw new Error(`Error de autenticación CJ Dropshipping: HTTP ${res.status}`)
  }

  const data = await res.json()
  if (!data.result || !data.data?.accessToken) {
    throw new Error(`CJ Dropshipping API error: ${data.message || 'Token no generado'}`)
  }

  cachedToken = data.data.accessToken
  // Parse expiry if present, else default to 24 hours
  if (data.data.accessTokenExpiryDate) {
    tokenExpiryTimestamp = new Date(data.data.accessTokenExpiryDate).getTime()
  } else {
    tokenExpiryTimestamp = Date.now() + 24 * 3600 * 1000
  }

  return cachedToken
}

function parsePriceToNumber(rawPrice: any): number {
  if (typeof rawPrice === 'number') return rawPrice
  if (!rawPrice || typeof rawPrice !== 'string') return 10.0

  // Handles "11.61 -- 12.94" or "$11.61"
  const clean = rawPrice.replace(/[^\d.\- ]/g, '').trim()
  if (clean.includes('--')) {
    const parts = clean.split('--').map((p) => parseFloat(p.trim())).filter((n) => !isNaN(n))
    if (parts.length > 0) return parts[0]
  }
  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 10.0 : parsed
}

export async function searchCJProducts(params: {
  keyword: string
  page?: number
  size?: number
  countryCode?: string
}): Promise<CJProduct[]> {
  const { keyword, page = 1, size = 12, countryCode } = params
  const token = await getCJAccessToken()

  const url = new URL('https://developers.cjdropshipping.com/api2.0/v1/product/listV2')
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))
  url.searchParams.set('keyWord', keyword)
  if (countryCode) {
    url.searchParams.set('countryCode', countryCode)
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'CJ-Access-Token': token,
    },
  })

  if (!res.ok) {
    throw new Error(`Error consultando productos CJ Dropshipping: HTTP ${res.status}`)
  }

  const data = await res.json()
  if (!data.result || !data.data?.content) {
    return []
  }

  const rawList: any[] = data.data.content[0]?.productList || []

  return rawList.map((item: any): CJProduct => {
    const priceUsd = parsePriceToNumber(item.sellPrice)
    const priceEur = parseFloat((priceUsd * USD_TO_EUR_ESTIMATE).toFixed(2))

    // Recommended margin multiple between 3.5x and 4.2x for healthy unit economics
    const multiplier = priceEur < 10 ? 4.2 : priceEur < 30 ? 3.6 : 3.2
    const rawSuggested = priceEur * multiplier
    // Round to psychological pricing e.g. 29.90, 49.90
    const suggestedSellPriceEur = parseFloat((Math.ceil(rawSuggested / 5) * 5 - 0.1).toFixed(2))
    const grossProfitEur = parseFloat((suggestedSellPriceEur - priceEur).toFixed(2))

    return {
      id: item.id || item.pid || `cj-${Date.now()}`,
      name: item.nameEn || item.productNameEn || 'Producto en Tendencia CJ',
      sku: item.sku || 'CJ-SKU',
      image: item.bigImage || item.productImage || '',
      supplierPriceUsd: priceUsd,
      supplierPriceEur: priceEur,
      suggestedSellPriceEur,
      marginMultiple: parseFloat((suggestedSellPriceEur / Math.max(priceEur, 1)).toFixed(1)),
      grossProfitEur,
      stockQuantity: item.warehouseInventoryNum || 0,
      listedCount: item.listedNum || 0,
      hasVideo: item.isVideo === 1 || item.isVedio === 1 || (item.videoList && item.videoList.length > 0),
      category: item.categoryName || item.twoCategoryName || 'Dropshipping Ganador',
    }
  })
}
