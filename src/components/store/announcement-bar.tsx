'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const MESSAGES = [
  { full: '🔥 Free shipping on orders over $150', short: '🔥 Free shipping over $150' },
  { full: '⚡ Use code WELCOME10 for 10% off', short: '⚡ Code WELCOME10 for 10% off' },
  { full: '🛡️ 2-Year Warranty on All Devices', short: '🛡️ 2-Year Warranty on all devices' },
  { full: '⭐ Rated 4.9/5 by 50,000+ customers', short: '⭐ Rated 4.9/5 by 50K+ customers' },
]

const STORAGE_KEY = 'morpheye-announcement-dismissed'

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [direction, setDirection] = useState(1)

  const handleDismiss = useCallback(() => {
    setIsDismissed(true)
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // sessionStorage not available
    }
  }, [])

  // Rotate messages every 4 seconds
  useEffect(() => {
    if (isDismissed) return
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isDismissed])

  // Auto-reset to allow re-show in new sessions (not needed, sessionStorage handles this)

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="relative bg-background border-b border-border/50">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-1.5 sm:px-6 lg:px-8">
              {/* Left spacer for centering */}
              <div className="flex-1" />

              {/* Rotating message */}
              <div className="relative h-5 overflow-hidden sm:h-6">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.p
                    key={currentIndex}
                    custom={direction}
                    initial={{ y: direction > 0 ? 20 : -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: direction > 0 ? -20 : 20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="whitespace-nowrap text-center text-xs font-medium sm:text-sm"
                  >
                    <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                      <span className="sm:hidden">{MESSAGES[currentIndex].short}</span>
                      <span className="hidden sm:inline">{MESSAGES[currentIndex].full}</span>
                    </span>
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Close button */}
              <div className="flex flex-1 items-center justify-end">
                <button
                  onClick={handleDismiss}
                  className="ml-3 flex size-6 items-center justify-center rounded-full border border-border/50 text-neutral-500 transition-all hover:border-border hover:bg-muted hover:text-foreground"
                  aria-label="Dismiss announcement"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
