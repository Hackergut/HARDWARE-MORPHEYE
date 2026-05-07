'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Award } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'

const floatingBadges = [
  { icon: Shield, label: 'Authorized Reseller', delay: 0 },
  { icon: Truck, label: 'Free Shipping $150+', delay: 0.2 },
  { icon: Award, label: '2-Year Warranty', delay: 0.4 },
]

export function HeroSection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient + image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/images/hero-banner.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-500">
            🔒 Trusted by 50,000+ crypto holders
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="mb-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Secure Your Crypto with{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
            Certified Hardware Wallets
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mb-10 max-w-2xl text-base text-neutral-400 sm:text-lg"
        >
          Authorized reseller of Ledger, Trezor &amp; Keystone. Free shipping on
          orders over $150.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            onClick={() => navigate('shop')}
            size="lg"
            className="bg-emerald-500 px-8 text-base font-semibold text-black hover:bg-emerald-600"
          >
            Shop Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-neutral-700 px-8 text-base text-white hover:bg-neutral-800 hover:text-white"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Floating trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {floatingBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + badge.delay }}
              className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 backdrop-blur-sm"
            >
              <badge.icon className="size-4 text-emerald-500" />
              <span className="text-sm font-medium text-neutral-300">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
