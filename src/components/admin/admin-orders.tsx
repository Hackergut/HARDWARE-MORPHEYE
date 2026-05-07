'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  ShoppingCart,
  Eye,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Separator } from '@/components/ui/separator'
import { useNotificationStore } from '@/store/notification-store'

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string | null
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddr: string | null
  shippingCity: string | null
  shippingCountry: string | null
  shippingZip: string | null
  status: string
  paymentStatus: string
  paymentMethod: string | null
  subtotal: number
  shipping: number
  tax: number
  total: number
  notes: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  paid: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
}

const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const showNotification = useNotificationStore((s) => s.show)

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.set('limit', '100')
      if (filterStatus && filterStatus !== 'all') {
        params.set('status', filterStatus)
      }
      const res = await fetch(`/api/orders?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setOrders(json.orders || [])
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = orders.filter((order) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q)
    )
  })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const json = await res.json()
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? json.order : o))
        )
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(json.order)
        }
        showNotification('Order status updated', 'success')
      } else {
        showNotification('Failed to update order status', 'error')
      }
    } catch {
      showNotification('Failed to update order status', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const openDetail = (order: Order) => {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-40 bg-neutral-800" />
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
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">Orders</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage and track customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer name..."
            className="border-neutral-700 bg-neutral-800 pl-9 text-white placeholder:text-neutral-500"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full border-neutral-700 bg-neutral-800 text-white sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="border-neutral-700 bg-neutral-900">
            <SelectItem value="all">All Statuses</SelectItem>
            {orderStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                <span className="capitalize">{status}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Order #</TableHead>
                <TableHead className="text-neutral-400">Customer</TableHead>
                <TableHead className="hidden text-neutral-400 md:table-cell">
                  Email
                </TableHead>
                <TableHead className="hidden text-neutral-400 lg:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-neutral-400">Total</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="hidden text-neutral-400 sm:table-cell">
                  Payment
                </TableHead>
                <TableHead className="text-right text-neutral-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-neutral-400"
                  >
                    <ShoppingCart className="mx-auto mb-2 size-8 text-neutral-600" />
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer border-neutral-800 hover:bg-neutral-800/50"
                    onClick={() => openDetail(order)}
                  >
                    <TableCell className="font-mono text-xs text-white">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-300">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="hidden text-sm text-neutral-400 md:table-cell">
                      {order.customerEmail}
                    </TableCell>
                    <TableCell className="hidden text-sm text-neutral-400 lg:table-cell">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-cyan-400">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v)}
                      >
                        <SelectTrigger
                          className="h-7 w-[130px] border-neutral-700 bg-neutral-800 text-xs"
                          disabled={updatingStatus === order.id}
                        >
                          {updatingStatus === order.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                statusColors[order.status] ||
                                'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                              }`}
                            >
                              {order.status}
                            </Badge>
                          )}
                        </SelectTrigger>
                        <SelectContent className="border-neutral-700 bg-neutral-900">
                          {orderStatuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              <span className="capitalize">{s}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          paymentColors[order.paymentStatus] ||
                          'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        }`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetail(order)}
                        className="size-8 text-neutral-400 hover:text-cyan-400"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-neutral-800 bg-neutral-900 text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Order {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status & Payment Row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">Status:</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      statusColors[selectedOrder.status] ||
                      'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                    }`}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">Payment:</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      paymentColors[selectedOrder.paymentStatus] ||
                      'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
                {selectedOrder.paymentMethod && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Method:</span>
                    <span className="text-sm capitalize text-neutral-300">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="bg-neutral-800" />

              {/* Customer Info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                  Customer Information
                </h3>
                <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Mail className="size-3.5" />
                    {selectedOrder.customerEmail}
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Phone className="size-3.5" />
                      {selectedOrder.customerPhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {(selectedOrder.shippingAddr ||
                selectedOrder.shippingCity ||
                selectedOrder.shippingCountry) && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                    Shipping Address
                  </h3>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                    <div className="flex items-start gap-2 text-sm text-neutral-400">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      <div>
                        {selectedOrder.shippingAddr && (
                          <p>{selectedOrder.shippingAddr}</p>
                        )}
                        <p>
                          {[
                            selectedOrder.shippingCity,
                            selectedOrder.shippingZip,
                            selectedOrder.shippingCountry,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/30 p-3"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-800 text-xs text-neutral-500">
                        x{item.quantity}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <span className="text-sm font-medium text-cyan-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-neutral-800" />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-neutral-300">
                    ${selectedOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Shipping</span>
                  <span className="text-neutral-300">
                    {selectedOrder.shipping === 0
                      ? 'Free'
                      : `$${selectedOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Tax</span>
                  <span className="text-neutral-300">
                    ${selectedOrder.tax.toFixed(2)}
                  </span>
                </div>
                <Separator className="bg-neutral-800" />
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-cyan-400">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Calendar className="size-3" />
                <span>Created: {formatDate(selectedOrder.createdAt)}</span>
                <span className="mx-1">·</span>
                <span>Updated: {formatDate(selectedOrder.updatedAt)}</span>
              </div>

              {selectedOrder.notes && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-3">
                  <p className="mb-1 text-xs font-medium text-neutral-400">
                    Notes
                  </p>
                  <p className="text-sm text-neutral-300">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
