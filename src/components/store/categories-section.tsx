'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigationStore } from '@/store/navigation-store'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  productCount: number
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { navigate } = useNavigationStore()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (!loading && categories.length === 0) return null

  const categoryIcons: Record<string, string> = {
    hardware: '🔐',
    accessories: '🔌',
    bundles: '📦',
    software: '💾',
  }

  return (
    <section className="bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white">Shop by Category</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Find the perfect security solution
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900"
                />
              ))
            : categories.map((category, i) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() =>
                    navigate('shop', { category: category.slug })
                  }
                  className="group flex flex-col items-start rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-left transition-all hover:border-emerald-500/50 hover:bg-neutral-900/80 hover:shadow-lg hover:shadow-emerald-500/5"
                >
                  <span className="mb-3 text-3xl">
                    {categoryIcons[category.slug] || '🏷️'}
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-white group-hover:text-emerald-500">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mb-2 text-sm text-neutral-400">
                      {category.description}
                    </p>
                  )}
                  <span className="text-xs text-neutral-500">
                    {category.productCount} product
                    {category.productCount !== 1 ? 's' : ''}
                  </span>
                </motion.button>
              ))}
        </div>
      </div>
    </section>
  )
}
