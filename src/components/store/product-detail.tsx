'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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
  Heart,
  Share2,
  CheckCircle2,
  BadgeCheck,
  Home,
  ChevronDown,
  Lock,
  X,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useNotificationStore } from '@/store/notification-store'
import { useRecentlyViewedStore } from '@/store/recently-viewed-store'
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
import { ProductReviews } from './product-reviews'

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

function extractFeatures(product: Product): string[] {
  const features: string[] = []

  if (product.tags && Array.isArray(product.tags)) {
    product.tags.forEach((tag) => {
      if (tag && tag.length > 1) {
        features.push(tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' '))
      }
    })
  }

  if (product.shortDesc) {
    const sentences = product.shortDesc.split(/[.!]/).filter((s) => s.trim().length > 10)
    sentences.slice(0, 3).forEach((s) => {
      features.push(s.trim())
    })
  }

  if (features.length < 3 && product.specs && typeof product.specs === 'object') {
    const specEntries = Object.entries(product.specs)
    specEntries.slice(0, 3).forEach(([key, value]) => {
      features.push(`${key}: ${value}`)
    })
  }

  return [...new Set(features)].slice(0, 6)
}

function getEstimatedDelivery(): { startDate: Date; endDate: Date; startStr: string; endStr: string } {
  const now = new Date()
  const addBusinessDays = (start: Date, days: number): Date => {
    const date = new Date(start)
    let addedDays = 0
    while (addedDays < days) {
      date.setDate(date.getDate() + 1)
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++
      }
    }
    return date
  }

  const startDate = addBusinessDays(now, 5)
  const endDate = addBusinessDays(now, 7)

  const formatShort = (d: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
  }

  return {
    startDate,
    endDate,
    startStr: formatShort(startDate),
    endStr: formatShort(endDate),
  }
}

