/**
 * Cart Calculator - Single Responsibility: Pure calculation logic for cart
 * Follows: SRP - Only handles cart math, no state management
 * Follows: OCP - Can be extended with new calculation rules
 */

import type { CartItem } from '@/lib/types'

const DEFAULT_SHIPPING_FEE = 9.99
const FREE_SHIPPING_THRESHOLD = 150
const TAX_RATE = 0

export interface CartCalculation {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
  isEligibleForFreeShipping: boolean
  amountUntilFreeShipping: number
}

export function calculateCart(items: CartItem[]): CartCalculation {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isEligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
  const shipping = isEligibleForFreeShipping ? 0 : DEFAULT_SHIPPING_FEE
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
    isEligibleForFreeShipping,
    amountUntilFreeShipping: Math.round(amountUntilFreeShipping * 100) / 100,
  }
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function calculateDiscount(price: number, comparePrice: number | null | undefined): number | null {
  if (!comparePrice || comparePrice <= price) return null
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export function getStockStatus(stock: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (stock <= 0) return 'out_of_stock'
  if (stock <= 5) return 'low_stock'
  return 'in_stock'
}
