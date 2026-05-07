'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Headset, RefreshCw } from 'lucide-react'

const pillars = [
  {
    icon: Shield,
    title: 'Authorized Reseller',
    description: 'Official partner of Ledger, Trezor & Keystone',
  },
  {
    icon: Truck,
    title: 'Secure Shipping',
    description: 'Insured delivery with tamper-evident packaging',
  },
  {
    icon: Headset,
    title: 'Expert Support',
    description: '24/7 crypto security specialists',
  },
  {
    icon: RefreshCw,
    title: 'Money-Back Guarantee',
    description: '30-day hassle-free returns',
  },
]

export function TrustSection() {
  return (
    <section className="border-y border-neutral-800 bg-neutral-900/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white">
            Why Choose Morpheye?
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Your security is our top priority
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-center transition-colors hover:border-emerald-500/30"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <pillar.icon className="size-6 text-emerald-500" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="text-xs text-neutral-400">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
