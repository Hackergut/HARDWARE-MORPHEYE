'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Copy, CheckCircle2, X, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ReferralBanner() {
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/loyalty/referral')
      .then((r) => r.json())
      .then((data) => {
        if (data.referralCode) setReferralCode(data.referralCode)
      })
      .catch(() => {})
  }, [])

  if (!referralCode || dismissed) return null

  const handleCopy = () => {
    const link = `${window.location.origin}/?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-cyan-500/10"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <Users className="size-4 shrink-0 text-cyan-400" />
          <p className="text-xs font-medium text-foreground sm:text-sm">
            Invite friends, earn{' '}
            <span className="font-bold text-cyan-400">500 points</span> per referral
          </p>
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
              copied
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-cyan-500 text-black hover:bg-cyan-400'
            )}
          >
            {copied ? (
              <>
                <CheckCircle2 className="size-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Share Link
              </>
            )}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Dismiss referral banner"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
