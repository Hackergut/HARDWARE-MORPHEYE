'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  brand?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  shortDesc?: string | null
  tags: string[]
  featured?: boolean
  active?: boolean
  stock: number
}

export function ProductShowcaseSection() {
  const { navigate } = useNavigationStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?featured=true&limit=6')
      .then((r) => r.json())
      .then((data) => {
        const list = (data.products || []).map((p: any) => ({
          ...p,
          images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
        }))
        setProducts(list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 sm:py-32 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] aspect-[4/5] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="featured-section" className="relative py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-semibold tracking-wider text-[#14b866] uppercase mb-4">
            Curated Collection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Every wallet.{' '}
            <span className="bg-gradient-to-r from-[#0f7157] to-[#14b866] bg-clip-text text-transparent">
              Verified secure.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto">
            Hand-picked hardware wallets from the world&apos;s most trusted manufacturers.
            All certified authentic with full manufacturer warranty.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const img = product.images?.[0] || '/images/products/product-img-1.png'
            const discount = product.comparePrice
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : null
            const tags = product.tags?.slice(0, 4) || []

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#0f7157]/30 hover:bg-white/[0.04] cursor-pointer"
                onClick={() => navigate('product', { productId: product.id })}
              >
                {/* Discount Badge */}
                {discount && discount > 0 && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 text-[10px] font-bold shadow-lg">
                      -{discount}% OFF
                    </span>
                  </div>
                )}

                {/* Stock Badge */}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 text-[10px] font-bold shadow-lg">
                      Low Stock
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-square p-6 sm:p-8">
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-0">
                  <p className="text-[10px] font-semibold text-[#14b866] uppercase tracking-wider mb-1">
                    {product.brand || 'Hardware Wallet'}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-sm text-white/40 mb-4 line-clamp-2">{product.shortDesc || ''}</p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map((t: string) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[10px] text-white/50 capitalize"
                        >
                          {t.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="ml-2 text-sm text-white/30 line-through">
                          ${product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('product', { productId: product.id })
                      }}
                      className="bg-[#0f7157] hover:bg-[#14b866] text-white rounded-full px-4"
                    >
                      <ShoppingBag className="mr-1.5 size-3.5" />
                      Shop
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => navigate('shop')}
            variant="outline"
            size="lg"
            className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20 px-8"
          >
            View All Wallets
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
