'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Eye, Package } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
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
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const { navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)

  const mainImage = product.images?.[0]
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : null

  const handleAddToCart = (e: React.MouseEvent) => {
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-shadow hover:shadow-lg hover:shadow-emerald-500/5"
      onClick={() => navigate('product', { productId: product.id })}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800">
        {mainImage && !imgError ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            <Badge className="bg-emerald-500 text-[10px] font-bold text-black">
              Featured
            </Badge>
          )}
          {discount && (
            <Badge className="bg-amber-500 text-[10px] font-bold text-black">
              -{discount}%
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-white">
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

        {/* Price + Actions */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-emerald-500">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-neutral-500 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAddToCart}
              className="size-8 text-neutral-400 hover:bg-emerald-500/10 hover:text-emerald-500"
              title="Add to Cart"
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
              className="size-8 text-neutral-400 hover:text-emerald-500/10 hover:text-emerald-500"
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
