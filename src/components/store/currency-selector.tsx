'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrencyStore, type CurrencyCode } from '@/store/currency-store'

const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'BTC', label: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', label: 'Ethereum', symbol: 'Ξ' },
]

export function CurrencySelector() {
  const { currentCurrency, setCurrency } = useCurrencyStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const active = currencies.find((c) => c.code === currentCurrency) || currencies[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
          open
            ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
            : 'border-border text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400'
        )}
      >
        <span>{active.symbol}</span>
        <span>{active.code}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          >
            {currencies.map((cur) => (
              <button
                key={cur.code}
                onClick={() => {
                  setCurrency(cur.code)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors',
                  cur.code === currentCurrency
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <span className="w-5 text-center text-base">{cur.symbol}</span>
                <div className="flex-1">
                  <span className="font-medium">{cur.code}</span>
                  <span className="ml-1.5 text-xs text-muted-foreground">{cur.label}</span>
                </div>
                {cur.code === currentCurrency && (
                  <Check className="size-4 shrink-0 text-cyan-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
