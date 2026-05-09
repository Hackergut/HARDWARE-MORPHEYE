'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Calendar,
  Clock,
  PauseCircle,
  PlayCircle,
  XCircle,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Subscription, SubscriptionInterval, SubscriptionStatus } from '@/lib/types'

const INTERVAL_LABELS: Record<SubscriptionInterval, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
}

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  paused: { label: 'Paused', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10' },
}

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [changeIntervalId, setChangeIntervalId] = useState<string | null>(null)
  const { navigate } = useNavigationStore()
  const showNotification = useNotificationStore((s) => s.show)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/subscriptions')
      if (res.ok) {
        const data = await res.json()
        setSubscriptions(data.subscriptions ?? [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'pause' | 'resume' | 'cancel') => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const messages: Record<string, string> = {
          pause: 'Subscription paused',
          resume: 'Subscription resumed',
          cancel: 'Subscription cancelled',
        }
        showNotification(messages[action], 'success')
        fetchSubscriptions()
      } else {
        const err = await res.json()
        showNotification(err.error || 'Action failed', 'error')
      }
    } catch {
      showNotification('Action failed', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleIntervalChange = async (id: string, interval: string) => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateInterval', interval }),
      })
      if (res.ok) {
        showNotification(`Interval changed to ${interval}`, 'success')
        setChangeIntervalId(null)
        fetchSubscriptions()
      } else {
        const err = await res.json()
        showNotification(err.error || 'Failed to update interval', 'error')
      }
    } catch {
      showNotification('Failed to update interval', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl border border-border p-4">
              <div className="size-16 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-3 w-1/4 rounded bg-muted" />
                <div className="h-3 w-1/5 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your recurring orders and delivery schedules
          </p>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/50 py-16"
        >
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Package className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-foreground">No active subscriptions</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Subscribe to your favorite products for automatic deliveries
          </p>
          <Button
            onClick={() => navigate('shop')}
            className="bg-cyan-500 text-black hover:bg-cyan-400"
          >
            Browse Products
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {subscriptions.map((sub) => {
              const statusConfig = STATUS_CONFIG[sub.status as SubscriptionStatus] || STATUS_CONFIG.active
              const isChanging = changeIntervalId === sub.id

              return (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'rounded-xl border p-4 transition-all sm:p-5',
                    sub.status === 'active'
                      ? 'border-cyan-500/20 bg-cyan-500/[0.02]'
                      : sub.status === 'paused'
                        ? 'border-amber-500/20 bg-amber-500/[0.02]'
                        : 'border-border bg-card/30 opacity-60'
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                        {sub.productImage ? (
                          <Image
                            src={sub.productImage}
                            alt={sub.productName || 'Product'}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <Package className="size-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {sub.productName || 'Unknown Product'}
                          </p>
                          <Badge className={cn('text-[10px] font-bold', statusConfig.bg, statusConfig.color)}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <RefreshCw className="size-3.5" />
                            {INTERVAL_LABELS[sub.interval as SubscriptionInterval] || sub.interval}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="size-3.5" />
                            ${sub.price.toFixed(2)}/delivery
                          </div>
                          {sub.nextDelivery && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="size-3.5" />
                              Next: {new Date(sub.nextDelivery).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Started {new Date(sub.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {sub.status === 'active' && (
                        <>
                          <Button
                            onClick={() => handleAction(sub.id, 'pause')}
                            disabled={actionLoading === sub.id}
                            size="sm"
                            variant="outline"
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          >
                            {actionLoading === sub.id ? (
                              <RefreshCw className="mr-1 size-3.5 animate-spin" />
                            ) : (
                              <PauseCircle className="mr-1 size-3.5" />
                            )}
                            Pause
                          </Button>
                          <div className="relative">
                            <Button
                              onClick={() => setChangeIntervalId(isChanging ? null : sub.id)}
                              size="sm"
                              variant="outline"
                              className="border-border text-muted-foreground hover:bg-muted"
                            >
                              <Clock className="mr-1 size-3.5" />
                              {INTERVAL_LABELS[sub.interval as SubscriptionInterval] || sub.interval}
                              <ChevronDown className={cn('ml-1 size-3 transition-transform', isChanging && 'rotate-180')} />
                            </Button>
                            <AnimatePresence>
                              {isChanging && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
                                >
                                  {(['weekly', 'monthly', 'quarterly', 'yearly'] as SubscriptionInterval[]).map(
                                    (int) => (
                                      <button
                                        key={int}
                                        onClick={() => handleIntervalChange(sub.id, int)}
                                        disabled={int === sub.interval || actionLoading === sub.id}
                                        className={cn(
                                          'flex w-full items-center px-3 py-2 text-xs transition-colors hover:bg-muted',
                                          int === sub.interval
                                            ? 'font-semibold text-cyan-400'
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        {int === sub.interval && <CheckCircle2 className="mr-2 size-3.5 text-cyan-400" />}
                                        {INTERVAL_LABELS[int]}
                                      </button>
                                    )
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      )}

                      {sub.status === 'paused' && (
                        <Button
                          onClick={() => handleAction(sub.id, 'resume')}
                          disabled={actionLoading === sub.id}
                          size="sm"
                          className="bg-cyan-500 text-xs text-black hover:bg-cyan-400"
                        >
                          {actionLoading === sub.id ? (
                            <RefreshCw className="mr-1 size-3.5 animate-spin" />
                          ) : (
                            <PlayCircle className="mr-1 size-3.5" />
                          )}
                          Resume
                        </Button>
                      )}

                      {sub.status !== 'cancelled' && (
                        <Button
                          onClick={() => handleAction(sub.id, 'cancel')}
                          disabled={actionLoading === sub.id}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          {actionLoading === sub.id ? (
                            <RefreshCw className="mr-1 size-3.5 animate-spin" />
                          ) : (
                            <XCircle className="mr-1 size-3.5" />
                          )}
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
