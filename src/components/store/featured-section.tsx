'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Flame, Sparkles, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from './product-card'

interface Product {
  id: string
  name: string
  slug: string
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  featured?: boolean
  rating?: number
  reviewCount?: number
  stock?: number
}

const rotatingBadges = [
  { icon: Sparkles, label: 'New', color: 'bg-cyan-500' },
  { icon: Flame, label: 'Hot', color: 'bg-amber-500' },
  { icon: TrendingUp, label: 'Best Seller', color: 'bg-emerald-500' },
]

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [badgeIndex, setBadgeIndex] = useState(0)
  const { navigate } = useNavigationStore()

  useEffect(() => {
    fetchFeatured()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % rotatingBadges.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchFeatured = async () => {
    try {
      const res = await fetch('/api/products?featured=true&limit=6')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-background py-16">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 dark:from-cyan-950/10 from-cyan-50 via-[#0a0a0a] dark:via-[#0a0a0a] via-white to-teal-950/5 dark:to-teal-950/5 to-teal-50" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/3 rounded-full blur-[150px]" />

      {/* Animated dot grid background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35] dark:opacity-100">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.12) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Animated floating dots */}
        <motion.div
          className="absolute size-2 rounded-full bg-cyan-500/25"
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '20%', left: '10%' }}
        />
        <motion.div
          className="absolute size-1.5 rounded-full bg-teal-400/20"
          animate={{
            y: [0, -20, 0],
            x: [0, -15, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '40%', right: '15%' }}
        />
        <motion.div
          className="absolute size-2.5 rounded-full bg-cyan-400/15"
          animate={{
            y: [0, -25, 0],
            x: [0, 8, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '25%', left: '25%' }}
        />
        <motion.div
          className="absolute size-1 rounded-full bg-teal-500/30"
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ top: '60%', right: '30%' }}
        />
        <motion.div
          className="absolute size-2 rounded-full bg-cyan-500/20"
          animate={{
            y: [0, -20, 0],
            x: [0, 12, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ bottom: '15%', right: '10%' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">
                Featured Products
              </h2>
              {/* Rotating badge with smoother transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={badgeIndex}
                  initial={{ y: -12, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 12, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Badge className={`${rotatingBadges[badgeIndex].color} text-[10px] font-bold text-black gap-1`}>
                    {(() => {
                      const Icon = rotatingBadges[badgeIndex].icon
                      return <Icon className="size-3" />
                    })()}
                    {rotatingBadges[badgeIndex].label}
                  </Badge>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Gradient underline */}
            <div className="mt-2 h-0.5 w-32 bg-gradient-to-r from-cyan-500 via-teal-500 to-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">
              Handpicked by our security experts
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('shop')}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Shop All
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-border bg-card"
              >
                <div className="aspect-square bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-5 w-1/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Products CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <Button
            onClick={() => navigate('shop')}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/30 hover:from-cyan-400 hover:to-teal-400"
          >
            <span className="relative z-10 flex items-center gap-2">
              View All Products
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
