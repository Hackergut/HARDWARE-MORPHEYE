'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Award, ChevronDown, Users, Star, BadgeCheck, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'

const floatingBadges = [
  { icon: Shield, label: 'Authorized Reseller', delay: 0 },
  { icon: Truck, label: 'Free Shipping $150+', delay: 0.2 },
  { icon: Award, label: '2-Year Warranty', delay: 0.4 },
]

const stats = [
  { icon: Users, value: '50,000+', label: 'Customers' },
  { icon: Star, value: '4.9★', label: 'Rating' },
  { icon: BadgeCheck, value: '100%', label: 'Authentic' },
]

const heroProducts = [
  { src: '/images/ledger-nano-x.jpg', alt: 'Ledger Nano X', floatClass: 'float-animation', rotate: -3, delay: 0 },
  { src: '/images/trezor-model-t.jpg', alt: 'Trezor Model T', floatClass: 'float-animation-alt', rotate: 2, delay: 0.2 },
  { src: '/images/ledger-stax.jpg', alt: 'Ledger Stax', floatClass: 'float-animation-slow', rotate: -2, delay: 0.4 },
]

export function HeroSection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] grid-pattern hero-particles">
      {/* Animated gradient mesh background - 4 overlapping radial gradients that shift */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
            animation: 'mesh-drift-1 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)',
            animation: 'mesh-drift-2 15s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            animation: 'mesh-drift-3 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
            animation: 'mesh-drift-4 14s ease-in-out infinite',
          }}
        />
      </div>

      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/70 to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-emerald-500/5" />

      {/* Decorative circuit/tech pattern SVG - grid with dots at intersections */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="2" fill="#06b6d4" />
              <circle cx="60" cy="0" r="1.5" fill="#06b6d4" />
              <circle cx="0" cy="60" r="1.5" fill="#06b6d4" />
              {/* Connection lines on some intersections */}
              <line x1="0" y1="30" x2="20" y2="30" stroke="#06b6d4" strokeWidth="0.3" opacity="0.5" />
              <line x1="30" y1="0" x2="30" y2="20" stroke="#06b6d4" strokeWidth="0.3" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-grid)" />
        </svg>
      </div>

      {/* Radial glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-500/8 rounded-full blur-[100px]" />

      {/* Additional ambient particles */}
      <div className="absolute top-1/3 left-[70%] w-1.5 h-1.5 rounded-full bg-cyan-400/20 animate-pulse" />
      <div className="absolute top-2/3 left-[10%] w-1 h-1 rounded-full bg-teal-400/15 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-[85%] w-1 h-1 rounded-full bg-cyan-300/10 animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Scanline/CRT effect */}
      <div className="absolute inset-0 pointer-events-none z-10 scanlines" />

      <div className="relative z-20 mx-auto flex min-h-[70vh] sm:min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide text-cyan-400 backdrop-blur-sm uppercase">
            <Shield className="size-3.5" />
            Trusted by 50,000+ Crypto Holders
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="mb-6 max-w-5xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
        >
          Secure Your Crypto{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient-cyan">with Certified Hardware Wallets</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mb-8 sm:mb-10 max-w-2xl text-sm sm:text-base lg:text-lg text-neutral-300/80 leading-relaxed"
        >
          Authorized reseller of Ledger, Trezor &amp; Keystone. Free shipping on
          orders over $150. Every device certified authentic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
        >
          <Button
            onClick={() => navigate('shop')}
            size="lg"
            className="group w-full sm:w-auto bg-cyan-500 px-10 py-6 text-base sm:text-lg font-bold text-black hover:bg-cyan-400 hero-cta-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="mr-2 size-5 transition-transform group-hover:translate-x-0.5" />
            Shop Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const el = document.getElementById('why-choose-morpheye')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="w-full sm:w-auto border-cyan-500/30 px-10 py-6 text-base sm:text-lg font-semibold text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/50 learn-more-glow transition-all duration-300"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Floating trust badges */}
        <div className="mt-8 sm:mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {floatingBadges.map((badge) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + badge.delay }}
              className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-5 py-3 backdrop-blur-sm transition-colors hover:border-cyan-500/30"
            >
              <badge.icon className="size-4 text-cyan-400" />
              <span className="text-sm font-medium text-neutral-300">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: 'easeOut' }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-10"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3">
              {i > 0 && (
                <div className="h-8 w-px bg-neutral-700 -ml-3 sm:-ml-5" />
              )}
              <div className="flex items-center gap-2">
                <stat.icon className="size-4 text-cyan-400/60" />
                <div className="text-left">
                  <span className="text-sm font-bold text-white sm:text-base">{stat.value}</span>
                  <span className="ml-1.5 text-xs text-neutral-500 sm:text-sm">{stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Animated Product Showcase - larger with stronger glow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
          className="mt-8 sm:mt-14 flex items-center justify-center gap-6 sm:gap-12"
        >
          {heroProducts.map((product, i) => (
            <motion.div
              key={product.alt}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.15 }}
              className={`relative ${product.floatClass}`}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              {/* Multi-layer glow halo behind product */}
              <div className="absolute inset-0 -m-6 rounded-3xl bg-cyan-500/15 blur-2xl" />
              <div className="absolute inset-0 -m-4 rounded-2xl bg-cyan-400/10 blur-xl" />
              <div className="absolute inset-0 -m-2 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/8 blur-lg" />
              <div
                className="relative rounded-xl sm:rounded-2xl border border-neutral-700/40 bg-neutral-900/50 p-3 sm:p-4 backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:border-cyan-500/30"
                style={{ transform: `rotate(${product.rotate}deg)` }}
              >
                <Image
                  src={product.src}
                  alt={product.alt}
                  width={160}
                  height={160}
                  className="rounded-lg sm:rounded-xl !h-[140px] !w-[140px] sm:!h-[220px] sm:!w-[220px]"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="scroll-indicator flex flex-col items-center gap-1">
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase">Scroll</span>
            <ChevronDown className="size-4 text-cyan-400/60" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}


