'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Package, ChevronLeft, ChevronRight, ShoppingCart, Trash2 } from 'lucide-react'
import { useRecentlyViewedStore } from '@/store/recently-viewed-store'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  rating?: number
  stock?: number
}

export function RecentlyViewedSection() {
  const productIds = useRecentlyViewedStore((s) => s.productIds)
  const clearAll = useRecentlyViewedStore((s) => s.clearAll)
  const navigate = useNavigationStore((s) => s.navigate)
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

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

  // Check scroll position for arrow visibility
  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollContainerRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    return () => el.removeEventListener('scroll', checkScroll)
  }, [products, loading])

  if (productIds.length === 0 || (!loading && products.length === 0)) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 280
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.slug,
    })
    showNotification(`${product.name} added to cart`, 'success')
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
            <h2 className="text-xl font-bold text-foreground">Recently Viewed</h2>
            <p className="text-xs text-muted-foreground">Products you&apos;ve explored</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-neutral-500 hover:text-red-400 h-7 px-2"
            >
              <Trash2 className="size-3 mr-1" />
              Clear
            </Button>
          )}
          {/* Scroll Arrow Buttons */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`flex size-8 items-center justify-center rounded-full border transition ${
              canScrollLeft
                ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                : 'border-border text-muted-foreground cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`flex size-8 items-center justify-center rounded-full border transition ${
              canScrollRight
                ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                : 'border-border text-muted-foreground cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Left fade gradient */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
        )}
        {/* Right fade gradient */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
        )}

        <div
          ref={scrollContainerRef}
          className="custom-scrollbar flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: Math.min(productIds.length, 4) }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="w-60 shrink-0 animate-pulse rounded-xl border border-border bg-card p-3"
                  >
                    <div className="mb-3 aspect-square rounded-lg bg-muted" />
                    <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                    <div className="h-5 w-1/2 rounded bg-muted" />
                  </div>
                ))
              : products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group w-60 shrink-0 overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
                  >
                    {/* Image */}
                    <div
                      className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
                      onClick={() => navigate('product', { productId: product.id })}
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="240px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="size-8 text-muted-foreground" />
                        </div>
                      )}
                      {product.brand && (
                        <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
                          {product.brand}
                        </span>
                      )}
                      {/* Rating badge */}
                      {product.rating && product.rating > 0 && (
                        <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-amber-400 backdrop-blur-sm">
                          ★ {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Info + Quick Actions */}
                    <div className="p-3">
                      <h3
                        className="mb-1 line-clamp-1 text-sm font-medium text-foreground cursor-pointer transition-colors hover:text-cyan-400"
                        onClick={() => navigate('product', { productId: product.id })}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-base font-bold text-cyan-400">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-xs text-neutral-500 line-through">
                            ${product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {/* Quick Add to Cart */}
                      <Button
                        onClick={(e) => handleAddToCart(e, product)}
                        size="sm"
                        className="w-full h-8 text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-200"
                        variant="outline"
                      >
                        <ShoppingCart className="size-3.5 mr-1.5" />
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}
