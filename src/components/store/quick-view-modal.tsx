'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Package, Eye, Circle, BadgeCheck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useQuickViewStore } from '@/store/quick-view-store'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { trackAddToCart } from '@/components/integrations/meta-pixel'
import { calculateDiscount } from '@/lib/utils/cart-calculator'

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
  category?: { name: string; slug: string }
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

export function QuickViewModal() {
  const { isOpen, selectedProductId, close } = useQuickViewStore()
  const { navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (isOpen && selectedProductId) {
      fetchProduct(selectedProductId)
      setImgError(false)
    } else {
      setProduct(null)
    }
  }, [isOpen, selectedProductId])

  const fetchProduct = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        // Parse JSON fields
        const parsed = {
          ...data,
          images: (() => { try { return JSON.parse(data.images || '[]') } catch { return [] } })(),
        }
        setProduct(parsed)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    const stockStatus = getStockStatus(product.stock)
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

  const handleViewFullDetails = () => {
    if (!product) return
    close()
    navigate('product', { productId: product.id })
  }

  const stockStatus = product ? getStockStatus(product.stock) : 'in-stock'
  const stockConfig = getStockConfig(stockStatus)
  const discount = product ? calculateDiscount(product.price, product.comparePrice) : null
  const mainImage = product?.images?.[0]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) close() }}>
      <DialogContent className="border-border bg-card text-card-foreground sm:max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="size-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : product ? (
          <div className="space-y-0">
            <DialogHeader className="sr-only">
              <DialogTitle>{product.name}</DialogTitle>
              <DialogDescription>{product.shortDesc || 'Product quick view'}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card">
                {mainImage && !imgError ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="size-16 text-muted-foreground" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                  {product.brand && (
                    <Badge
                      variant="secondary"
                      className="border-border bg-card/90 text-[10px] text-muted-foreground backdrop-blur-sm"
                    >
                      {product.brand}
                    </Badge>
                  )}
                </div>
                <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                  {product.featured && (
                    <Badge className="bg-cyan-500 text-[10px] font-bold text-black">
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

              {/* Product Details */}
              <div className="flex flex-col">
                {/* Name */}
                <h2 className="text-lg font-bold text-foreground">
                  {product.name}
                </h2>

                {/* Rating */}
                {(product.rating ?? 0) > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating?.toFixed(1)}
                    </span>
                    {product.reviewCount ? (
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount} reviews)
                      </span>
                    ) : null}
                  </div>
                )}

                {/* Short Description */}
                {product.shortDesc && (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {product.shortDesc}
                  </p>
                )}

                {/* Category */}
                {product.category && (
                  <div className="mt-3">
                    <Badge
                      variant="outline"
                      className="border-border text-[10px] text-muted-foreground"
                    >
                      {product.category.name}
                    </Badge>
                  </div>
                )}

                <Separator className="my-4 bg-muted" />

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-cyan-400">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-sm text-neutral-500 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mt-2 flex items-center gap-1.5">
                  <Circle className={`size-2 fill-current ${stockConfig.dotColor} ${stockConfig.textColor}`} />
                  <span className={`text-xs font-medium ${stockConfig.textColor}`}>
                    {stockConfig.label}
                  </span>
                  {stockStatus === 'in-stock' && (
                    <BadgeCheck className="ml-1 size-3.5 text-cyan-400" />
                  )}
                </div>

                <Separator className="my-4 bg-muted" />

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={stockStatus === 'out-of-stock'}
                    className={`w-full ${
                      stockStatus === 'out-of-stock'
                        ? 'bg-neutral-700 text-muted-foreground cursor-not-allowed'
                        : 'bg-cyan-500 text-black hover:bg-cyan-400 cyan-glow-hover'
                    }`}
                  >
                    <ShoppingCart className="mr-2 size-4" />
                    {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button
                    onClick={handleViewFullDetails}
                    variant="outline"
                    className="w-full border-border text-muted-foreground hover:bg-muted hover:text-white hover:border-border"
                  >
                    <Eye className="mr-2 size-4" />
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
