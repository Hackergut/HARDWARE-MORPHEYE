'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ShoppingCart,
  Search,
  Mail,
  Send,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNotificationStore } from '@/store/notification-store'
import type { AbandonedCartEntry } from '@/lib/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function parseItems(items: string): Array<{ name: string; quantity: number; price: number }> {
  try {
    const parsed = JSON.parse(items)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function AdminAbandonedCarts() {
  const [carts, setCarts] = useState<AbandonedCartEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const showNotification = useNotificationStore((s) => s.show)

  const fetchCarts = useCallback(async () => {
    try {
      const res = await fetch('/api/abandoned-cart')
      if (res.ok) {
        const json = await res.json()
        setCarts(json.carts || [])
      }
    } catch (err) {
      console.error('Failed to fetch abandoned carts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCarts()
  }, [fetchCarts])

  const filteredCarts = carts.filter((cart) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      cart.email.toLowerCase().includes(q) ||
      (cart.name && cart.name.toLowerCase().includes(q))
    )
  })

  const handleSendRecovery = async (cart: AbandonedCartEntry) => {
    setSendingEmail(cart.id)
    try {
      const items = parseItems(cart.items)

      const emailRes = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'abandoned_cart',
          recipient: cart.email,
          subject: 'Your cart is waiting – Complete your purchase!',
          body: items
            .map(
              (item) =>
                `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
            )
            .join('\n'),
        }),
      })

      if (emailRes.ok) {
        showNotification('Recovery email sent successfully', 'success')
      } else {
        showNotification('Failed to send recovery email', 'error')
      }
    } catch {
      showNotification('Failed to send recovery email', 'error')
    } finally {
      setSendingEmail(null)
    }
  }

  const handleMarkRecovered = async (id: string) => {
    try {
      const res = await fetch(`/api/abandoned-cart/${id}`, {
        method: 'PUT',
      })

      if (res.ok) {
        setCarts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, recovered: true } : c))
        )
        showNotification('Cart marked as recovered', 'success')
      } else {
        showNotification('Failed to mark cart as recovered', 'error')
      }
    } catch {
      showNotification('Failed to mark cart as recovered', 'error')
    }
  }

  const recoveredCount = carts.filter((c) => c.recovered).length
  const totalValue = carts.reduce((sum, c) => sum + c.subtotal, 0)
  const unrecoveredValue = carts
    .filter((c) => !c.recovered)
    .reduce((sum, c) => sum + c.subtotal, 0)

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-56 bg-neutral-800" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-neutral-800" />
          ))}
        </div>
        <Skeleton className="h-10 w-full bg-neutral-800" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 bg-neutral-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">Abandoned Carts</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Track and recover abandoned shopping carts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Carts</p>
                <p className="mt-1 text-2xl font-bold text-white">{carts.length}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <ShoppingCart className="size-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Recovered</p>
                <p className="mt-1 text-2xl font-bold text-emerald-400">{recoveredCount}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <RefreshCw className="size-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  At Risk Revenue
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-400">
                  ${unrecoveredValue.toFixed(2)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <ShoppingBag className="size-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="border-neutral-700 bg-neutral-800 pl-9 text-white placeholder:text-neutral-500"
          />
        </div>
        <Button
          onClick={fetchCarts}
          variant="outline"
          className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white"
        >
          <RefreshCw className="mr-2 size-4" />
          Refresh
        </Button>
      </div>

      {/* Carts Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Email</TableHead>
                <TableHead className="hidden text-neutral-400 sm:table-cell">Name</TableHead>
                <TableHead className="text-neutral-400">Items</TableHead>
                <TableHead className="text-neutral-400">Subtotal</TableHead>
                <TableHead className="hidden text-neutral-400 lg:table-cell">Date</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-neutral-400">
                    <ShoppingCart className="mx-auto mb-2 size-8 text-neutral-600" />
                    No abandoned carts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCarts.map((cart) => {
                  const items = parseItems(cart.items)
                  return (
                    <TableRow
                      key={cart.id}
                      className="border-neutral-800 transition-colors hover:bg-neutral-800/50"
                    >
                      <TableCell className="text-sm text-neutral-300">
                        {cart.email}
                      </TableCell>
                      <TableCell className="hidden text-sm text-neutral-400 sm:table-cell">
                        {cart.name || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-400">
                        {items.length > 0 ? (
                          <span className="text-xs text-neutral-500">
                            {items.map((i) => i.name).join(', ').slice(0, 40)}
                            {items.map((i) => i.name).join(', ').length > 40 ? '...' : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-500">
                            {cart.items} items
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-cyan-400">
                        ${cart.subtotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden text-sm text-neutral-400 lg:table-cell">
                        {formatDate(cart.createdAt)}
                      </TableCell>
                      <TableCell>
                        {cart.recovered ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400"
                          >
                            Recovered
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-yellow-500/20 bg-yellow-500/10 text-[10px] text-yellow-400"
                          >
                            Open
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!cart.recovered && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendRecovery(cart)}
                                disabled={sendingEmail === cart.id}
                                className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                              >
                                {sendingEmail === cart.id ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <Send className="mr-1 size-3.5" />
                                    Send Email
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkRecovered(cart.id)}
                                className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                              >
                                <RefreshCw className="mr-1 size-3.5" />
                                Recovered
                              </Button>
                            </>
                          )}
                          {cart.recovered && (
                            <span className="text-xs text-neutral-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
