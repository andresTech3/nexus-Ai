/**
 * Universal Currency System for Nexus Dropshipping OS
 * Supports EUR, USD, COP, and MXN with live formatting and conversion.
 */

export type CurrencyCode = 'EUR' | 'USD' | 'COP' | 'MXN'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  name: string
  flag: string
  rateFromEur: number // 1 EUR = X in this currency
  formatDecimals: number
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateFromEur: 1.0,
    formatDecimals: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Estadounidense',
    flag: '🇺🇸',
    rateFromEur: 1.08,
    formatDecimals: 2,
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Peso Mexicano',
    flag: '🇲🇽',
    rateFromEur: 21.5,
    formatDecimals: 2,
  },
  COP: {
    code: 'COP',
    symbol: '$',
    name: 'Peso Colombiano',
    flag: '🇨🇴',
    rateFromEur: 4400.0,
    formatDecimals: 0,
  },
}

const LOCAL_STORAGE_KEY = 'nexus_preferred_currency'

export function getSavedCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'EUR'
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as CurrencyCode
  return saved && CURRENCIES[saved] ? saved : 'EUR'
}

export function saveCurrency(currency: CurrencyCode): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_STORAGE_KEY, currency)
  // Dispatch custom event so all open views update instantly without full reload
  window.dispatchEvent(new CustomEvent('nexus_currency_changed', { detail: currency }))
}

/**
 * Converts a base price in EUR to the target currency and formats it cleanly.
 * Example:
 * formatMoney(29.90, 'EUR') -> "29,90 €"
 * formatMoney(29.90, 'USD') -> "$32.29 USD"
 * formatMoney(29.90, 'MXN') -> "$642.85 MXN"
 * formatMoney(29.90, 'COP') -> "$131.560 COP"
 */
export function formatMoney(amountInEur: number, targetCurrency: CurrencyCode = 'EUR'): string {
  const cfg = CURRENCIES[targetCurrency] || CURRENCIES.EUR
  const converted = amountInEur * cfg.rateFromEur

  if (targetCurrency === 'COP') {
    const formatted = Math.round(converted).toLocaleString('es-CO')
    return `$${formatted} COP`
  }

  if (targetCurrency === 'MXN') {
    const formatted = converted.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return `$${formatted} MXN`
  }

  if (targetCurrency === 'USD') {
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return `$${formatted} USD`
  }

  // EUR default
  const formatted = converted.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${formatted} €`
}
