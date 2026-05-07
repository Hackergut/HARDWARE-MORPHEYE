'use client'

import { useState, useEffect, useRef } from 'react'
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

const categoryConfig: Record<string, { icon: React.ElementType; gradient: string; pattern: string; videoSrc: string }> = {
  'hardware-wallets': {
    icon: Shield,
    gradient: 'from-cyan-500/10 via-transparent to-cyan-500/5',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(6,182,212,0.08) 0%, transparent 50%)',
    videoSrc: '/videos/categories-bg.mp4',
  },
  accessories: {
    icon: Cable,
    gradient: 'from-teal-500/10 via-transparent to-teal-500/5',
    pattern: 'radial-gradient(circle at 20% 80%, rgba(20,184,166,0.08) 0%, transparent 50%)',
    videoSrc: '/videos/product-showcase-1.mp4',
  },
  bundles: {
    icon: Box,
    gradient: 'from-amber-500/10 via-transparent to-amber-500/5',
    pattern: 'radial-gradient(circle at 80% 80%, rgba(245,158,11,0.08) 0%, transparent 50%)',
    videoSrc: '/videos/product-showcase-2.mp4',
  },
  'recovery-backup': {
    icon: Disc,
    gradient: 'from-purple-500/10 via-transparent to-purple-500/5',
    pattern: 'radial-gradient(circle at 20% 20%, rgba(168,85,247,0.08) 0%, transparent 50%)',
    videoSrc: '/videos/product-showcase-3.mp4',
  },
}

const defaultConfig = {
  icon: Shield,
  gradient: 'from-cyan-500/10 via-transparent to-cyan-500/5',
  pattern: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 50%)',
  videoSrc: '/videos/categories-bg.mp4',
}

function CategoryVideoCard({ category, index }: { category: Category; index: number }) {
  const config = categoryConfig[category.slug] || defaultConfig
  const IconComponent = config.icon
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { navigate } = useNavigationStore()

  useEffect(() => {
    if (videoRef.current) {
      if (hovered) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [hovered])

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('shop', { category: category.slug })}
      className="group relative flex min-h-[240px] sm:min-h-[280px] flex-col items-start overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-500 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          className={`absolute inset-0 size-full object-cover transition-all duration-700 ${hovered ? 'opacity-40 scale-110' : 'opacity-0 scale-100'}`}
        >
          <source src={config.videoSrc} type="video/mp4" />
        </video>
        <div className={`absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/40 transition-opacity duration-500 ${hovered ? 'opacity-90' : 'opacity-100'}`} />
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: config.pattern }}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* Animated glow border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: 'inset 0 0 20px rgba(6,182,212,0.05), 0 0 30px rgba(6,182,212,0.03)',
        }}
      />

      <div className="relative z-10 flex w-full items-start justify-between p-6">
        <div className="icon-pulse-hover mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/80 transition-all duration-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:shadow-md group-hover:shadow-cyan-500/10">
          <IconComponent className="size-6 text-muted-foreground transition-colors duration-300 group-hover:text-cyan-400" />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted/80 px-3 py-1 text-[10px] font-medium text-muted-foreground transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
          <span>{category.productCount}</span>
          <span>item{category.productCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-6">
        <h3 className="mb-1 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-cyan-400">
          {category.name}
        </h3>
        {category.description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 group-hover:text-cyan-400">
          <span>Browse category</span>
          <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Corner accent */}
      <motion.div
        className="absolute -bottom-1 -right-1 size-20 rounded-tl-full bg-cyan-500/5 transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:size-24"
      />
    </motion.button>
  )
}

export function CategoryShowcaseBanner() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (!loading && categories.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Shop by <span className="text-gradient-cyan">Category</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Find the perfect security solution for your needs
          </p>
          <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
              ))
            : categories.map((category, i) => (
                <CategoryVideoCard key={category.id} category={category} index={i} />
              ))}
        </div>
      </div>
    </section>
  )
}