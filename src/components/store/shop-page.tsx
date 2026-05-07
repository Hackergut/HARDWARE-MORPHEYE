'use client'

import { useState, useEffect } from 'react'
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => navigate('shop', {})}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-emerald-500 text-black'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate('shop', { category: cat.slug })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-emerald-500 text-black'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            {cat.name}
            <span className="ml-1 text-xs opacity-60">
              ({cat.productCount})
            </span>
          </button>
        ))}
      </div>

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
  )
}
