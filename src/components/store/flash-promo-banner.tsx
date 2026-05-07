'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, ArrowRight, Gift, Sparkles } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function getFlashSaleEnd(): Date {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return end
}

function getTimeLeft(end: Date): TimeLeft {
  const diff = end.getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export function FlashPromoBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { navigate } = useNavigationStore()
  const saleEnd = useRef(getFlashSaleEnd())

  useEffect(() => {
    setTimeLeft(getTimeLeft(saleEnd.current))
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(saleEnd.current))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-40' : 'opacity-0'}`}
        >
          <source src="/videos/promo-bg.mp4" type="video/mp4" />
        </video>
        <div className={`absolute inset-0 transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.9) 60%, rgba(20,184,166,0.15) 100%)' }} />
      </div>

      {/* Fallback bg */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-background to-teal-950/30" />

      {/* Animated border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left lg:justify-between">
          {/* Left: Flash Sale Info */}
          <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30"
              >
                <Zap className="size-4 text-black" />
              </motion.div>
              <span className="text-lg sm:text-xl font-extrabold text-foreground uppercase tracking-wider">
                Flash Sale
              </span>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="size-5 text-amber-400" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold"
            >
              <span className="text-gradient-cyan">Up to 25% Off</span>{' '}
              <span className="text-foreground">Hardware Wallets</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5"
            >
              <Gift className="size-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Use code <span className="font-bold">WELCOME10</span> for extra 10% off
              </span>
            </motion.div>
          </div>

          {/* Center: Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-cyan-400" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ends in</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' },
              ].map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center">
                    <div className="relative flex size-12 sm:size-14 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <motion.span
                        key={`${unit.label}-${unit.value}`}
                        initial={{ y: -4, opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="text-lg sm:text-xl font-bold tabular-nums text-cyan-400"
                      >
                        {pad(unit.value)}
                      </motion.span>
                      <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/10" />
                    </div>
                    <span className="mt-0.5 text-[9px] font-medium text-muted-foreground">{unit.label}</span>
                  </div>
                  {i < 2 && (
                    <span className="text-lg font-bold text-cyan-400/50 -mt-4">:</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <Button
              onClick={() => navigate('shop')}
              size="lg"
              className="group bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-6 text-sm sm:text-base font-bold text-black shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.97]"
            >
              Shop the Sale
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}