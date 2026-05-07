'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Truck, Headset, RefreshCw, Lock, CheckCircle2, Fingerprint, Server } from 'lucide-react'

const pillars = [
  {
    icon: Shield,
    title: 'Authorized Reseller',
    description: 'Official partner of Ledger, Trezor & Keystone. Every device factory-sealed.',
    stat: '50,000+',
    statLabel: 'Customers Protected',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your data is protected with bank-grade encryption at every step.',
    stat: '256-bit',
    statLabel: 'AES Encryption',
  },
  {
    icon: Truck,
    title: 'Insured Shipping',
    description: 'Tamper-evident packaging with full insurance coverage.',
    stat: '2+',
    statLabel: 'Years Warranty',
  },
  {
    icon: CheckCircle2,
    title: 'Authenticity Verified',
    description: 'Every device verified against manufacturer hologram and serial.',
    stat: '100%',
    statLabel: 'Genuine Products',
  },
  {
    icon: Headset,
    title: 'Expert Support',
    description: '24/7 crypto security specialists ready to help.',
    stat: '24/7',
    statLabel: 'Support Available',
  },
  {
    icon: RefreshCw,
    title: 'Money-Back Guarantee',
    description: '30-day hassle-free returns. No questions asked.',
    stat: '30',
    statLabel: 'Days Return Policy',
  },
  {
    icon: Fingerprint,
    title: 'Secure Element',
    description: 'CC EAL5+ certified chips protect your private keys.',
    stat: 'EAL5+',
    statLabel: 'Certification Level',
  },
  {
    icon: Server,
    title: 'Zero Knowledge',
    description: 'We never have access to your seed phrase or private keys.',
    stat: '$0',
    statLabel: 'Lost to Hacks',
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

export function TrustSecurityBanner() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section id="why-choose-morpheye" className="relative overflow-hidden border-y border-border py-16 sm:py-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-20' : 'opacity-0'}`}
        >
          <source src="/videos/trust-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/5 via-transparent to-teal-950/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Why Choose <span className="text-gradient-cyan">Morpheye</span>?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your security is our top priority — trusted by thousands worldwide
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07 }}
              className="gradient-border-top group flex flex-col items-center rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 text-center transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 hover:bg-card/80"
            >
              <div className="icon-pulse-hover mb-3 flex size-12 items-center justify-center rounded-lg bg-cyan-500/10 transition-all duration-300 group-hover:bg-cyan-500/15 group-hover:shadow-md group-hover:shadow-cyan-500/10">
                <pillar.icon className="size-6 text-cyan-400" />
              </div>

              <div className="mb-1">
                <AnimatedCounter value={pillar.stat} />
              </div>
              <p className="mb-2 text-[10px] font-medium tracking-wider text-cyan-400/60 uppercase">
                {pillar.statLabel}
              </p>

              <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-cyan-400/60" />
            <span>CC EAL5+ Certified</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-cyan-400/60" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-cyan-400/60" />
            <span>Factory Sealed Devices</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-cyan-400/60" />
            <span>Insured Delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}