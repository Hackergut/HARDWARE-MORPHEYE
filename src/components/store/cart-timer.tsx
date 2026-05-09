'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CartTimerProps {
  expiresAt: string
  className?: string
  onExpire?: () => void
}

function getTimeLeft(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, diff)
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function CartTimer({ expiresAt, className, onExpire }: CartTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(getTimeLeft(expiresAt))
  const expiredRef = useRef(false)

  useEffect(() => {
    setTimeLeft(getTimeLeft(expiresAt))

    const interval = setInterval(() => {
      const remaining = getTimeLeft(expiresAt)
      setTimeLeft(remaining)

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpire])

  const expired = timeLeft <= 0
  const isUrgent = !expired && timeLeft < 5 * 60 * 1000

  if (expired) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5',
          className
        )}
      >
        <AlertTriangle className="size-4 shrink-0 text-red-400" />
        <span className="text-sm font-medium text-red-400">Sale ended</span>
      </div>
    )
  }

  return (
    <motion.div
      animate={isUrgent ? { scale: [1, 1.02, 1] } : undefined}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-4 py-2.5 transition-colors',
        isUrgent
          ? 'border-red-500/20 bg-red-500/10'
          : 'border-amber-500/20 bg-amber-500/10',
        className
      )}
    >
      <motion.div
        animate={isUrgent ? { rotate: [0, -10, 10, -10, 0] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Clock
          className={cn(
            'size-4 shrink-0',
            isUrgent ? 'text-red-400' : 'text-amber-400'
          )}
        />
      </motion.div>
      <span
        className={cn(
          'text-sm font-medium',
          isUrgent ? 'text-red-400' : 'text-amber-400'
        )}
      >
        Hurry! Sale ends in{' '}
        <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span>
      </span>
    </motion.div>
  )
}