function LightboxOverlay({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  productName,
}: {
  images: string[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  productName: string
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-neutral-800/80 text-white transition-colors hover:bg-neutral-700"
        aria-label="Close lightbox"
      >
        <X className="size-5" />
      </button>

      {/* Image counter */}
      <div className="absolute bottom-6 left-6 z-10 rounded-lg bg-black/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
        {activeIndex + 1}/{images.length}
      </div>

      {/* Previous arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-neutral-800/80 text-white transition-colors hover:bg-neutral-700"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-neutral-800/80 text-white transition-colors hover:bg-neutral-700"
          aria-label="Next image"
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={activeIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {images[activeIndex] && (
          <Image
            src={images[activeIndex]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            width={1200}
            height={1200}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            sizes="90vw"
          />
        )}
      </motion.div>
    </motion.div>,
    document.body
  )
}

export function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [alsoBought, setAlsoBought] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
  const [heartAnimating, setHeartAnimating] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const { selectedProductId, navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const showNotification = useNotificationStore((s) => s.show)
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct)

  useEffect(() => {
    setMounted(true)
  }, [])

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
        addRecentlyViewed(data.product?.id || data.id)

        const catSlug = data.product?.category?.slug || data.category?.slug
        // Fetch related products (same category)
        if (catSlug) {
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

        // Fetch "Customers also bought" — featured products excluding current
        const featRes = await fetch('/api/products?featured=true&limit=4')
        if (featRes.ok) {
          const featData = await featRes.json()
          setAlsoBought(
            (featData.products || []).filter(
              (p: Product) => p.id !== (data.product?.id || data.id)
            ).slice(0, 4)
          )
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const lightboxPrev = useCallback(() => {
    if (!product?.images) return
    setLightboxIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }, [product?.images])

  const lightboxNext = useCallback(() => {
    if (!product?.images) return
    setLightboxIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }, [product?.images])

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
            className="bg-cyan-500 text-black hover:bg-cyan-400"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)
  const features = extractFeatures(product)

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

  const estimatedDelivery = getEstimatedDelivery()

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
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
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

  const handleWishlistToggle = () => {
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
      inWishlist ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`,
      inWishlist ? 'info' : 'success'
    )
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      showNotification('Link copied to clipboard!', 'success')
    } catch {
      showNotification('Failed to copy link', 'error')
    }
  }

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageZoom) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-500" aria-label="Breadcrumb">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1 transition-colors hover:text-cyan-400"
        >
          <Home className="size-3.5" />
          Home
        </button>
        <ChevronDown className="-rotate-90 size-3" />
        <button
          onClick={() => navigate('shop')}
          className="transition-colors hover:text-cyan-400"
        >
          Shop
        </button>
        {product.category && (
          <>
            <ChevronDown className="-rotate-90 size-3" />
            <button
              onClick={() => navigate('shop', { category: product.category!.slug })}
              className="transition-colors hover:text-cyan-400"
            >
              {product.category.name}
            </button>
          </>
        )}
        <ChevronDown className="-rotate-90 size-3" />
        <span className="max-w-[200px] truncate text-neutral-300">{product.name}</span>
      </nav>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div
            className="relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
            onMouseEnter={() => setImageZoom(true)}
            onMouseLeave={() => setImageZoom(false)}
            onMouseMove={handleImageMouseMove}
            style={{ cursor: imageZoom ? 'crosshair' : undefined }}
          >
            {product.images?.[activeImage] && !imgErrors[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-200 ${
                  imageZoom ? 'scale-150' : 'scale-100'
                }`}
                style={imageZoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
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

            {/* Zoom indicator */}
            {imageZoom && product.images?.[activeImage] && !imgErrors[activeImage] && (
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] text-neutral-300 backdrop-blur-sm">
                Zoom
              </div>
            )}

            {/* Click to open lightbox */}
            {product.images?.[activeImage] && !imgErrors[activeImage] && (
              <button
                onClick={() => openLightbox(activeImage)}
                className="absolute inset-0 z-10 cursor-zoom-in"
                aria-label="Open full-screen image view"
              />
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
                  className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
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
                      ? 'border-cyan-500'
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
              <button
                onClick={() => navigate('shop', { brand: product.brand! })}
                className="rounded-full border border-neutral-700 px-2.5 py-0.5 text-xs text-neutral-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
              >
                {product.brand}
              </button>
            )}
            {product.featured && (
              <Badge className="bg-cyan-500 text-black">Featured</Badge>
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

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-sm leading-relaxed text-neutral-400">{product.shortDesc}</p>
          )}

          {/* Key Features */}
          {features.length > 0 && (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">Key Features</h3>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-cyan-400">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice &&
              product.comparePrice > product.price && (
                <span className="text-lg text-neutral-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
          </div>

          {/* Stock - More Prominent */}
          <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-3">
            <div
              className={`size-3 rounded-full ${
                stockStatus === 'in_stock'
                  ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                  : stockStatus === 'low_stock'
                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                stockStatus === 'in_stock'
                  ? 'text-cyan-400'
                  : stockStatus === 'low_stock'
                    ? 'text-amber-500'
                    : 'text-red-500'
              }`}
            >
              {stockStatus === 'in_stock'
                ? 'In Stock — Ready to Ship'
                : stockStatus === 'low_stock'
                  ? `Low Stock — Only ${product.stock} left!`
                  : 'Out of Stock'}
            </span>
          </div>

          {/* Estimated Delivery */}
          {stockStatus !== 'out_of_stock' && (
            <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                <Truck className="size-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-white">
                  Estimated delivery:
                </span>{' '}
                <span className="text-sm text-neutral-300">
                  {estimatedDelivery.startStr} - {estimatedDelivery.endStr}
                </span>
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-400">Quantity:</span>
              {/* Premium Quantity Selector */}
              <div className="flex items-center overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex size-10 items-center justify-center text-neutral-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex w-12 items-center justify-center border-x border-neutral-700/50 text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock || 99, quantity + 1))
                  }
                  className="flex size-10 items-center justify-center text-neutral-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
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
                className="flex-1 bg-cyan-500 text-base font-semibold text-black hover:bg-cyan-400 transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="size-5" />
                      Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="size-5" />
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
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

            {/* Wishlist + Share Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className={`flex-1 border-neutral-700 ${
                  inWishlist
                    ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300'
                    : 'text-neutral-400 hover:border-neutral-600 hover:text-white'
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={inWishlist ? 'filled' : 'outline'}
                    initial={{ scale: heartAnimating ? 1.3 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      className={`size-4 ${
                        inWishlist ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    {inWishlist ? 'Saved' : 'Save for Later'}
                  </motion.span>
                </AnimatePresence>
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white"
              >
                <Share2 className="mr-2 size-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Guaranteed Authentic Badge */}
          <div className="flex items-center gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <BadgeCheck className="size-5 shrink-0 text-cyan-400" />
            <div>
              <span className="text-sm font-semibold text-cyan-400">Guaranteed Authentic</span>
              <p className="text-xs text-neutral-500">100% genuine products with full warranty</p>
            </div>
          </div>

          {/* Secure Checkout Badge */}
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <Lock className="size-5 shrink-0 text-emerald-400" />
            <div>
              <span className="text-sm font-semibold text-emerald-400">Secure Checkout</span>
              <p className="text-xs text-neutral-500">256-bit SSL encrypted payment processing</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Shield className="size-4 text-cyan-400" />
              Authorized Reseller
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Truck className="size-4 text-cyan-400" />
              Secure Shipping
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <RotateCcw className="size-4 text-cyan-400" />
              Free Returns
            </div>
          </div>

          <Separator className="bg-neutral-800" />

          {/* Specifications - Always visible, enhanced design */}
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
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <tr
                          key={key}
                          className={`border-b border-neutral-800/50 last:border-0 ${
                            index % 2 === 0 ? 'bg-neutral-900/80' : 'bg-neutral-800/40'
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-neutral-300 w-2/5">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-neutral-400">
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
                <AccordionTrigger className="text-sm font-semibold text-white hover:text-cyan-400">
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

      {/* Customers Also Bought */}
      {alsoBought.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">
              Customers Also Bought
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alsoBought.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Product Reviews */}
      {product && <ProductReviews productId={product.id} />}

      {/* Image Lightbox */}
      {mounted && lightboxOpen && product.images && product.images.length > 0 && (
        <AnimatePresence>
          <LightboxOverlay
            images={product.images}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={lightboxPrev}
            onNext={lightboxNext}
            productName={product.name}
          />
        </AnimatePresence>
      )}
    </motion.div>
  )
}
