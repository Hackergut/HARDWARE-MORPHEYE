'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Mail, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNotificationStore } from '@/store/notification-store'

const LS_KEY = 'morpheye_exit_intent_dismissed'
const DISMISS_DAYS = 30
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [focused, setFocused] = useState(false)
  const showNotification = useNotificationStore((s) => s.show)
  const hasShownRef = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) {
      const dismissedAt = parseInt(stored, 10)
      const elapsed = Date.now() - dismissedAt
      const maxAge = DISMISS_DAYS * 24 * 60 * 60 * 1000
      if (elapsed < maxAge) return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasShownRef.current) return
      if (e.clientY <= 0) {
        hasShownRef.current = true
        setVisible(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(LS_KEY, Date.now().toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          recipient: email,
          subject: 'Your 10% discount code inside!',
          body: `<h2>Wait! Don't leave empty-handed!</h2><p>Use code <strong>SAVE10</strong> for 10% off your first order.</p>`,
        }),
      })

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0],
          email,
          subject: 'Exit Intent Popup Subscription',
          message: `Subscribed via exit-intent popup from ${email}`,
        }),
      })

      setSubscribed(true)
      showNotification('Check your inbox for your discount code!', 'success')
    } catch {
      showNotification('Something went wrong. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-4 z-[101] m-auto flex max-h-[520px] max-w-lg items-center justify-center"
          >
            <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/20 bg-card shadow-2xl shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-background to-teal-950/20" />

              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

              <button
                onClick={dismiss}
                className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-neutral-800 hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <div className="relative p-8 text-center sm:p-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-lg shadow-amber-500/10"
                >
                  <Gift className="size-8 text-amber-400" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Wait! Get{' '}
                    <span className="text-gradient-cyan">10% Off</span>
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    You were about to leave with your cart still full. Complete your purchase and secure your crypto assets today.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5"
                >
                  <Sparkles className="size-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">
                    Use code <span className="font-bold">SAVE10</span> at checkout
                  </span>
                </motion.div>

                {subscribed ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-5"
                  >
                    <ShieldCheck className="mx-auto mb-2 size-8 text-cyan-400" />
                    <p className="font-semibold text-cyan-400">Discount sent!</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Check your inbox for your 10% off code.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (emailError) setEmailError('')
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Enter your email"
                        disabled={submitting}
                        className={`h-11 border-border bg-card/80 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                          focused
                            ? 'border-cyan-500/60 shadow-[0_0_16px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/20'
                            : ''
                        } ${emailError ? 'border-red-500' : ''}`}
                      />
                      {emailError && (
                        <p className="absolute -bottom-5 left-0 text-[10px] text-red-400">{emailError}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-11 w-full bg-gradient-to-r from-cyan-500 to-teal-500 font-semibold text-black shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:from-cyan-400 hover:to-teal-400 hover:shadow-cyan-500/40 active:scale-[0.98]"
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        'Get My Discount'
                      )}
                    </Button>
                  </form>
                )}

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                  <ShieldCheck className="size-3" />
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
