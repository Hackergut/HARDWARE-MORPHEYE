'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface SocialProofMessage {
  name: string
  city: string
  product: string
  timeAgo: string
  initial: string
  color: string
}

const messages: SocialProofMessage[] = [
  { name: 'Sarah', city: 'New York', product: 'Ledger Nano X', timeAgo: 'just now', initial: 'S', color: 'bg-cyan-500' },
  { name: 'Michael', city: 'London', product: 'Trezor Model T', timeAgo: '2 minutes ago', initial: 'M', color: 'bg-teal-500' },
  { name: 'Alex', city: 'Tokyo', product: 'Keystone Pro 3', timeAgo: '5 minutes ago', initial: 'A', color: 'bg-amber-500' },
  { name: 'Emma', city: 'Berlin', product: 'Ledger Nano S Plus', timeAgo: '3 minutes ago', initial: 'E', color: 'bg-emerald-500' },
  { name: 'David', city: 'Sydney', product: 'Trezor Safe 3', timeAgo: '8 minutes ago', initial: 'D', color: 'bg-violet-500' },
  { name: 'Lisa', city: 'Toronto', product: 'Cryptosteel Capsule', timeAgo: '1 minute ago', initial: 'L', color: 'bg-rose-500' },
  { name: 'James', city: 'Singapore', product: 'Ledger Nano X', timeAgo: '4 minutes ago', initial: 'J', color: 'bg-blue-500' },
  { name: 'Sofia', city: 'Paris', product: 'Trezor Model One', timeAgo: '6 minutes ago', initial: 'S', color: 'bg-orange-500' },
  { name: 'Ryan', city: 'Dubai', product: 'Keystone Pro 3', timeAgo: 'just now', initial: 'R', color: 'bg-cyan-600' },
  { name: 'Olivia', city: 'Amsterdam', product: 'Ledger Nano S Plus', timeAgo: '7 minutes ago', initial: 'O', color: 'bg-pink-500' },
  { name: 'Marcus', city: 'Seoul', product: 'Trezor Safe 3', timeAgo: '3 minutes ago', initial: 'M', color: 'bg-indigo-500' },
  { name: 'Anna', city: 'Stockholm', product: 'Cryptosteel Capsule', timeAgo: '9 minutes ago', initial: 'A', color: 'bg-lime-500' },
  { name: 'Carlos', city: 'Mexico City', product: 'Ledger Nano X', timeAgo: '2 minutes ago', initial: 'C', color: 'bg-red-500' },
  { name: 'Yuki', city: 'Osaka', product: 'Trezor Model T', timeAgo: '5 minutes ago', initial: 'Y', color: 'bg-sky-500' },
  { name: 'Hannah', city: 'Melbourne', product: 'Keystone Pro 3', timeAgo: '1 minute ago', initial: 'H', color: 'bg-fuchsia-500' },
  { name: 'Leo', city: 'São Paulo', product: 'Ledger Nano S Plus', timeAgo: '10 minutes ago', initial: 'L', color: 'bg-yellow-500' },
]

const VISIBLE_DURATION = 5000
const INTERVAL_MIN = 15000
const INTERVAL_MAX = 25000

function getRandomInterval(): number {
  return INTERVAL_MIN + Math.random() * (INTERVAL_MAX - INTERVAL_MIN)
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function SocialProofNotification() {
  const [currentMessage, setCurrentMessage] = useState<SocialProofMessage | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [notificationKey, setNotificationKey] = useState(0)
  const indexRef = useRef(0)
  const shuffledRef = useRef<SocialProofMessage[]>(shuffleArray(messages))

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const showNext = () => {
      const shuffled = shuffledRef.current
      if (indexRef.current >= shuffled.length) {
        shuffledRef.current = shuffleArray(messages)
        indexRef.current = 0
      }

      const msg = shuffledRef.current[indexRef.current]
      indexRef.current++

      setCurrentMessage(msg)
      setIsVisible(true)
      setNotificationKey((k) => k + 1)

      // Hide after visible duration
      timeoutId = setTimeout(() => {
        setIsVisible(false)

        // Schedule next notification
        timeoutId = setTimeout(() => {
          showNext()
        }, getRandomInterval())
      }, VISIBLE_DURATION)
    }

    // Initial delay
    timeoutId = setTimeout(() => {
      showNext()
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [])

  if (!currentMessage) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-[90]">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={notificationKey}
            initial={{ x: -120, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -120, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto max-w-[320px] overflow-hidden rounded-xl border border-cyan-500/20 bg-card/95 px-4 py-3 shadow-xl shadow-cyan-500/5 backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${currentMessage.color}`}>
                {currentMessage.initial}
              </div>

              {/* Message */}
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-neutral-200">
                  <span className="font-semibold text-foreground">{currentMessage.name}</span>
                  {' from '}
                  <span className="font-medium text-cyan-400">{currentMessage.city}</span>
                  {' purchased '}
                  <span className="font-semibold text-foreground">{currentMessage.product}</span>
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{currentMessage.timeAgo}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    Verified Purchase
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
