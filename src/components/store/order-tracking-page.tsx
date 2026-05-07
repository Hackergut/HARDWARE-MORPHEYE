'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  Loader2,
  CalendarDays,
  CreditCard,
  Box,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface OrderItem {
  id: string
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
  createdAt: string
  items: OrderItem[]
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock, description: 'Your order has been received' },
  { key: 'processing', label: 'Processing', icon: Package, description: 'We are preparing your order' },
  { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on its way' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, description: 'Your order has arrived' },
]

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

function getStepIndex(status: string): number {
  const normalizedStatus = status.toLowerCase()
  const index = statusOrder.indexOf(normalizedStatus)
  return index >= 0 ? index : 0
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getEstimatedDelivery(createdAt: string, status: string): string {
  const date = new Date(createdAt)
  let daysToAdd = 7
  if (status === 'shipped') daysToAdd = 3
  if (status === 'processing') daysToAdd = 5
  let daysAdded = 0
  while (daysAdded < daysToAdd) {
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

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'processing': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    case 'shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20'
    default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
  }
}

export function OrderTrackingPage() {
  const { navigate } = useNavigationStore()
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleTrack = useCallback(async () => {
    const trimmed = orderNumber.trim().toUpperCase()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setOrder(null)
    setSearched(true)

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(trimmed)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to track order')
        return
      }

      setOrder(data.order)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [orderNumber])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTrack()
  }, [handleTrack])

  const currentStepIndex = order ? getStepIndex(order.status) : 0
  const isCancelled = order?.status.toLowerCase() === 'cancelled'

  return (
    <div className="min-h-[80vh] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('home')}
          className="mb-6 flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 shadow-lg shadow-cyan-500/10">
            <Search className="size-7 text-cyan-400" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Track Your Order
          </h1>
          <p className="text-neutral-400">
            Enter your order number to check the status
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-neutral-800 bg-[#111111] p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="MRP-20250101-ABCD"
                  className="h-12 border-neutral-700 bg-neutral-900 font-mono text-white placeholder:text-neutral-600 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleTrack}
                disabled={loading || !orderNumber.trim()}
                className="h-12 bg-cyan-500 px-8 text-black font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-500/30 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 size-4" />
                    Track Order
                  </>
                )}
              </Button>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Order number format: MRP-XXXXXXXX-XXXX (found in your confirmation email)
            </p>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Error / Not Found State */}
          {searched && error && !order && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-neutral-800 bg-[#111111] p-8 text-center">
                <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                  <AlertCircle className="size-8 text-red-400" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">
                  Order Not Found
                </h2>
                <p className="mb-6 text-neutral-400">
                  We couldn&apos;t find an order with that number. Please double-check your order number and try again.
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    onClick={() => {
                      setSearched(false)
                      setError(null)
                      setOrderNumber('')
                    }}
                    variant="outline"
                    className="border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate('shop')}
                    className="bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    <ShoppingBag className="mr-2 size-4" />
                    Browse Shop
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Order Found */}
          {order && (
            <motion.div
              key="order"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Order Header */}
              <Card className="border-neutral-800 bg-[#111111] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Order Number
                    </p>
                    <p className="mt-1 font-mono text-xl font-bold text-cyan-400">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(order.status)} border text-xs font-medium`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={`border text-xs font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'border-emerald-500/20 text-emerald-400'
                        : 'border-amber-500/20 text-amber-400'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4 bg-neutral-800" />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-neutral-500">Order Date</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white">
                      <CalendarDays className="size-3.5 text-neutral-500" />
                      {formatShortDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white">
                      <CreditCard className="size-3.5 text-neutral-500" />
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Est. Delivery</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {isCancelled ? 'N/A' : getEstimatedDelivery(order.createdAt, order.status)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Timeline / Stepper */}
              {!isCancelled && (
                <Card className="border-neutral-800 bg-[#111111] p-6">
                  <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                    Order Progress
                  </h3>
                  <div className="relative">
                    {/* Vertical line connecting steps */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-neutral-800 sm:left-1/2 sm:-translate-x-px" />

                    <div className="space-y-0">
                      {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex
                        const StepIcon = step.icon

                        return (
                          <div key={step.key} className="relative">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                              className="flex items-start gap-4 pb-8 last:pb-0 sm:items-center"
                            >
                              {/* Step circle */}
                              <div className="relative z-10 flex-shrink-0">
                                <motion.div
                                  initial={false}
                                  animate={{
                                    scale: isCurrent ? 1 : 0.85,
                                  }}
                                  className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                    isCurrent
                                      ? 'border-cyan-500 bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                      : isCompleted
                                        ? 'border-cyan-600/60 bg-cyan-600/20'
                                        : 'border-neutral-700 bg-neutral-900'
                                  }`}
                                >
                                  <StepIcon
                                    className={`size-4 transition-colors duration-500 ${
                                      isCurrent
                                        ? 'text-cyan-400'
                                        : isCompleted
                                          ? 'text-cyan-500/70'
                                          : 'text-neutral-600'
                                    }`}
                                  />
                                </motion.div>
                              </div>

                              {/* Step content */}
                              <div className="flex-1 pt-1.5 sm:pt-0">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`text-sm font-semibold transition-colors duration-500 ${
                                      isCurrent
                                        ? 'text-cyan-400'
                                        : isCompleted
                                          ? 'text-white'
                                          : 'text-neutral-600'
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                  {isCurrent && (
                                    <motion.span
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400"
                                    >
                                      <span className="size-1.5 animate-pulse rounded-full bg-cyan-400" />
                                      Current
                                    </motion.span>
                                  )}
                                </div>
                                <p
                                  className={`mt-0.5 text-xs transition-colors duration-500 ${
                                    isCurrent || isCompleted
                                      ? 'text-neutral-400'
                                      : 'text-neutral-700'
                                  }`}
                                >
                                  {isCompleted && index === 0
                                    ? formatDate(order.createdAt)
                                    : step.description}
                                </p>
                              </div>

                              {/* Date on the right (desktop) */}
                              {isCompleted && (
                                <div className="hidden flex-shrink-0 sm:block">
                                  <p className="text-xs text-neutral-500">
                                    {index === 0 ? formatShortDate(order.createdAt) : 'Completed'}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Card>
              )}

              {/* Cancelled State */}
              {isCancelled && (
                <Card className="border-red-500/20 bg-[#111111] p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                      <AlertCircle className="size-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-400">Order Cancelled</h3>
                      <p className="text-sm text-neutral-400">
                        This order has been cancelled. If you believe this is an error, please contact support.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Order Items */}
              <Card className="border-neutral-800 bg-[#111111] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  <Box className="size-4" />
                  Order Items ({order.items.length})
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Item image or placeholder */}
                        <div className="flex size-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <Package className="size-6 text-neutral-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-semibold text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="mt-4 bg-neutral-800/50" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-4 bg-neutral-800" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Subtotal</span>
                    <span className="text-neutral-300">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Shipping</span>
                    <span className="text-neutral-300">
                      {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Tax</span>
                      <span className="text-neutral-300">${order.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="bg-neutral-800" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-cyan-400">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="border-neutral-800 bg-[#111111] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  <MapPin className="size-4" />
                  Shipping Address
                </h3>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                  <p className="text-sm font-medium text-white">{order.customerName}</p>
                  {order.shippingAddr && (
                    <p className="mt-1 text-sm text-neutral-400">{order.shippingAddr}</p>
                  )}
                  <p className="mt-1 text-sm text-neutral-400">
                    {[order.shippingCity, order.shippingCountry, order.shippingZip]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {order.customerPhone && (
                    <p className="mt-2 text-xs text-neutral-500">
                      Phone: {order.customerPhone}
                    </p>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate('shop')}
                  className="bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-500/30"
                >
                  <ShoppingBag className="mr-2 size-4" />
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => {
                    setOrder(null)
                    setSearched(false)
                    setError(null)
                    setOrderNumber('')
                  }}
                  variant="outline"
                  className="border-neutral-700 text-white hover:bg-neutral-800"
                >
                  <Search className="mr-2 size-4" />
                  Track Another Order
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
