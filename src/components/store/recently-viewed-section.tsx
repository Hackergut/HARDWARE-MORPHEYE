'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRecentlyViewedStore } from '@/store/recently-viewed-store'
import { useNavigationStore } from '@/store/navigation-store'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  rating?: number
}

export function RecentlyViewedSection() {
  const productIds = useRecentlyViewedStore((s) => s.productIds)
  const navigate = useNavigationStore((s) => s.navigate)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          productIds.map(async (id) => {
            const res = await fetch(`/api/products/${id}`)
            if (res.ok) {
              const data = await res.json()
              return data.product || data
            }
            return null
          })
        )
        setProducts(
          results
            .filter((p): p is Product => p !== null)
            .sort((a, b) => {
              const aIdx = productIds.indexOf(a.id)
              const bIdx = productIds.indexOf(b.id)
              return aIdx - bIdx
            })
        )
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [productIds])

  if (productIds.length === 0 || (!loading && products.length === 0)) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef) return
    const scrollAmount = 240
    scrollRef.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-500/10">
            <Clock className="size-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Recently Viewed</h2>
            <p className="text-xs text-neutral-500">Products you&apos;ve explored</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex size-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex size-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={setScrollRef}
        className="custom-scrollbar flex gap-4 overflow-x-auto pb-2"
      >
        <AnimatePresence mode="popLayout">
          {loading
            ? Array.from({ length: Math.min(productIds.length, 4) }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="w-52 shrink-0 animate-pulse rounded-xl border border-neutral-800 bg-[#111111] p-3"
                >
                  <div className="mb-3 aspect-square rounded-lg bg-neutral-800" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-neutral-800" />
                  <div className="h-5 w-1/2 rounded bg-neutral-800" />
                </div>
              ))
            : products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => navigate('product', { productId: product.id })}
                  className="group w-52 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-neutral-800 bg-[#111111] p-3 transition-all hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-neutral-800">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="208px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="size-8 text-neutral-600" />
                      </div>
                    )}
                    {product.brand && (
                      <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-neutral-300 backdrop-blur-sm">
                        {product.brand}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-1 line-clamp-1 text-sm font-medium text-white">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-cyan-400">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-xs text-neutral-500 line-through">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
