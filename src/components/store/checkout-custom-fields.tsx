'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Gift,
  MessageSquare,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface CheckoutCustomFieldsProps {
  onNotesChange?: (notes: string) => void
  onGiftChange?: (enabled: boolean, message: string) => void
}

export function CheckoutCustomFields({
  onNotesChange,
  onGiftChange,
}: CheckoutCustomFieldsProps) {
  const [orderNotes, setOrderNotes] = useState('')
  const [giftEnabled, setGiftEnabled] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [notesExpanded, setNotesExpanded] = useState(false)
  const [giftExpanded, setGiftExpanded] = useState(false)

  const handleNotesChange = (val: string) => {
    setOrderNotes(val)
    onNotesChange?.(val)
  }

  const handleGiftToggle = () => {
    const next = !giftEnabled
    setGiftEnabled(next)
    if (!next) {
      setGiftMessage('')
      onGiftChange?.(false, '')
    } else {
      onGiftChange?.(true, giftMessage)
    }
  }

  const handleGiftMessageChange = (val: string) => {
    setGiftMessage(val)
    onGiftChange?.(true, val)
  }

  return (
    <div className="space-y-4">
      {/* Order Notes */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => setNotesExpanded(!notesExpanded)}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <MessageSquare className="size-4 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Order Notes</p>
              <p className="text-xs text-muted-foreground">Special instructions for your order</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: notesExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-muted-foreground" />
          </motion.div>
        </button>
        <AnimatePresence>
          {notesExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-border px-5 pb-4 pt-3">
                <textarea
                  value={orderNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Delivery instructions, gate code, leave at door, etc..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-colors"
                />
                <p className="mt-1 text-right text-[10px] text-muted-foreground">
                  {orderNotes.length}/500
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gift Message */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => setGiftExpanded(!giftExpanded)}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Gift className="size-4 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Gift Message</p>
              <p className="text-xs text-muted-foreground">Add a personal message</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: giftExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-muted-foreground" />
          </motion.div>
        </button>
        <AnimatePresence>
          {giftExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-border px-5 pb-4 pt-3 space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Gift className="size-4 text-amber-400" />
                    <span className="text-sm text-foreground">Add gift wrapping</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGiftToggle}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none',
                      giftEnabled
                        ? 'border-cyan-500/30 bg-cyan-500/20'
                        : 'border-neutral-700 bg-neutral-800'
                    )}
                    role="switch"
                    aria-checked={giftEnabled}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block size-3.5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out',
                        giftEnabled
                          ? 'translate-x-4 bg-cyan-400'
                          : 'translate-x-0.5 bg-neutral-500'
                      )}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {giftEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Gift Message</Label>
                        <textarea
                          value={giftMessage}
                          onChange={(e) => {
                            if (e.target.value.length <= 200) {
                              handleGiftMessageChange(e.target.value)
                            }
                          }}
                          placeholder="Write a personal message for the recipient..."
                          rows={3}
                          className="w-full resize-none rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-colors"
                        />
                        <p className="text-right text-[10px] text-muted-foreground">
                          {giftMessage.length}/200
                        </p>
                      </div>
                      {giftMessage.trim() && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 rounded-lg border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-3"
                        >
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                            Preview
                          </p>
                          <div className="rounded-lg border border-border bg-card p-2.5">
                            <Gift className="absolute -top-1.5 -right-1 size-4 text-amber-400/30" />
                            <p className="text-sm italic text-foreground">
                              &ldquo;{giftMessage}&rdquo;
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Express Checkout */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <CreditCard className="size-4 text-cyan-400" />
          <span className="text-sm font-medium text-foreground">Express Checkout</span>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Pay quickly with your preferred digital wallet
        </p>
        <div className="grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground h-10"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            PayPal
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground h-10"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Google Pay
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground h-10"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Apple Pay
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-400" />
          <span className="text-sm font-medium text-foreground">Secure Checkout</span>
        </div>
        <Separator className="mb-4 bg-border/60" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 shrink-0">
              <Lock className="size-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground leading-tight">256-bit SSL</p>
              <p className="text-[9px] text-muted-foreground">Encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0">
              <ShieldCheck className="size-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground leading-tight">30-Day</p>
              <p className="text-[9px] text-muted-foreground">Money Back</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 shrink-0">
              <svg className="size-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="8" cy="12" r="2" />
                <path d="M12 12H22" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground leading-tight">PCI DSS</p>
              <p className="text-[9px] text-muted-foreground">Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 shrink-0">
              <svg className="size-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground leading-tight">Insured</p>
              <p className="text-[9px] text-muted-foreground">Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
