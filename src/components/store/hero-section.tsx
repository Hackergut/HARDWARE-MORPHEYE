'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Truck, Award, ChevronDown, Star, BadgeCheck,
  ShoppingBag, ArrowRight, ChevronLeft, ChevronRight,
  Lock, Wifi, Battery, Eye, Zap
} from 'lucide-react'
import Image from 'next/image'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'

/* ─── REAL IMAGES (copied from your Downloads folder) ─── */
const HERO_PRODUCTS = [
  {
    id: 'trezor-safe-7',
    name: 'Trezor Safe 7',
    brand: 'Trezor',
    price: 79.99,
    image: '/images/products/trezor-safe-7/hero.webp',
    badge: 'New',
  },
  {
    id: 'trezor-safe-3',
    name: 'Trezor Safe 3',
    brand: 'Trezor',
    price: 59.99,
    image: '/images/products/trezor-safe-3/hero.webp',
    badge: 'Bestseller',
  },
  {
    id: 'sy2-pro',
    name: 'SY2 Pro',
    brand: 'SY2',
    price: 89.99,
    image: '/images/products/sy2-pro/hero-1.webp',
    badge: null,
  },
  {
    id: 'onekey-pro',
    name: 'OneKey Pro',
    brand: 'OneKey',
    price: 129.99,
    image: '/images/products/other/onekey-pro.webp',
    badge: 'Premium',
  },
  {
    id: 'secux-nifty',
    name: 'SecuX Nifty',
    brand: 'SecuX',
    price: 149.99,
    image: '/images/products/other/secux-nifty.webp',
    badge: null,
  },
  {
    id: 's1pro5',
    name: 'S1 Pro V5',
    brand: 'S1',
    price: 69.99,
    image: '/images/products/other/s1pro5.webp',
    badge: 'Sale',
  },
]

const floatingBadges = [
  { icon: Shield, label: 'Authorized Reseller', delay: 0 },
  { icon: Truck, label: 'Free Shipping $150+', delay: 0.2 },
  { icon: Award, label: '2-Year Warranty', delay: 0.4 },
]

export function HeroSection() {
  const { navigate } = useNavigationStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % HERO_PRODUCTS.length)
  }, [])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  const current = HERO_PRODUCTS[currentIndex]

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[#0a0a0a]">
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(15,113,87,0.25) 0%, rgba(10,10,10,0) 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(15,113,87,0.12) 0%, transparent 80%)',
          }}
        />
        {/* top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0f7157]/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* ── Trust badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0f7157]/30 bg-[#0f7157]/10 px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-[#14b866] uppercase backdrop-blur-sm">
            <Shield className="size-3.5" />
            Trusted by 50,000+ crypto holders — Authorized Reseller
          </span>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="mb-5"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white/40">
                <span className="inline-block size-2 rounded-full bg-[#14b866] animate-pulse" />
                Now in stock — Ships within 24h
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white"
            >
              Your crypto.
              <br />
              <span className="bg-gradient-to-r from-[#0f7157] via-[#14b866] to-[#34d399] bg-clip-text text-transparent">
                Fully protected.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mb-8 text-base sm:text-lg text-white/50 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Authorized reseller of Trezor, Ledger, OneKey, SecuX, Keystone & more.
              Every device is certified authentic with full manufacturer warranty.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <Button
                onClick={() => navigate('shop')}
                size="lg"
                className="group bg-gradient-to-r from-[#0f7157] to-[#14b866] text-white hover:brightness-110 px-8 py-6 text-base font-bold rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0f7157]/20"
              >
                <ShoppingBag className="mr-2 size-5" />
                Shop All Wallets
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('featured-section')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="px-8 py-6 text-base font-semibold rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Explore Products
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8"
            >
              {[
                { value: '50K+', label: 'Customers' },
                { value: '4.9★', label: 'Trustpilot' },
                { value: '100%', label: 'Authentic' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <Star className="size-4 text-[#0f7157]" />
                  <div>
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                    <span className="ml-1.5 text-xs text-white/40">{stat.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product carousel with YOUR real images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative flex items-center justify-center order-1 lg:order-2"
          >
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#0f7157]/15 blur-[90px]" />
            </div>

            {/* Image wrapper */}
            <div className="relative z-10 w-full max-w-[420px]">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] p-6 sm:p-8">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => navigate('shop')}
                >
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 80vw, 420px"
                    priority
                  />
                </motion.div>

                {/* Product label */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <div className="rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl px-5 py-2.5 shadow-2xl">
                    <p className="text-[10px] font-semibold text-[#14b866] uppercase tracking-wider">{current.brand}</p>
                    <p className="text-sm font-bold text-white">{current.name}</p>
                    <p className="text-xs text-white/50 mt-0.5">${current.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Badge */}
                {current.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0f7157] px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                      <Zap className="size-3" />
                      {current.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Carousel arrows */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={prevSlide}
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <div className="flex gap-1.5">
                  {HERO_PRODUCTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > currentIndex ? 1 : -1)
                        setCurrentIndex(i)
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-6 bg-[#14b866]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Certified badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute top-6 right-4 sm:right-0 lg:right-[-10px]"
            >
              <div className="flex items-center gap-2 rounded-full border border-[#0f7157]/20 bg-[#0f7157]/10 backdrop-blur-md px-4 py-2 shadow-lg">
                <BadgeCheck className="size-4 text-[#14b866]" />
                <span className="text-xs font-semibold text-white">Certified Authentic</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Bottom trust badges ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 sm:mt-24 flex flex-wrap items-center justify-center gap-3 sm:gap-5"
        >
          {floatingBadges.map((badge) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + badge.delay }}
              className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm px-5 py-3 transition-all hover:border-[#0f7157]/30 hover:bg-white/[0.06]"
            >
              <badge.icon className="size-4 text-[#0f7157]" />
              <span className="text-sm font-medium text-white/60">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          onClick={() => {
            const el = document.getElementById('featured-section')
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="flex flex-col items-center gap-1 group"
        >
          <span className="text-[10px] tracking-[0.2em] text-white/30 uppercase group-hover:text-white/50 transition-opacity">Scroll</span>
          <ChevronDown className="size-4 text-[#0f7157] group-hover:text-[#14b866] transition-colors animate-bounce" />
        </button>
      </motion.div>
    </section>
  )
}
