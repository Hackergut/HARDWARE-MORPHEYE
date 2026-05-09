'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Mail, Loader2, X, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNotificationStore } from '@/store/notification-store'

const TRACK_DELAY = 30000
const LS_DISMISSED_KEY = 'morpheye_cart_abandonment_dismissed'
const PROMPT_DELAY = 5000

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface CartAbandonmentTrackerProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }>
  subtotal: number
  couponCode?: string | null
}

export function CartAbandonmentTracker({ items = [], subtotal = 0, couponCode }: CartAbandonmentTrackerProps) {
  const [promptVisible, setPromptVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [focused, setFocused] = useState(false)
  const showNotification = useNotificationStore((s) => s.show)
  const hasTrackedRef = useRef(false)

  // Dismiss once per session for this page view
  const dismissPrompt = useCallback(() => {
    setPromptVisible(false)
    localStorage.setItem(LS_DISMISSED_KEY, Date.now().toString())
  }, [])

  useEffect(() => {
    if (items.length === 0) return

    // Track cart to backend after delay
    const stored = localStorage.getItem(LS_DISMISSED_KEY)
    if (stored) {
      const elapsed = Date.now() - parseInt(stored, 10)
      if (elapsed < 86400000) return // 24h cooldown
    }

    const trackTimer = setTimeout(async () => {
      if (hasTrackedRef.current) return
      hasTrackedRef.current = true

      try {
        await fetch('/api/abandoned-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: '',
            items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
            subtotal,
            couponCode: couponCode || null,
          }),
        })
      } catch {
        // Silent fail – analytics tracking
      }
    }, TRACK_DELAY)

    // Show email prompt after short delay
    const promptTimer = setTimeout(() => {
      setPromptVisible(true)
    }, PROMPT_DELAY)

    return () => {
      clearTimeout(trackTimer)
      clearTimeout(promptTimer)
    }
  }, [items, subtotal, couponCode])

  const handleSave = async (e: React.FormEvent) => {
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
      const res = await fetch('/api/abandoned-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: email.split('@')[0],
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          subtotal,
          couponCode: couponCode || null,
        }),
      })

      if (res.ok) {
        setSaved(true)
        showNotification('We saved your cart! Check your email for a recovery link.', 'success')
        setTimeout(dismissPrompt, 2000)
      } else {
        showNotification('Failed to save cart. Please try again.', 'error')
      }
    } catch {
      showNotification('Network error. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) return null

  return (
    <AnimatePresence>
      {promptVisible && !saved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-background to-teal-950/20 p-5 shadow-lg"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <ShoppingBag className="size-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Don&apos;t lose your cart!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Save your cart and we&apos;ll email you a recovery link.
                </p>
              </div>
            </div>
            <button
              onClick={dismissPrompt}
              className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-neutral-800 hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Your email address"
                disabled={submitting}
                className={`h-9 border-border bg-card/80 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                  focused
                    ? 'border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20'
                    : ''
                } ${emailError ? 'border-red-500' : ''}`}
              />
              {emailError && (
                <p className="absolute -bottom-4 left-0 text-[10px] text-red-400">{emailError}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="h-9 bg-gradient-to-r from-cyan-500 to-teal-500 px-4 text-xs font-semibold text-black shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:from-cyan-400 hover:to-teal-400 active:scale-[0.98]"
            >
              {submitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  Save Cart
                  <ArrowRight className="ml-1 size-3.5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
            <ShieldCheck className="size-2.5" />
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
