'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

const images = [
  '/images/products/trezor-safe-7/hero.webp',
  '/images/products/other/onekey-pro.webp',
  '/images/products/trezor-safe-3/hero.webp',
  '/images/products/other/secux-nifty.webp',
  '/images/products/sy2-pro/hero-1.webp',
  '/images/products/other/s1pro5.webp',
]

export function ParallaxGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section ref={containerRef} className="relative py-24 sm:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-semibold tracking-wider text-[#14b866] uppercase mb-4">
            Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            See the{' '}
            <span className="bg-gradient-to-r from-[#0f7157] to-[#14b866] bg-clip-text text-transparent">
              difference
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {images.map((src, i) => {
            const y = i % 3 === 0 ? y1 : i % 3 === 1 ? y2 : y3
            return (
              <motion.div
                key={src}
                style={{ y }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]"
              >
                <Image
                  src={src}
                  alt={`Product ${i + 1}`}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
