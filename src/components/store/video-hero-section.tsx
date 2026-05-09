'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export function VideoHeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section ref={containerRef} className="relative h-[100dvh] overflow-hidden bg-[#0a0a0a]">
      <motion.div style={{ scale }} className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/20 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block text-[11px] font-semibold tracking-wider text-[#14b866] uppercase mb-6">
            The Future of Crypto Security
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.05]"
        >
          Hardware wallets
          <br />
          <span className="bg-gradient-to-r from-[#0f7157] via-[#14b866] to-[#34d399] bg-clip-text text-transparent">
            reimagined
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-white/60 max-w-xl mb-10"
        >
          Experience the next generation of crypto security with stunning design,
          wireless connectivity, and military-grade protection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-4"
        >
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
