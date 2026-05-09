'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  RefreshCw,
  Loader2,
  Clock,
  Calendar,
  Ban,
  Play,
  Package,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useNotificationStore } from '@/store/notification-store'
import { SubscriptionService } from '@/lib/services'
import type { Subscription } from '@/lib/types'

interface SubscriptionWithUser extends Subscription {
  user?: {
    id: string
    name: string | null
    email: string
  } | null
  product?: {
    id: string
    name: string
    image: string
  } | null
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  paused: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusFilters = ['all', 'active', 'paused', 'cancelled']

const intervalLabels: Record<string, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Cancel confirmation dialog
  const [cancelTarget, setCancelTarget] = useState<SubscriptionWithUser | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const showNotification = useNotificationStore((s) => s.show)

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await SubscriptionService.list()
      setSubscriptions(data as SubscriptionWithUser[])
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const filtered = subscriptions.filter((sub) => {
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        sub.user?.email?.toLowerCase().includes(q) ||
        sub.user?.name?.toLowerCase().includes(q) ||
        sub.productName?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handlePause = async (id: string) => {
    setActionLoading(id)
    try {
      await SubscriptionService.pause(id)
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'paused' as const } : s))
      )
      showNotification('Subscription paused', 'success')
    } catch {
      showNotification('Failed to pause subscription', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleResume = async (id: string) => {
    setActionLoading(id)
    try {
      await SubscriptionService.resume(id)
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'active' as const } : s))
      )
      showNotification('Subscription resumed', 'success')
    } catch {
      showNotification('Failed to resume subscription', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return
    setActionLoading(cancelTarget.id)
    try {
      await SubscriptionService.cancel(cancelTarget.id)
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === cancelTarget.id ? { ...s, status: 'cancelled' as const } : s
        )
      )
      showNotification('Subscription cancelled', 'success')
      setCancelDialogOpen(false)
      setCancelTarget(null)
    } catch {
      showNotification('Failed to cancel subscription', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const activeCount = subscriptions.filter((s) => s.status === 'active').length
  const pausedCount = subscriptions.filter((s) => s.status === 'paused').length
  const cancelledCount = subscriptions.filter((s) => s.status === 'cancelled').length

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-56 bg-neutral-800" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 bg-neutral-800" />
          <Skeleton className="h-10 w-40 bg-neutral-800" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 bg-neutral-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">Subscriptions</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage recurring subscriptions
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or product..."
            className="border-neutral-700 bg-neutral-800 pl-9 text-white placeholder:text-neutral-500"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full border-neutral-700 bg-neutral-800 text-white sm:w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="border-neutral-700 bg-neutral-900">
            {statusFilters.map((s) => (
              <SelectItem key={s} value={s}>
                <span className="capitalize">{s === 'all' ? 'All Statuses' : s}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={fetchSubscriptions}
          variant="outline"
          className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white"
        >
          <RefreshCw className="mr-2 size-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Active</p>
          <p className="mt-1 text-2xl font-bold text-white">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-xs font-medium text-yellow-400 uppercase tracking-wider">Paused</p>
          <p className="mt-1 text-2xl font-bold text-white">{pausedCount}</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Cancelled</p>
          <p className="mt-1 text-2xl font-bold text-white">{cancelledCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Customer</TableHead>
                <TableHead className="text-neutral-400">Product</TableHead>
                <TableHead className="hidden text-neutral-400 md:table-cell">Interval</TableHead>
                <TableHead className="text-neutral-400">Price</TableHead>
                <TableHead className="hidden text-neutral-400 lg:table-cell">Next Delivery</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-neutral-400">
                    <Package className="mx-auto mb-2 size-8 text-neutral-600" />
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((sub) => (
                  <TableRow
                    key={sub.id}
                    className="border-neutral-800 transition-colors hover:bg-neutral-800/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-neutral-800">
                          <User className="size-3.5 text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {sub.user?.name || 'Unknown'}
                          </p>
                          {sub.user?.email && (
                            <p className="text-xs text-neutral-500">{sub.user.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-white">{sub.productName || '—'}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                        <Clock className="size-3.5" />
                        {intervalLabels[sub.interval] || sub.interval}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-cyan-400">
                      {formatCurrency(sub.price)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                        <Calendar className="size-3.5" />
                        {formatDate(sub.nextDelivery)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          statusColors[sub.status] ||
                          'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        }`}
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {sub.status === 'active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading === sub.id}
                              onClick={() => handlePause(sub.id)}
                              className="text-xs text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                            >
                              {actionLoading === sub.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Ban className="mr-1 size-3.5" />
                              )}
                              Pause
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading === sub.id}
                              onClick={() => {
                                setCancelTarget(sub)
                                setCancelDialogOpen(true)
                              }}
                              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Ban className="mr-1 size-3.5" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {sub.status === 'paused' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoading === sub.id}
                            onClick={() => handleResume(sub.id)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          >
                            {actionLoading === sub.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Play className="mr-1 size-3.5" />
                            )}
                            Resume
                          </Button>
                        )}
                        {sub.status === 'cancelled' && (
                          <span className="text-xs text-neutral-500">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="border-neutral-800 bg-neutral-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to cancel this subscription? This action cannot be undone.
              {cancelTarget && (
                <span className="mt-2 block text-sm text-neutral-300">
                  {cancelTarget.productName} — {formatCurrency(cancelTarget.price)}/{intervalLabels[cancelTarget.interval]}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white">
              Keep Subscription
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
            >
              {actionLoading === cancelTarget?.id ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Yes, Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
