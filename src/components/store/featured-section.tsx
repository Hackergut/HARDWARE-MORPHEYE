'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'

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
}

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { navigate } = useNavigationStore()

  useEffect(() => {
    fetchFeatured()
  }, [])

  const fetchFeatured = async () => {
    try {
      const res = await fetch('/api/products?featured=true&limit=6')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Handpicked by our security experts
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('shop')}
            className="text-emerald-500 hover:text-emerald-400"
          >
            Shop All
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[260px] shrink-0 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900"
              >
                <div className="aspect-square bg-neutral-800" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-neutral-800" />
                  <div className="h-5 w-1/3 rounded bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {products.map((product) => (
              <div key={product.id} className="min-w-[260px] shrink-0 sm:min-w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
