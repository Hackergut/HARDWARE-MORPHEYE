'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Package } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'

interface Brand {
  name: string
  productCount: number
  minPrice: number | null
}

const brandMeta: Record<string, { tagline: string; gradient: string; letterGradient: string }> = {
  Ledger: {
    tagline: "The world's most popular hardware wallet",
    gradient: 'from-blue-950/30 via-[#111] to-cyan-950/20',
    letterGradient: 'from-blue-400 to-cyan-400',
  },
  Trezor: {
    tagline: 'Pioneer of crypto hardware security',
    gradient: 'from-emerald-950/30 via-[#111] to-teal-950/20',
    letterGradient: 'from-emerald-400 to-teal-400',
  },
  Keystone: {
    tagline: 'Air-gapped security made simple',
    gradient: 'from-amber-950/30 via-[#111] to-orange-950/20',
    letterGradient: 'from-amber-400 to-orange-400',
  },
  Cryptosteel: {
    tagline: 'Indestructible backup for your seed phrase',
    gradient: 'from-slate-950/30 via-[#111] to-zinc-950/20',
    letterGradient: 'from-slate-300 to-zinc-400',
  },
}

const defaultMeta = {
  tagline: 'Premium crypto security hardware',
  gradient: 'from-cyan-950/30 via-[#111] to-teal-950/20',
  letterGradient: 'from-cyan-400 to-teal-400',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const { navigate } = useNavigationStore()

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands')
      if (res.ok) {
        const data = await res.json()
        setBrands(data.brands || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  // Merge API data with static brand metadata; also ensure our 4 key brands always show
  const keyBrands = ['Ledger', 'Trezor', 'Keystone', 'Cryptosteel']
  const apiBrandMap = new Map(brands.map((b) => [b.name, b]))
  const displayBrands = keyBrands.map((name) => {
    const apiBrand = apiBrandMap.get(name)
    return {
      name,
      productCount: apiBrand?.productCount || 0,
      minPrice: apiBrand?.minPrice ?? null,
    }
  })

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Authorized{' '}
            <span className="text-gradient-cyan">Brands</span>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-neutral-400 sm:text-base">
            We only sell genuine, factory-sealed devices from authorized manufacturers
          </p>
          {/* Gradient separator */}
          <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </motion.div>

        {/* Brand Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {displayBrands.map((brand) => {
              const meta = brandMeta[brand.name] || defaultMeta
              return (
                <motion.div
                  key={brand.name}
                  variants={cardVariants}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    transition: { duration: 0.25 },
                  }}
                  onClick={() =>
                    navigate('shop', { category: undefined, query: undefined, brand: brand.name })
                  }
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-br p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  }}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-60`} />

                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 bg-cyan-500/0 transition-all duration-300 group-hover:bg-cyan-500/5" />

                  <div className="relative">
                    {/* Logo placeholder: first letter in gradient circle */}
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-neutral-700/50 bg-neutral-900/80 shadow-lg transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-cyan-500/10">
                      <span
                        className={`bg-gradient-to-br ${meta.letterGradient} bg-clip-text text-2xl font-black text-transparent`}
                      >
                        {brand.name.charAt(0)}
                      </span>
                    </div>

                    {/* Brand name */}
                    <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-cyan-400">
                      {brand.name}
                    </h3>

                    {/* Tagline */}
                    <p className="mb-4 text-xs leading-relaxed text-neutral-400">
                      {meta.tagline}
                    </p>

                    {/* Product count badge + Shop link */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700/50 bg-neutral-800/60 px-2.5 py-1 text-[10px] font-medium text-neutral-300">
                        <Package className="size-3" />
                        {brand.productCount} product{brand.productCount !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        Shop {brand.name}
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
