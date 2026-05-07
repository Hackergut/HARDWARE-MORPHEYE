'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ShoppingBag,
  Package,
  Mail,
  Truck,
  Bell,
  Share2,
  Twitter,
  ExternalLink,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'

function getInitialOrderNumber(): string {
  if (typeof window === 'undefined') return ''
  const num = sessionStorage.getItem('lastOrderNumber')
  if (num) {
    sessionStorage.removeItem('lastOrderNumber')
    return num
  }
  return ''
}

function getInitialOrderTotal(): string {
  if (typeof window === 'undefined') return ''
  const total = sessionStorage.getItem('lastOrderTotal')
  if (total) {
    sessionStorage.removeItem('lastOrderTotal')
    return total
  }
  return ''
}

// Fire Meta Pixel purchase event if available
function firePurchaseEvent(orderNumber: string, total: string) {
  try {
    if (typeof window !== 'undefined' && (window as Record<string, unknown>).fbq) {
      const fbq = (window as Record<string, unknown>).fbq as (...args: unknown[]) => void
      fbq('track', 'Purchase', {
        value: parseFloat(total) || 0,
        currency: 'USD',
        order_id: orderNumber,
      })
    }
  } catch {
    // Pixel not available
  }
}

// Calculate estimated delivery date (5-7 business days from now)
function getEstimatedDelivery(): string {
  const date = new Date()
  let daysAdded = 0
  while (daysAdded < 7) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) daysAdded++
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

const steps = [
  {
    icon: Mail,
    title: 'Confirmation Email',
    description: 'You\'ll receive an order confirmation email shortly.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    icon: Package,
    title: 'Order Processing',
    description: 'We\'ll prepare and pack your items with care.',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
  },
  {
    icon: Bell,
    title: 'Shipping Notification',
    description: 'You\'ll get a tracking number once shipped.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
]

export function CheckoutSuccess() {
  const { navigate } = useNavigationStore()
  const [orderNumber] = useState<string>(getInitialOrderNumber)
  const [orderTotal] = useState<string>(getInitialOrderTotal)
  const [shared, setShared] = useState(false)

  // Fire Meta Pixel purchase event on mount
  useEffect(() => {
    if (orderNumber) {
      firePurchaseEvent(orderNumber, orderTotal)
    }
  }, [orderNumber, orderTotal])

  const handleShare = async () => {
    const text = `Just secured my crypto with Morpheye! 🛡️🔐`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Morpheye Purchase',
          text,
          url: window.location.href,
        })
        setShared(true)
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text + ' ' + window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    }
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Just secured my crypto with Morpheye! 🛡️🔐`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex size-24 items-center justify-center rounded-full border-2 border-cyan-500/30 bg-cyan-500/10 shadow-xl shadow-cyan-500/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          >
            <CheckCircle2 className="size-12 text-cyan-400" />
          </motion.div>
        </motion.div>
        
        {/* Animated ring */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-cyan-500"
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-2 text-3xl font-bold text-foreground md:text-4xl"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mb-6 text-muted-foreground"
      >
        Thank you for your purchase. Your order is being processed.
      </motion.p>

      {/* Order Details Card */}
      {orderNumber && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-6 w-full max-w-md rounded-xl border border-border dark:bg-card bg-white p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Order Number
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-cyan-400">
                {orderNumber}
              </p>
            </div>
            {orderTotal && (
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  ${parseFloat(orderTotal).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5">
            <Truck className="size-4 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Delivery</p>
              <p className="text-sm font-medium text-foreground">5–7 business days</p>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">
              by {getEstimatedDelivery()}
            </span>
          </div>
        </motion.div>
      )}

      {/* What's Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mb-8 w-full max-w-md"
      >
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          What&apos;s Next
        </h3>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              className={`flex items-center gap-3 rounded-lg border ${step.borderColor} dark:bg-card bg-white p-3.5`}
            >
              <div className={`flex size-9 flex-shrink-0 items-center justify-center rounded-lg ${step.bgColor}`}>
                <step.icon className={`size-4 ${step.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social Sharing CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mb-8 w-full max-w-md"
      >
        <div className="rounded-xl border border-border dark:bg-card bg-white p-5 text-center">
          <p className="mb-3 text-sm font-medium text-foreground">
            Share your purchase! 🎉
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Share2 className="mr-2 size-4" />
              {shared ? 'Link Copied!' : 'Share'}
            </Button>
            <Button
              onClick={handleTwitterShare}
              variant="outline"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Twitter className="mr-2 size-4" />
              Tweet
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Button
          onClick={() => navigate('shop')}
          className="bg-cyan-500 px-8 text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-500/30"
        >
          <ShoppingBag className="mr-2 size-4" />
          Continue Shopping
        </Button>
        <Button
          onClick={() => navigate('tracking')}
          variant="outline"
          className="border-border text-foreground hover:bg-muted"
        >
          <ExternalLink className="mr-2 size-4" />
          Track Order
        </Button>
      </motion.div>
    </motion.div>
  )
}
