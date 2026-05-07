'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Star,
  ShoppingCart,
  Zap,
  Package,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ProductCard } from './product-card'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  sku?: string | null
  stock: number
  featured?: boolean
  specs: Record<string, string>
  tags: string[]
  rating: number
  reviewCount: number
  category?: { name: string; slug: string }
}

export function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const { selectedProductId, navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)

  useEffect(() => {
    if (selectedProductId) {
      fetchProduct(selectedProductId)
    }
  }, [selectedProductId])

  const fetchProduct = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data.product || data)
        setActiveImage(0)
        setQuantity(1)
        // Fetch related products
        if (data.product?.category?.slug || data.category?.slug) {
          const catSlug = data.product?.category?.slug || data.category?.slug
          const relRes = await fetch(
            `/api/products?category=${catSlug}&limit=4`
          )
          if (relRes.ok) {
            const relData = await relRes.json()
            setRelated(
              (relData.products || []).filter(
                (p: Product) => p.id !== (data.product?.id || data.id)
              )
            )
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-neutral-800" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-800" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-800" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-neutral-800" />
            <div className="h-20 w-full animate-pulse rounded bg-neutral-800" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-white">
            Product not found
          </h2>
          <Button
            onClick={() => navigate('shop')}
            className="bg-emerald-500 text-black hover:bg-emerald-600"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    )
  }

  const stockStatus =
    product.stock <= 0
      ? 'out_of_stock'
      : product.stock <= 5
        ? 'low_stock'
        : 'in_stock'

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        slug: product.slug,
      })
    }
    showNotification(`${quantity}x ${product.name} added to cart`, 'success')
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        slug: product.slug,
      })
    }
    navigate('checkout')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('shop')}
        className="mb-6 flex items-center gap-1 text-sm text-neutral-400 hover:text-emerald-500"
      >
        <ChevronLeft className="size-4" />
        Back to Shop
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            {product.images?.[activeImage] && !imgErrors[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={() =>
                  setImgErrors((prev) => ({ ...prev, [activeImage]: true }))
                }
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="size-20 text-neutral-700" />
              </div>
            )}

            {/* Navigation arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === activeImage
                      ? 'border-emerald-500'
                      : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  {!imgErrors[i] ? (
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [i]: true }))
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-neutral-800">
                      <Package className="size-4 text-neutral-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Featured */}
          <div className="flex items-center gap-2">
            {product.brand && (
              <Badge
                variant="outline"
                className="border-neutral-700 text-neutral-400"
              >
                {product.brand}
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-emerald-500 text-black">Featured</Badge>
            )}
            {discount && (
              <Badge className="bg-amber-500 text-black">
                Save {discount}%
              </Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-400">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-500">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice &&
              product.comparePrice > product.price && (
                <span className="text-lg text-neutral-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
          </div>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-sm text-neutral-400">{product.shortDesc}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div
              className={`size-2 rounded-full ${
                stockStatus === 'in_stock'
                  ? 'bg-emerald-500'
                  : stockStatus === 'low_stock'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                stockStatus === 'in_stock'
                  ? 'text-emerald-500'
                  : stockStatus === 'low_stock'
                    ? 'text-amber-500'
                    : 'text-red-500'
              }`}
            >
              {stockStatus === 'in_stock'
                ? 'In Stock'
                : stockStatus === 'low_stock'
                  ? `Low Stock (${product.stock} left)`
                  : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity + Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-400">Quantity:</span>
              <div className="flex items-center gap-0 rounded-lg border border-neutral-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex size-9 items-center justify-center text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex w-10 items-center justify-center text-sm font-medium text-white">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="flex size-9 items-center justify-center text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAddToCart}
                disabled={stockStatus === 'out_of_stock'}
                size="lg"
                className="flex-1 bg-emerald-500 text-base font-semibold text-black hover:bg-emerald-600"
              >
                <ShoppingCart className="mr-2 size-5" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={stockStatus === 'out_of_stock'}
                size="lg"
                className="flex-1 bg-amber-500 text-base font-semibold text-black hover:bg-amber-600"
              >
                <Zap className="mr-2 size-5" />
                Buy Now
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Shield className="size-4 text-emerald-500" />
              Authorized Reseller
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Truck className="size-4 text-emerald-500" />
              Secure Shipping
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <RotateCcw className="size-4 text-emerald-500" />
              Free Returns
            </div>
          </div>

          <Separator className="bg-neutral-800" />

          {/* Specifications */}
          {product.specs &&
            typeof product.specs === 'object' &&
            Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">
                  Specifications
                </h3>
                <div className="overflow-hidden rounded-lg border border-neutral-800">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value]) => (
                        <tr
                          key={key}
                          className="border-b border-neutral-800 last:border-0"
                        >
                          <td className="bg-neutral-900/50 px-4 py-2.5 font-medium text-neutral-300">
                            {key}
                          </td>
                          <td className="px-4 py-2.5 text-neutral-400">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Description Accordion */}
          {product.description && (
            <Accordion type="single" collapsible>
              <AccordionItem value="description" className="border-neutral-800">
                <AccordionTrigger className="text-sm font-semibold text-white hover:text-emerald-500">
                  Full Description
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-invert prose-sm max-w-none text-neutral-400">
                    {product.description}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-white">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
