'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeftRight,
  ShoppingCart,
  Star,
  Package,
  X,
  Trash2,
} from 'lucide-react'
import { useComparisonStore } from '@/store/comparison-store'
import { useCartStore } from '@/store/cart-store'
import { useNavigationStore } from '@/store/navigation-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

export function ComparisonPage() {
  const { items, removeItem, clearAll } = useComparisonStore()
  const addCartItem = useCartStore((s) => s.addItem)
  const navigate = useNavigationStore((s) => s.navigate)
  const showNotification = useNotificationStore((s) => s.show)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          items.map(async (id) => {
            const res = await fetch(`/api/products/${id}`)
            if (res.ok) {
              const data = await res.json()
              return data.product || data
            }
            return null
          })
        )
        setProducts(results.filter((p): p is Product => p !== null))
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [items])

  const handleAddToCart = (product: Product) => {
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.slug,
    })
    showNotification(`${product.name} added to cart`, 'success')
  }

  const handleRemove = (id: string) => {
    removeItem(id)
    showNotification('Product removed from comparison', 'info')
  }

  // Collect all unique spec keys across all products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => (p.specs && typeof p.specs === 'object' ? Object.keys(p.specs) : [])))
  )

  // Empty state
  if (!loading && items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="flex size-20 items-center justify-center rounded-2xl bg-neutral-800/50">
          <ArrowLeftRight className="size-10 text-neutral-600" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-white">No Products to Compare</h2>
        <p className="mt-2 max-w-sm text-center text-sm text-neutral-400">
          Add up to 3 products to compare their features, prices, and specifications side by side.
        </p>
        <Button
          onClick={() => navigate('shop')}
          className="mt-6 bg-cyan-500 text-black hover:bg-cyan-400"
        >
          Browse Products
        </Button>
      </motion.div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-64 animate-pulse rounded bg-neutral-800" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: items.length }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-xl border border-neutral-800 bg-[#111111] p-4">
              <div className="aspect-square animate-pulse rounded-lg bg-neutral-800" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-800" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <ArrowLeftRight className="size-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Compare Products</h1>
            <p className="text-sm text-neutral-500">
              Comparing {products.length} of 3 products
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="border-neutral-700 text-neutral-400 hover:border-red-500/30 hover:text-red-400"
            >
              <Trash2 className="mr-2 size-4" />
              Clear All
            </Button>
          )}
          {items.length < 3 && (
            <Button
              size="sm"
              onClick={() => navigate('shop')}
              className="bg-cyan-500 text-black hover:bg-cyan-400"
            >
              Add More Products
            </Button>
          )}
        </div>
      </div>

      {/* Desktop: Side-by-side comparison table */}
      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[600px]">
          {/* Product headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
            <div /> {/* Empty corner cell */}
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="relative flex flex-col items-center rounded-xl border border-neutral-800 bg-[#111111] p-4"
              >
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition hover:bg-red-500/20 hover:text-red-400"
                >
                  <X className="size-3" />
                </button>
                <div className="relative mb-3 size-24 overflow-hidden rounded-lg bg-neutral-800">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="size-8 text-neutral-600" />
                    </div>
                  )}
                </div>
                <h3
                  className="mb-1 line-clamp-2 text-center text-sm font-semibold text-white cursor-pointer hover:text-cyan-400 transition"
                  onClick={() => navigate('product', { productId: product.id })}
                >
                  {product.name}
                </h3>
                {product.brand && (
                  <Badge variant="outline" className="mt-1 border-neutral-700 text-[10px] text-neutral-400">
                    {product.brand}
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>

          {/* Comparison rows */}
          <div className="mt-4 space-y-0 overflow-hidden rounded-xl border border-neutral-800">
            {/* Price Row */}
            <div className="grid border-b border-neutral-800" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
              <div className="flex items-center bg-neutral-900/80 px-4 py-3 text-sm font-medium text-neutral-300">
                Price
              </div>
              {products.map((product) => (
                <div key={product.id} className="flex flex-col items-center justify-center border-l border-neutral-800 px-4 py-3">
                  <span className="text-lg font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-xs text-neutral-500 line-through">${product.comparePrice.toFixed(2)}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Brand Row */}
            <div className="grid border-b border-neutral-800" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
              <div className="flex items-center bg-neutral-900/80 px-4 py-3 text-sm font-medium text-neutral-300">
                Brand
              </div>
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-center border-l border-neutral-800 px-4 py-3 text-sm text-neutral-400">
                  {product.brand || '—'}
                </div>
              ))}
            </div>

            {/* Stock Row */}
            <div className="grid border-b border-neutral-800" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
              <div className="flex items-center bg-neutral-900/80 px-4 py-3 text-sm font-medium text-neutral-300">
                Availability
              </div>
              {products.map((product) => {
                const stockStatus =
                  product.stock <= 0
                    ? 'out_of_stock'
                    : product.stock <= 5
                      ? 'low_stock'
                      : 'in_stock'
                return (
                  <div key={product.id} className="flex items-center justify-center gap-2 border-l border-neutral-800 px-4 py-3">
                    <div
                      className={`size-2 rounded-full ${
                        stockStatus === 'in_stock'
                          ? 'bg-cyan-500'
                          : stockStatus === 'low_stock'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        stockStatus === 'in_stock'
                          ? 'text-cyan-400'
                          : stockStatus === 'low_stock'
                            ? 'text-amber-500'
                            : 'text-red-500'
                      }`}
                    >
                      {stockStatus === 'in_stock'
                        ? 'In Stock'
                        : stockStatus === 'low_stock'
                          ? `Low (${product.stock})`
                          : 'Out of Stock'}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Rating Row */}
            <div className="grid border-b border-neutral-800" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
              <div className="flex items-center bg-neutral-900/80 px-4 py-3 text-sm font-medium text-neutral-300">
                Rating
              </div>
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-center gap-1 border-l border-neutral-800 px-4 py-3">
                  {product.rating > 0 ? (
                    <>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3 ${
                              i < Math.floor(product.rating)
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400">
                        {product.rating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-neutral-500">—</span>
                  )}
                </div>
              ))}
            </div>

            {/* Spec Rows */}
            {allSpecKeys.map((key, idx) => (
              <div
                key={key}
                className={`grid ${idx === allSpecKeys.length - 1 ? '' : 'border-b border-neutral-800'}`}
                style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}
              >
                <div className="flex items-center bg-neutral-900/80 px-4 py-3 text-sm font-medium text-neutral-300">
                  {key}
                </div>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-center border-l border-neutral-800 px-4 py-3 text-sm text-neutral-400"
                  >
                    {product.specs?.[key] || '—'}
                  </div>
                ))}
              </div>
            ))}

            {/* Add to Cart Row */}
            <div className="grid" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
              <div className="flex items-center bg-neutral-900/80 px-4 py-3 text-sm font-medium text-neutral-300">
                Actions
              </div>
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-center border-l border-neutral-800 px-4 py-3">
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    <ShoppingCart className="mr-2 size-4" />
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Vertical list */}
      <div className="space-y-4 md:hidden">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => {
            const stockStatus =
              product.stock <= 0
                ? 'out_of_stock'
                : product.stock <= 5
                  ? 'low_stock'
                  : 'in_stock'

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]"
              >
                {/* Product header */}
                <div className="flex items-start gap-3 border-b border-neutral-800 p-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="size-6 text-neutral-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-semibold text-white cursor-pointer hover:text-cyan-400 transition"
                      onClick={() => navigate('product', { productId: product.id })}
                    >
                      {product.name}
                    </h3>
                    {product.brand && (
                      <span className="text-xs text-neutral-400">{product.brand}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="flex size-7 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition hover:bg-red-500/20 hover:text-red-400"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Product details */}
                <div className="divide-y divide-neutral-800/50">
                  {/* Price */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-400">Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs text-neutral-500 line-through">${product.comparePrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-400">Availability</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${
                          stockStatus === 'in_stock'
                            ? 'bg-cyan-500'
                            : stockStatus === 'low_stock'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          stockStatus === 'in_stock'
                            ? 'text-cyan-400'
                            : stockStatus === 'low_stock'
                              ? 'text-amber-500'
                              : 'text-red-500'
                        }`}
                      >
                        {stockStatus === 'in_stock'
                          ? 'In Stock'
                          : stockStatus === 'low_stock'
                            ? `Low (${product.stock})`
                            : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-400">Rating</span>
                    <div className="flex items-center gap-1">
                      {product.rating > 0 ? (
                        <>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`size-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-neutral-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-neutral-400">
                            {product.rating.toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-neutral-500">—</span>
                      )}
                    </div>
                  </div>

                  {/* Specs */}
                  {product.specs &&
                    typeof product.specs === 'object' &&
                    Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-neutral-400">{key}</span>
                        <span className="text-sm text-neutral-300">{value}</span>
                      </div>
                    ))}

                  {/* Add to Cart */}
                  <div className="px-4 py-3">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
                    >
                      <ShoppingCart className="mr-2 size-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
