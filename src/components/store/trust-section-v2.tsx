'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const trustItems = [
  {
    image: '/images/products/badges/always-reliable.png',
    title: 'Always Reliable',
    description: 'Every device tested and certified before shipping. Zero compromises on quality.',
  },
  {
    image: '/images/products/badges/anti-collision-indestructible.png',
    title: 'Indestructible Build',
    description: 'Military-grade materials. Fireproof, waterproof, shockproof backup solutions.',
  },
  {
    image: '/images/products/badges/trusted1.webp',
    title: 'Trusted Worldwide',
    description: 'Official authorized reseller. Full manufacturer warranty on every purchase.',
  },
  {
    image: '/images/products/badges/wireless-charging.webp',
    title: 'Modern Connectivity',
    description: 'Bluetooth, NFC, USB-C, wireless charging. Compatible with all your devices.',
  },
  {
    image: '/images/products/badges/key-tag-intro-desktop-04.webp',
    title: 'Key Management',
    description: 'Shamir backup, SLIP39, BIP39. Your keys, your crypto, always recoverable.',
  },
  {
    image: '/images/products/badges/supported-cryptos-bg-light-2.webp',
    title: 'Multi-Coin Support',
    description: 'Bitcoin, Ethereum, Solana, XRP and 5000+ tokens supported across all devices.',
  },
]

export function TrustSectionV2() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-semibold tracking-wider text-[#14b866] uppercase mb-4">
            Why Hardware Wallets
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Trust built on{' '}
            <span className="bg-gradient-to-r from-[#0f7157] to-[#14b866] bg-clip-text text-transparent">
              real security
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto">
            Not your keys, not your crypto. Hardware wallets keep your private keys
            offline and away from hackers, exchanges, and malware.
          </p>
        </motion.div>

        {/* Trust Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#0f7157]/30 hover:bg-white/[0.04]"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
