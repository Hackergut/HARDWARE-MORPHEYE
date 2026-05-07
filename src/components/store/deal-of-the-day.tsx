'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Eye, Clock, Flame, Package, Truck, Zap } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { trackAddToCart } from '@/components/integrations/meta-pixel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DealProduct {
  id: string
  name: string
  slug: string
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  stock?: number
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function getTimeUntilMidnight(): TimeLeft {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()

  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex size-14 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 sm:size-16">
        <motion.span
          key={value}
          initial={{ y: -5, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="text-xl font-bold tabular-nums text-cyan-400 sm:text-2xl"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/10" />
      </div>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function DealOfTheDay() {
  const [product, setProduct] = useState<DealProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeUntilMidnight())
  const [imgError, setImgError] = useState(false)
  const [claimed] = useState(() => Math.floor(Math.random() * 41) + 40) // 40-80%
  const { navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)

  const fetchDeal = useCallback(async () => {
    try {
      const res = await fetch('/api/products?limit=50')
      if (res.ok) {
        const data = await res.json()
        const products: DealProduct[] = data.products || []
        // Find product with highest discount
        let bestDeal: DealProduct | null = null
        let bestDiscount = 0
        for (const p of products) {
          if (p.comparePrice && p.comparePrice > p.price) {
            const discount = p.comparePrice - p.price
            if (discount > bestDiscount) {
              bestDiscount = discount
              bestDeal = p
            }
          }
        }
        setProduct(bestDeal)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeal()
  }, [fetchDeal])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.slug,
    })
    trackAddToCart(product.price, 'USD', product.name)
    showNotification(`${product.name} added to cart`, 'success')
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="aspect-square w-full rounded-xl bg-muted md:w-80" />
              <div className="flex-1 space-y-4">
                <div className="h-6 w-40 rounded bg-muted" />
                <div className="h-8 w-64 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="flex gap-3">
                  <div className="size-16 rounded-lg bg-muted" />
                  <div className="size-16 rounded-lg bg-muted" />
                  <div className="size-16 rounded-lg bg-muted" />
                </div>
                <div className="h-10 w-full rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!product) return null

  const savings = product.comparePrice ? product.comparePrice - product.price : 0
  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0
  const mainImage = product.images?.[0]
  const isLowStock = product.stock !== undefined && product.stock !== null && product.stock <= 10

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/20"
            >
              <Zap className="size-5 text-black" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Deal of the Day</h2>
              <p className="text-sm text-muted-foreground">Our best discount — ends at midnight</p>
            </div>
          </div>

          {/* Main Card with gradient border */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500">
            {/* Animated gradient border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 opacity-60 blur-sm"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative rounded-[14px] bg-card p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                {/* Product Image */}
                <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-muted md:w-80 shrink-0">
                  <div className="aspect-square">
                    {mainImage && !imgError ? (
                      <Image
                        src={mainImage}
                        alt={product.name}
                        width={320}
                        height={320}
                        className="size-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="size-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {/* Discount badge on image */}
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-black shadow-lg shadow-amber-500/30">
                      <Flame className="mr-1 size-3" />
                      {discountPercent}% OFF
                    </Badge>
                  </div>
                  {product.brand && (
                    <div className="absolute right-3 top-3">
                      <Badge variant="secondary" className="border-border/50 bg-card/80 text-[10px] backdrop-blur-sm">
                        {product.brand}
                      </Badge>
                    </div>
                  )}
                  {/* Pulse glow on image */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-cyan-400/0"
                    animate={{ borderColor: ['rgba(6,182,212,0)', 'rgba(6,182,212,0.3)', 'rgba(6,182,212,0)'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>

                {/* Deal Details */}
                <div className="flex flex-1 flex-col gap-4">
                  {/* Product name & brand */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                      {product.name}
                    </h3>
                    {product.shortDesc && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {product.shortDesc}
                      </p>
                    )}
                  </div>

                  {/* Price section */}
                  <div className="flex flex-wrap items-end gap-3">
                    <motion.span
                      className="text-3xl font-bold text-cyan-400 sm:text-4xl"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      ${product.price.toFixed(2)}
                    </motion.span>
                    {product.comparePrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Savings badge */}
                  {savings > 0 && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                    >
                      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs font-semibold gap-1 px-3 py-1">
                        You save ${savings.toFixed(2)} ({discountPercent}%)
                      </Badge>
                    </motion.div>
                  )}

                  {/* Free Shipping badge for products over $150 */}
                  {product.price >= 150 && (
                    <div className="flex items-center gap-2 rounded-lg bg-cyan-500/8 border border-cyan-500/15 px-3 py-2">
                      <Truck className="size-4 text-cyan-400" />
                      <span className="text-xs font-medium text-cyan-400">Free Shipping</span>
                    </div>
                  )}

                  {/* Countdown Timer */}
                  <div className="mt-1">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Clock className="size-4 text-cyan-400" />
                      <span>Offer ends in:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TimeBlock value={timeLeft.hours} label="Hours" />
                      <span className="mt-[-16px] text-xl font-bold text-cyan-400">:</span>
                      <TimeBlock value={timeLeft.minutes} label="Min" />
                      <span className="mt-[-16px] text-xl font-bold text-cyan-400">:</span>
                      <TimeBlock value={timeLeft.seconds} label="Sec" />
                    </div>
                  </div>

                  {/* Claimed Progress Bar */}
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{claimed}% claimed</span>
                      <span className="text-muted-foreground">
                        {isLowStock ? `Only ${product.stock} left` : 'Limited stock'}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${claimed}%` }}
                        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500"
                        style={{
                          boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
                        }}
                      />
                    </div>
                    {isLowStock && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex items-center gap-1.5"
                      >
                        <Flame className="size-3 text-amber-400" />
                        <span className="text-xs font-medium text-amber-400">
                          Selling fast — {product.stock} remaining!
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 px-6"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 size-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('product', { productId: product.id })}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-300"
                      size="lg"
                    >
                      <Eye className="mr-2 size-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
