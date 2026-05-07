'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Eye, Package, Heart, ArrowLeftRight, Circle } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useNotificationStore } from '@/store/notification-store'
import { useComparisonStore } from '@/store/comparison-store'
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
      return { dotColor: 'bg-red-500', textColor: 'text-red-400', label: 'Out of Stock' }
    case 'low-stock':
      return { dotColor: 'bg-amber-500', textColor: 'text-amber-400', label: 'Low Stock' }
    default:
      return { dotColor: 'bg-emerald-500', textColor: 'text-emerald-400', label: 'In Stock' }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const [heartAnimating, setHeartAnimating] = useState(false)
  const { navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const showNotification = useNotificationStore((s) => s.show)
  const { addItem: addComparisonItem, removeItem: removeComparisonItem, isInComparison } = useComparisonStore()

  const inWishlist = isInWishlist(product.id)
  const inComparison = isInComparison(product.id)
  const mainImage = product.images?.[0]
  const discount = calculateDiscount(product.price, product.comparePrice)
  const stockStatus = getStockStatus(product.stock)
  const stockConfig = getStockConfig(stockStatus)

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-[#111111] transition-all duration-300 hover-lift shine-effect ${
        inComparison
          ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
          : 'border-neutral-800 hover:border-cyan-500/20'
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

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.brand && (
            <Badge
              variant="secondary"
              className="border-neutral-700 bg-neutral-900/90 text-[10px] text-neutral-300 backdrop-blur-sm"
            >
              {product.brand}
            </Badge>
          )}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
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
        <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-cyan-400">
          {product.name}
        </h3>
        {product.shortDesc && (
          <p className="mb-3 line-clamp-2 text-xs text-neutral-400">
            {product.shortDesc}
          </p>
        )}

        {/* Rating */}
        {(product.rating ?? 0) > 0 && (
          <div className="mb-3 flex items-center gap-1">
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
            </div>
            {/* Stock indicator */}
            <div className="flex items-center gap-1.5">
              <Circle className={`size-1.5 fill-current ${stockConfig.dotColor} ${stockConfig.textColor}`} />
              <span className={`text-[10px] ${stockConfig.textColor}`}>
                {stockConfig.label}
              </span>
            </div>
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
                navigate('product', { productId: product.id })
              }}
              className="size-8 text-neutral-400 transition-all duration-300 hover:text-cyan-400"
              title="View Details"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
