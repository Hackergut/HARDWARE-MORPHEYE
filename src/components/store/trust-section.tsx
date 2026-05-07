'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Truck, Headset, RefreshCw } from 'lucide-react'

const pillars = [
  {
    icon: Shield,
    title: 'Authorized Reseller',
    description: 'Official partner of Ledger, Trezor & Keystone',
    stat: '50,000+',
    statLabel: 'Customers Protected',
  },
  {
    icon: Truck,
    title: 'Secure Shipping',
    description: 'Insured delivery with tamper-evident packaging',
    stat: '2+',
    statLabel: 'Years Warranty',
  },
  {
    icon: Headset,
    title: 'Expert Support',
    description: '24/7 crypto security specialists',
    stat: '$0',
    statLabel: 'Lost to Hacks',
  },
  {
    icon: RefreshCw,
    title: 'Money-Back Guarantee',
    description: '30-day hassle-free returns',
    stat: '24/7',
    statLabel: 'Support Available',
  },
]

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`counter-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <span className="text-2xl font-extrabold text-gradient-cyan">
        {value}{suffix}
      </span>
    </div>
  )
}

export function TrustSection() {
  return (
    <section className="border-y border-neutral-800 bg-neutral-900/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Why Choose Morpheye?
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Your security is our top priority
          </p>
        </div>

        {/* Separator line */}
        <div className="mx-auto mb-10 h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="gradient-border-top group flex flex-col items-center rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-center transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div className="icon-pulse-hover mb-4 flex size-12 items-center justify-center rounded-lg bg-cyan-500/10 transition-all duration-300 group-hover:bg-cyan-500/15">
                <pillar.icon className="size-6 text-cyan-400" />
              </div>

              {/* Animated stat */}
              <div className="mb-1">
                <AnimatedCounter value={pillar.stat} />
              </div>
              <p className="mb-3 text-[10px] font-medium tracking-wider text-cyan-400/60 uppercase">
                {pillar.statLabel}
              </p>

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
