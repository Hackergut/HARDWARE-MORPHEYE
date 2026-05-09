'use client'

import { useCurrencyStore, type CurrencyCode } from '@/store/currency-store'
import { cn } from '@/lib/utils'

const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  BTC: '₿',
  ETH: 'Ξ',
}

interface LocalizedPriceProps {
  usdPrice: number
  className?: string
  showOriginal?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LocalizedPrice({
  usdPrice,
  className,
  showOriginal = true,
  size = 'md',
}: LocalizedPriceProps) {
  const { currentCurrency, rates } = useCurrencyStore()

  const rate = rates[currentCurrency] || 1
  const converted = usdPrice * rate

  const formatPrice = (value: number, code: CurrencyCode) => {
    if (code === 'BTC') {
      return value < 0.001 ? value.toFixed(6) : value.toFixed(4)
    }
    if (code === 'ETH') {
      return value < 0.01 ? value.toFixed(4) : value.toFixed(2)
    }
    return value.toFixed(2)
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  const isCrypto = currentCurrency === 'BTC' || currentCurrency === 'ETH'

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('font-semibold text-cyan-400', sizeClasses[size])}>
        {currencySymbols[currentCurrency]}{formatPrice(converted, currentCurrency)}
        {isCrypto && <span className="ml-0.5 text-[10px] text-muted-foreground">{currentCurrency}</span>}
      </span>
      {showOriginal && currentCurrency !== 'USD' && (
        <span className="text-[10px] text-muted-foreground">
          (~${usdPrice.toFixed(2)})
        </span>
      )}
    </span>
  )
}
