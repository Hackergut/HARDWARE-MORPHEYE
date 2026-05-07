'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Award } from 'lucide-react'
import Image from 'next/image'
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
    <section className="relative overflow-hidden bg-[#0a0a0a] grid-pattern">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/70 to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-emerald-500/5" />
      
      {/* Radial glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-500/8 rounded-full blur-[100px]" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-xs font-medium text-cyan-400 backdrop-blur-sm">
            <Shield className="size-3.5" />
            Trusted by 50,000+ crypto holders
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="mb-6 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
        >
          Secure Your Crypto with{' '}
          <span className="text-gradient-cyan">Certified Hardware Wallets</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mb-10 max-w-2xl text-base text-neutral-400 sm:text-lg"
        >
          Authorized reseller of Ledger, Trezor &amp; Keystone. Free shipping on
          orders over $150. Every device certified authentic.
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
            className="bg-cyan-500 px-8 text-base font-semibold text-black hover:bg-cyan-400 pulse-glow"
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

        {/* Hero product images floating */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="mt-12 flex items-center justify-center gap-4 opacity-30"
        >
          <Image
            src="/images/ledger-nano-x.jpg"
            alt="Ledger Nano X"
            width={120}
            height={120}
            className="rounded-xl"
          />
          <Image
            src="/images/trezor-model-t.jpg"
            alt="Trezor Model T"
            width={120}
            height={120}
            className="rounded-xl"
          />
          <Image
            src="/images/ledger-stax.jpg"
            alt="Ledger Stax"
            width={120}
            height={120}
            className="rounded-xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
