'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Eye, Package, Heart, ArrowLeftRight, Circle, Flame, Sparkles } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useNotificationStore } from '@/store/notification-store'
import { useComparisonStore } from '@/store/comparison-store'
import { useQuickViewStore } from '@/store/quick-view-store'
import { trackAddToCart } from '@/components/integrations/meta-pixel'
import { calculateDiscount } from '@/lib/utils/cart-calculator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface ProductCardProps {
  product: {
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
    createdAt?: string | Date | null
  }
}

type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

function getStockStatus(stock?: number): StockStatus {
  if (stock === undefined || stock === null) return 'in-stock'
  if (stock === 0) return 'out-of-stock'
  if (stock <= 10) return 'low-stock'
  return 'in-stock'
}

function getStockConfig(status: StockStatus) {
  switch (status) {
    case 'out-of-stock':
      return { dotColor: 'bg-red-500', textColor: 'text-red-400', label: 'Out of Stock', barColor: 'bg-red-500' }
    case 'low-stock':
      return { dotColor: 'bg-amber-500', textColor: 'text-amber-400', label: 'Low Stock', barColor: 'bg-amber-500' }
    default:
      return { dotColor: 'bg-emerald-500', textColor: 'text-emerald-400', label: 'In Stock', barColor: 'bg-emerald-500' }
  }
}

function isNewProduct(createdAt?: string | Date | null): boolean {
  if (!createdAt) return false
  const date = new Date(createdAt)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return date > thirtyDaysAgo
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const [heartAnimating, setHeartAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const showNotification = useNotificationStore((s) => s.show)
  const { addItem: addComparisonItem, removeItem: removeComparisonItem, isInComparison } = useComparisonStore()
  const openQuickView = useQuickViewStore((s) => s.open)

  const inWishlist = isInWishlist(product.id)
  const inComparison = isInComparison(product.id)
  const mainImage = product.images?.[0]
  const discount = calculateDiscount(product.price, product.comparePrice)
  const stockStatus = getStockStatus(product.stock)
  const stockConfig = getStockConfig(stockStatus)
  const isNew = isNewProduct(product.createdAt)

  // IntersectionObserver for viewport entrance animation
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (stockStatus === 'out-of-stock') return
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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setHeartAnimating(true)
    setTimeout(() => setHeartAnimating(false), 300)
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.slug,
    })
    showNotification(
      inWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
      inWishlist ? 'info' : 'success'
    )
  }

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inComparison) {
      removeComparisonItem(product.id)
      showNotification(`${product.name} removed from comparison`, 'info')
    } else {
      addComparisonItem(product.id)
      showNotification(`${product.name} added to comparison`, 'success')
    }
  }

  // Stock level for progress bar (0-100)
  const stockLevel = product.stock !== undefined && product.stock !== null
    ? Math.min(100, (product.stock / 50) * 100)
    : 100

  // Rating percentage for rating bar
  const ratingPercent = product.rating ? (product.rating / 5) * 100 : 0

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border dark:bg-[#111111] bg-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 shine-effect ${
        inComparison
          ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
          : 'dark:border-neutral-800 border-neutral-200 hover:border-cyan-500/20'
      }`}
      onClick={() => navigate('product', { productId: product.id })}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        {mainImage && !imgError ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="size-12 text-neutral-600" />
          </div>
        )}

        {/* Gradient overlay at bottom for better text readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t dark:from-[#111111] from-white to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.brand && (
            <Badge
              variant="secondary"
              className="border-neutral-600/50 bg-neutral-900/80 text-[10px] text-neutral-300 backdrop-blur-sm shadow-sm"
            >
              {product.brand}
            </Badge>
          )}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {isNew && (
            <Badge className="bg-gradient-to-r from-cyan-500 to-teal-400 text-[10px] font-bold text-black shadow-md shadow-cyan-500/20">
              <Sparkles className="mr-0.5 size-3" />
              New
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-cyan-500 text-[10px] font-bold text-black badge-pulse">
              Featured
            </Badge>
          )}
          {discount && (
            <Badge className="bg-amber-500 text-[10px] font-bold text-black">
              -{discount}%
            </Badge>
          )}
          {/* Hot badge for highly rated products with many reviews */}
          {(product.rating ?? 0) > 4.7 && (product.reviewCount ?? 0) > 1000 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-[10px] font-bold text-white shadow-lg shadow-orange-500/30">
              <Flame className="mr-0.5 size-3" />
              Hot
            </Badge>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute left-3 bottom-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={inWishlist ? 'filled' : 'outline'}
              initial={{ scale: heartAnimating ? 1.4 : 1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Heart
                className={`size-4 ${
                  inWishlist
                    ? 'fill-red-500 text-red-500'
                    : 'text-white/70 hover:text-red-400'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Compare Button */}
        <button
          onClick={handleComparisonToggle}
          className={`absolute right-3 bottom-3 z-10 flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
            inComparison
              ? 'bg-cyan-500 text-black hover:bg-cyan-400'
              : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-cyan-400'
          }`}
          title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
        >
          <ArrowLeftRight className="size-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-1 text-sm font-semibold dark:text-white text-neutral-900 transition-colors duration-300 group-hover:text-cyan-400">
          {product.name}
        </h3>
        {product.shortDesc && (
          <p className="mb-3 line-clamp-2 text-xs text-neutral-400">
            {product.shortDesc}
          </p>
        )}

        {/* Rating with progress bar */}
        {(product.rating ?? 0) > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-neutral-600'
                  }`}
                />
              ))}
              {product.reviewCount ? (
                <span className="ml-1 text-[10px] text-neutral-500">
                  ({product.reviewCount})
                </span>
              ) : null}
            </div>
            {/* Rating progress bar */}
            <div className="mt-1.5 h-1 overflow-hidden rounded-full dark:bg-neutral-800 bg-neutral-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ratingPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-400"
              />
            </div>
          </div>
        )}

        {/* Price + Stock + Actions */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-cyan-400">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-neutral-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
              {/* Low stock pulsing badge */}
              {stockStatus === 'low-stock' && product.stock !== undefined && product.stock !== null && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-md bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20"
                >
                  Only {product.stock} left!
                </motion.span>
              )}
            </div>
            {/* Stock indicator */}
            <div className="flex items-center gap-1.5">
              <Circle className={`size-1.5 fill-current ${stockConfig.dotColor} ${stockConfig.textColor}`} />
              <span className={`text-[10px] ${stockConfig.textColor}`}>
                {stockConfig.label}
              </span>
            </div>
            {/* Selling Fast text for low stock */}
            {stockStatus === 'low-stock' && (
              <span className="text-[10px] font-medium text-amber-400">
                Selling Fast
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAddToCart}
              disabled={stockStatus === 'out-of-stock'}
              className={`size-8 text-neutral-400 transition-all duration-300 ${
                stockStatus === 'out-of-stock'
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-cyan-500/10 hover:text-cyan-400 cyan-glow-hover'
              }`}
              title={stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingCart className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                openQuickView(product.id)
              }}
              className="size-8 text-neutral-400 transition-all duration-300 hover:text-cyan-400"
              title="Quick View"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stock level progress bar at bottom */}
      <div className="h-1 w-full dark:bg-neutral-800 bg-neutral-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stockLevel}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className={`h-full ${
            stockStatus === 'out-of-stock'
              ? 'bg-red-500'
              : stockStatus === 'low-stock'
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
          }`}
        />
      </div>
    </motion.div>
  )
}
