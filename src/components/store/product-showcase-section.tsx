'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowRight, Star } from 'lucide-react'

const showcaseProducts = [
  {
    id: 'trezor-safe-7',
    name: 'Trezor Safe 7',
    brand: 'Trezor',
    tagline: 'Bluetooth-enabled. EAL6+ Secure Element. Color touchscreen.',
    price: 79.99,
    comparePrice: 99.99,
    image: '/images/products/trezor-safe-7/hero.webp',
    features: ['EAL6+ Secure Element', 'Bluetooth 5.0', '1.54" Color Touch', 'Wireless Charging'],
    badge: 'New Release',
  },
  {
    id: 'trezor-safe-3',
    name: 'Trezor Safe 3',
    brand: 'Trezor',
    tagline: 'Compact security. Shamir Backup. USB-C.',
    price: 59.99,
    comparePrice: null,
    image: '/images/products/trezor-safe-3/hero.webp',
    features: ['Secure Element', 'Shamir Backup', 'USB-C', 'Haptic Feedback'],
    badge: 'Bestseller',
  },
  {
    id: 'sy2-pro',
    name: 'SY2 Pro',
    brand: 'SY2',
    tagline: 'Air-gapped QR signing. 4" touchscreen.',
    price: 89.99,
    comparePrice: 119.99,
    image: '/images/products/sy2-pro/hero-1.webp',
    features: ['Air-gapped', '4" Touchscreen', 'Fingerprint', 'Open Source'],
    badge: null,
  },
  {
    id: 'onekey-pro',
    name: 'OneKey Pro',
    brand: 'OneKey',
    tagline: 'Premium all-metal design. Multi-chain.',
    price: 129.99,
    comparePrice: 159.99,
    image: '/images/products/other/onekey-pro.webp',
    features: ['All-Metal Body', 'Multi-chain', 'Bluetooth', 'E-ink Display'],
    badge: 'Premium',
  },
  {
    id: 'secux-nifty',
    name: 'SecuX Nifty',
    brand: 'SecuX',
    tagline: 'Sleek NFC wallet. EAL5+ certified.',
    price: 149.99,
    comparePrice: null,
    image: '/images/products/other/secux-nifty.webp',
    features: ['NFC Enabled', 'EAL5+', 'Cross-chain', 'Compact'],
    badge: null,
  },
  {
    id: 's1pro5',
    name: 'S1 Pro V5',
    brand: 'S1',
    tagline: 'Military-grade steel. Indestructible backup.',
    price: 69.99,
    comparePrice: 89.99,
    image: '/images/products/other/s1pro5.webp',
    features: ['Steel Construction', 'Fireproof', 'Waterproof', 'Shockproof'],
    badge: 'Sale',
  },
]

export function ProductShowcaseSection() {
  const { navigate } = useNavigationStore()

  return (
    <section className="relative py-24 sm:py-32 bg-[#0a0a0a]">
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
            Curated Collection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Every wallet.{' '}
            <span className="bg-gradient-to-r from-[#0f7157] to-[#14b866] bg-clip-text text-transparent">
              Verified secure.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto">
            Hand-picked hardware wallets from the world&apos;s most trusted manufacturers.
            All certified authentic with full manufacturer warranty.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#0f7157]/30 hover:bg-white/[0.04]"
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold shadow-lg ${
                    product.badge === 'Sale'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : product.badge === 'New Release'
                      ? 'bg-[#0f7157] text-white'
                      : 'bg-[#0f7157]/20 text-[#14b866] border border-[#0f7157]/30'
                  }`}>
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-square p-6 sm:p-8">
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-0">
                <p className="text-[10px] font-semibold text-[#14b866] uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-white/40 mb-4">{product.tagline}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[10px] text-white/50"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="ml-2 text-sm text-white/30 line-through">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate('shop')}
                    className="bg-[#0f7157] hover:bg-[#14b866] text-white rounded-full px-4"
                  >
                    <ShoppingBag className="mr-1.5 size-3.5" />
                    Shop
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => navigate('shop')}
            variant="outline"
            size="lg"
            className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20 px-8"
          >
            View All Wallets
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
