import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH'

export interface CurrencyState {
  currentCurrency: CurrencyCode
  rates: Record<CurrencyCode, number>
  setCurrency: (currency: CurrencyCode) => void
  setRates: (rates: Record<CurrencyCode, number>) => void
}

const defaultRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  BTC: 0.000015,
  ETH: 0.00028,
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currentCurrency: 'USD',
      rates: defaultRates,
      setCurrency: (currency) => set({ currentCurrency: currency }),
      setRates: (rates) => set({ rates }),
    }),
    {
      name: 'morpheye-currency',
      partialize: (state) => ({
        currentCurrency: state.currentCurrency,
        rates: state.rates,
      }),
    }
  )
)
