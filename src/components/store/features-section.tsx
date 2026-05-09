'use client'

import { motion } from 'framer-motion'
import {
  Shield, Wifi, Battery, Eye, Lock, Fingerprint,
  Smartphone, Zap, Award, Fingerprint as FingerprintIcon
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'EAL6+ Secure Element',
    description: 'Bank-grade security chip certified under Common Criteria EAL6+. Your private keys never leave the secure enclave.',
  },
  {
    icon: Wifi,
    title: 'Bluetooth & USB-C',
    description: 'Connect wirelessly to your smartphone or wired to your computer. Full flexibility for every setup.',
  },
  {
    icon: Eye,
    title: '1.54" Color Touchscreen',
    description: 'Verify every transaction on a bright, scratch-resistant color display. No more blind signing.',
  },
  {
    icon: Lock,
    title: 'Open Source Firmware',
    description: 'Fully auditable open-source firmware. Transparency you can verify. Community reviewed since 2013.',
  },
  {
    icon: Battery,
    title: 'LiFePO₄ Battery',
    description: 'Premium lithium iron phosphate battery built to last. Safer chemistry, longer lifespan, wireless charging.',
  },
  {
    icon: Smartphone,
    title: 'iOS & Android Ready',
    description: 'Native Bluetooth pairing with iPhone and Android. Manage your crypto on the go with the official app.',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#0a0a0a] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse 50% 50% at 50% 0%, rgba(15,113,87,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-semibold tracking-wider text-[#14b866] uppercase mb-4">
            Why Choose Hardware Wallets
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Security that{' '}
            <span className="bg-gradient-to-r from-[#0f7157] to-[#14b866] bg-clip-text text-transparent">
              never sleeps
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto">
            Every device in our catalog is hand-picked for maximum security.
            Certified authentic, full warranty, direct from the manufacturer.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-[#0f7157]/30 hover:bg-white/[0.04]"
            >
              {/* Icon */}
              <div className="mb-5 inline-flex items-center justify-center rounded-xl bg-[#0f7157]/10 p-3">
                <feature.icon className="size-6 text-[#14b866]" />
              </div>

              <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/40">{feature.description}</p>

              {/* Hover accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0f7157]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
