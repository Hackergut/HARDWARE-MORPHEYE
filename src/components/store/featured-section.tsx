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
    <section className="relative overflow-hidden bg-[#0a0a0a] py-16">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-[#0a0a0a] to-teal-950/5" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/3 rounded-full blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">
                Featured Products
              </h2>
              {/* Rotating badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={badgeIndex}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
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
            <p className="mt-2 text-sm text-neutral-400">
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
                className="animate-pulse rounded-xl border border-neutral-800 bg-neutral-900"
              >
                <div className="aspect-square bg-neutral-800" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-neutral-800" />
                  <div className="h-5 w-1/3 rounded bg-neutral-800" />
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
      </div>
    </section>
  )
}
