'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Lock, ShieldCheck, Gift, Clock, Loader2 } from 'lucide-react'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [focused, setFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')
  const showNotification = useNotificationStore((s) => s.show)

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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0],
          email,
          subject: 'Newsletter Subscription',
          message: `Newsletter subscription request from ${email}`,
        }),
      })

      if (res.ok) {
        setSubscribed(true)
        setEmail('')
        showNotification('Successfully subscribed to newsletter!', 'success')
      } else {
        const data = await res.json()
        showNotification(data.error || 'Failed to subscribe. Please try again.', 'error')
      }
    } catch {
      showNotification('Network error. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 dark:from-cyan-950/40 from-cyan-50 via-[#0a0a0a] dark:via-[#0a0a0a] via-white to-teal-950/30 dark:to-teal-950/30 to-teal-50" />
      
      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 size-96 rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 size-64 rounded-full bg-teal-500/5 blur-[100px]" />

      {/* Floating crypto symbols */}
      <div className="absolute left-[8%] top-[20%] select-none text-4xl font-bold text-cyan-500/8 crypto-float-1">
        ₿
      </div>
      <div className="absolute right-[12%] top-[30%] select-none text-3xl font-bold text-teal-500/6 crypto-float-2">
        Ξ
      </div>
      <div className="absolute left-[18%] bottom-[25%] select-none text-2xl font-bold text-cyan-400/5 crypto-float-2">
        ◎
      </div>
      <div className="absolute right-[20%] bottom-[20%] select-none text-3xl font-bold text-teal-400/6 crypto-float-1">
        ₿
      </div>
      <div className="absolute left-[50%] top-[10%] select-none text-2xl font-bold text-cyan-300/4 crypto-float-1" style={{ animationDelay: '2s' }}>
        Ξ
      </div>

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Crypto/Lock Icon Visual with pulsing ring */}
          <div className="mb-8 flex justify-center">
            <div className="ring-pulse-outer relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="flex size-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 shadow-lg shadow-cyan-500/10"
              >
                <Lock className="size-7 text-cyan-400" />
              </motion.div>
              {/* Existing animated ring */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-2 rounded-2xl border border-cyan-500/10"
              />
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Stay Ahead in Crypto Security
          </h2>
          <p className="mb-3 text-muted-foreground">
            Get exclusive deals, security tips, and early access to new products.
          </p>

          {/* Incentive Text */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2">
            <Gift className="size-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">
              10% off your first order when you subscribe
            </span>
          </div>

          {/* Subscriber Social Proof */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Overlapping Avatars */}
              <div className="flex -space-x-2">
                {[
                  { initial: 'A', color: 'bg-cyan-500' },
                  { initial: 'M', color: 'bg-teal-500' },
                  { initial: 'S', color: 'bg-amber-500' },
                  { initial: 'K', color: 'bg-emerald-500' },
                  { initial: 'R', color: 'bg-violet-500' },
                ].map((avatar, i) => (
                  <div
                    key={i}
                    className={`flex size-7 items-center justify-center rounded-full border-2 border-background dark:border-background border-card text-[10px] font-bold text-white ${avatar.color}`}
                  >
                    {avatar.initial}
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                Join <span className="text-cyan-400">12,847+</span> subscribers
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3" />
              <span>Latest issue sent 2 days ago</span>
            </div>
          </div>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-5 text-center shadow-lg shadow-cyan-500/5"
            >
              <div className="mb-2 flex justify-center">
                <ShieldCheck className="size-8 text-cyan-400" />
              </div>
              <p className="text-base font-semibold text-cyan-400">
                You&apos;re subscribed!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check your inbox for your 10% discount code.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
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
                  placeholder="Enter your email address"
                  disabled={submitting}
                  className={`h-12 border-border bg-card/80 pl-10 pr-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                    focused
                      ? 'border-cyan-500/60 shadow-[0_0_16px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/20'
                      : ''
                  } ${emailError ? 'border-red-500 dark:border-red-500' : ''}`}
                />
                {emailError && (
                  <p className="absolute -bottom-5 left-0 text-[10px] text-red-400">{emailError}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="subscribe-burst h-12 bg-cyan-500 px-8 font-semibold text-black shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-500/40 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3" />
            <span>
              No spam. Unsubscribe anytime.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
