'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Cable, Box, Disc, ArrowRight } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  productCount: number
}

const categoryConfig: Record<string, { icon: React.ElementType; gradient: string; pattern: string }> = {
  hardware: {
    icon: Shield,
    gradient: 'from-cyan-500/10 via-transparent to-cyan-500/5',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(6,182,212,0.08) 0%, transparent 50%)',
  },
  accessories: {
    icon: Cable,
    gradient: 'from-teal-500/10 via-transparent to-teal-500/5',
    pattern: 'radial-gradient(circle at 20% 80%, rgba(20,184,166,0.08) 0%, transparent 50%)',
  },
  bundles: {
    icon: Box,
    gradient: 'from-amber-500/10 via-transparent to-amber-500/5',
    pattern: 'radial-gradient(circle at 80% 80%, rgba(245,158,11,0.08) 0%, transparent 50%)',
  },
  software: {
    icon: Disc,
    gradient: 'from-purple-500/10 via-transparent to-purple-500/5',
    pattern: 'radial-gradient(circle at 20% 20%, rgba(168,85,247,0.08) 0%, transparent 50%)',
  },
}

const defaultConfig = {
  icon: Shield,
  gradient: 'from-cyan-500/10 via-transparent to-cyan-500/5',
  pattern: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 50%)',
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
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

  return (
    <section className="bg-[#0a0a0a] dark:bg-[#0a0a0a] bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white dark:text-white text-neutral-900"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-sm text-neutral-400 dark:text-neutral-400 text-neutral-600"
          >
            Find the perfect security solution for your needs
          </motion.p>
        </div>

        {/* Decorative gradient line */}
        <div className="mx-auto mb-10 h-px w-48 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900 dark:bg-neutral-900 bg-neutral-100"
                />
              ))
            : categories.map((category, i) => {
                const config = categoryConfig[category.slug] || defaultConfig
                const IconComponent = config.icon
                const isHovered = hoveredId === category.id

                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onMouseEnter={() => setHoveredId(category.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() =>
                      navigate('shop', { category: category.slug })
                    }
                    className="category-shine group relative flex min-h-[200px] flex-col items-start overflow-hidden rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900 dark:bg-neutral-900 bg-white p-6 text-left transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: config.pattern }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    {/* Glow border effect on hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        boxShadow: 'inset 0 0 20px rgba(6,182,212,0.05), 0 0 30px rgba(6,182,212,0.03)',
                      }}
                    />

                    <div className="relative z-10 flex w-full items-start justify-between">
                      {/* Icon */}
                      <div className="icon-pulse-hover mb-4 flex size-12 items-center justify-center rounded-xl border border-neutral-700/50 dark:border-neutral-700/50 border-neutral-300 bg-neutral-800/80 dark:bg-neutral-800/80 bg-neutral-100 transition-all duration-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:shadow-md group-hover:shadow-cyan-500/10">
                        <IconComponent className="size-5 text-neutral-400 transition-colors duration-300 group-hover:text-cyan-400" />
                      </div>

                      {/* Product Count Badge */}
                      <div className="flex items-center gap-1 rounded-full bg-neutral-800/80 dark:bg-neutral-800/80 bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-400 dark:text-neutral-400 text-neutral-600 transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
                        <span>{category.productCount}</span>
                        <span>item{category.productCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="mb-1 text-lg font-semibold text-white dark:text-white text-neutral-900 transition-colors duration-300 group-hover:text-cyan-400">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mb-3 line-clamp-2 text-sm text-neutral-400 dark:text-neutral-400 text-neutral-600">
                          {category.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-500 text-neutral-400 transition-colors duration-300 group-hover:text-cyan-400">
                        <span>Browse category</span>
                        <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    {/* Animated corner accent */}
                    <motion.div
                      className="absolute -bottom-1 -right-1 size-16 rounded-tl-full bg-cyan-500/5 transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:size-20"
                      animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                )
              })}
        </div>

        {/* View All Categories Link */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('shop')}
            className="group flex items-center gap-2 rounded-full border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/50 dark:bg-neutral-900/50 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-400 dark:text-neutral-400 text-neutral-600 transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-400 hover:shadow-md hover:shadow-cyan-500/5"
          >
            View All Categories
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
