'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CurrencyCode,
  CURRENCIES,
  getSavedCurrency,
  saveCurrency,
  formatMoney,
} from '@/lib/currency'
import { useOfficeStore } from '@/lib/office/store'

export function useCurrency() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const officeCurrency = (activeOffice?.settings?.currency as CurrencyCode) || 'EUR'

  const [currency, setLocalCurrency] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      return getSavedCurrency() || officeCurrency
    }
    return officeCurrency
  })

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent<CurrencyCode>
      if (customEvent.detail && CURRENCIES[customEvent.detail]) {
        setLocalCurrency(customEvent.detail)
      }
    }

    window.addEventListener('nexus_currency_changed', handleCurrencyChange)
    return () => {
      window.removeEventListener('nexus_currency_changed', handleCurrencyChange)
    }
  }, [])

  const changeCurrency = useCallback(
    (newCurrency: CurrencyCode) => {
      if (!CURRENCIES[newCurrency]) return
      setLocalCurrency(newCurrency)
      saveCurrency(newCurrency)
      if (store.setCurrency) {
        store.setCurrency(newCurrency)
      }
    },
    [store]
  )

  const format = useCallback(
    (amountInEur: number) => {
      return formatMoney(amountInEur, currency)
    },
    [currency]
  )

  return {
    currency,
    currencyConfig: CURRENCIES[currency],
    setCurrency: changeCurrency,
    formatMoney: format,
    availableCurrencies: Object.values(CURRENCIES),
  }
}
