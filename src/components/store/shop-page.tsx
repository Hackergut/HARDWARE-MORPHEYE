'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { ProductGrid } from './product-grid'

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      return data.categories || []
    }
  } catch {
    // ignore
  }
  return []
}

export function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const { selectedCategory, navigate } = useNavigationStore()

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  const activeCategory = selectedCategory || 'all'

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative Header Banner */}
      <div className="shop-banner">
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="size-5 text-cyan-500" />
            <nav className="flex items-center gap-1.5 text-sm">
              <button
                onClick={() => navigate('home')}
                className="dark:text-neutral-500 text-muted-foreground transition-colors hover:text-cyan-400"
              >
                Home
              </button>
              <ChevronRight className="size-3.5 dark:text-neutral-600 text-muted-foreground" />
              <span className="text-foreground font-medium">Shop</span>
            </nav>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Browse Hardware Wallets
          </h1>
          <p className="mt-1 text-sm dark:text-neutral-400 text-muted-foreground">
            Explore our curated collection of certified crypto security devices
          </p>
          {/* Ambient glow */}
          <div className="absolute top-0 right-[20%] w-[300px] h-[200px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => navigate('shop', {})}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('shop', { category: cat.slug })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.slug
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.name}
              <span className="ml-1 text-xs opacity-60">
                ({cat.productCount})
              </span>
            </button>
          ))}
        </div>

        {/* Gradient divider between filter and content */}
        <div className="gradient-divider mb-6" />

        <ProductGrid
          title={
            activeCategory === 'all'
              ? 'All Products'
              : categories.find((c) => c.slug === activeCategory)?.name ||
                'Products'
          }
          category={activeCategory !== 'all' ? activeCategory : undefined}
        />
      </div>
    </div>
  )
}
