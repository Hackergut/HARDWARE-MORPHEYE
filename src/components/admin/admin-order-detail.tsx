'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  Package,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Printer,
  Check,
  Truck,
  Clock,
  Loader2,
  CreditCard,
  Tag,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNavigationStore } from '@/store/navigation-store'
import { useNotificationStore } from '@/store/notification-store'
import { motion } from 'framer-motion'

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string | null
  sku?: string | null
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
  discount: number
  promoCode: string | null
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
const paymentStatuses = ['pending', 'paid', 'refunded']

const statusStepMap: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
}

const steps = [
  { label: 'Order Placed', icon: Clock },
  { label: 'Processing', icon: Package },
  { label: 'Shipped', icon: Truck },
  { label: 'Delivered', icon: Check },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function AdminOrderDetail() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingPayment, setUpdatingPayment] = useState(false)
  const selectedOrderId = useNavigationStore((s) => s.selectedOrderId)
  const navigate = useNavigationStore((s) => s.navigate)
  const showNotification = useNotificationStore((s) => s.show)

  const fetchOrder = useCallback(async () => {
    if (!selectedOrderId) return
    try {
      const res = await fetch(`/api/orders/${selectedOrderId}`)
      if (res.ok) {
        const json = await res.json()
        setOrder(json.order)
      }
    } catch (err) {
      console.error('Failed to fetch order:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedOrderId])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const json = await res.json()
        setOrder(json.order)
        showNotification('Order status updated', 'success')
      } else {
        showNotification('Failed to update order status', 'error')
      }
    } catch {
      showNotification('Failed to update order status', 'error')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handlePaymentStatusChange = async (newStatus: string) => {
    if (!order) return
    setUpdatingPayment(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus }),
      })
      if (res.ok) {
        const json = await res.json()
        setOrder(json.order)
        showNotification('Payment status updated', 'success')
      } else {
        showNotification('Failed to update payment status', 'error')
      }
    } catch {
      showNotification('Failed to update payment status', 'error')
    } finally {
      setUpdatingPayment(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 bg-neutral-800" />
          <Skeleton className="h-6 w-40 bg-neutral-800" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 bg-neutral-800 rounded-xl" />
            <Skeleton className="h-60 bg-neutral-800 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 bg-neutral-800 rounded-xl" />
            <Skeleton className="h-40 bg-neutral-800 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Package className="mb-3 size-12 text-neutral-600" />
        <p className="text-lg font-medium text-white">Order not found</p>
        <p className="mt-1 text-sm text-neutral-400">The order you are looking for does not exist.</p>
        <Button
          onClick={() => navigate('admin-orders')}
          className="mt-4 bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  const currentStep = statusStepMap[order.status] ?? 0
  const isCancelled = order.status === 'cancelled'

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 md:p-6 print:p-0 print:space-y-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:flex-row print:items-center print:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('admin-orders')}
            className="size-9 text-neutral-400 hover:text-white print:hidden"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white md:text-2xl">
                Order {order.orderNumber}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs ${
                  statusColors[order.status] ||
                  'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-neutral-400">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          >
            <Printer className="mr-2 size-4" />
            Print
          </Button>
        </div>
      </motion.div>

      {/* Order Timeline / Stepper */}
      <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 print:border print:border-neutral-300">
        <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
          Order Timeline
        </h3>
        {isCancelled ? (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10">
              <span className="text-lg">✕</span>
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">Order Cancelled</p>
              <p className="text-xs text-neutral-400">This order has been cancelled</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = index <= currentStep
              const isCurrent = index === currentStep
              const isLast = index === steps.length - 1

              return (
                <div key={step.label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'bg-cyan-500/20 ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20'
                          : isCompleted
                          ? 'bg-cyan-500 text-black'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {isCompleted && !isCurrent ? (
                        <Check className="size-4" />
                      ) : (
                        <StepIcon className={`size-4 ${isCurrent ? 'text-cyan-400' : ''}`} />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCurrent
                          ? 'text-cyan-400'
                          : isCompleted
                          ? 'text-white'
                          : 'text-neutral-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="mt-0.5 text-[10px] text-neutral-500">
                        {formatShortDate(order.updatedAt)}
                      </span>
                    )}
                    {isCompleted && !isCurrent && index < currentStep && (
                      <span className="mt-0.5 text-[10px] text-neutral-500">
                        Completed
                      </span>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full transition-all duration-300 ${
                        index < currentStep ? 'bg-cyan-500' : 'bg-neutral-800'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3 print:grid-cols-1">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Info */}
          <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="size-4 text-cyan-400" />
              Customer Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">Name</p>
                <p className="text-sm font-medium text-white">{order.customerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">Email</p>
                <div className="flex items-center gap-1.5 text-sm text-neutral-300">
                  <Mail className="size-3.5 text-neutral-500" />
                  {order.customerEmail}
                </div>
              </div>
              {order.customerPhone && (
                <div className="space-y-1">
                  <p className="text-xs text-neutral-500">Phone</p>
                  <div className="flex items-center gap-1.5 text-sm text-neutral-300">
                    <Phone className="size-3.5 text-neutral-500" />
                    {order.customerPhone}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Shipping Address */}
          {(order.shippingAddr || order.shippingCity || order.shippingCountry) && (
            <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="size-4 text-cyan-400" />
                Shipping Address
              </h3>
              <div className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                <p className="text-sm text-white">{order.customerName}</p>
                {order.shippingAddr && (
                  <p className="text-sm text-neutral-400">{order.shippingAddr}</p>
                )}
                <p className="text-sm text-neutral-400">
                  {[order.shippingCity, order.shippingZip, order.shippingCountry]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </motion.div>
          )}

          {/* Order Items */}
          <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="size-4 text-cyan-400" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-800/30 p-3 transition-colors hover:bg-neutral-800/50"
                >
                  {/* Product thumbnail */}
                  <div className="relative size-14 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="size-5 text-neutral-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {item.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500">
                      {item.sku && <span>SKU: {item.sku}</span>}
                      <span>${item.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-cyan-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Notes */}
          {order.notes && (
            <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                Notes
              </h3>
              <div className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                <p className="text-sm text-neutral-300">{order.notes}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              Order Summary
            </h3>
            <div className="space-y-3">
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
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Tax</span>
                <span className="text-neutral-300">${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Tag className="size-3" />
                    Discount
                  </span>
                  <span className="text-emerald-400">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.promoCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Promo Code</span>
                  <Badge variant="outline" className="border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-[10px]">
                    {order.promoCode}
                  </Badge>
                </div>
              )}
              <Separator className="bg-neutral-800" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-white">Total</span>
                <span className="text-cyan-400">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="size-4 text-cyan-400" />
              Payment
            </h3>
            <div className="space-y-3">
              {order.paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Method</span>
                  <span className="capitalize text-neutral-300">{order.paymentMethod}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Status</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    paymentColors[order.paymentStatus] ||
                    'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="space-y-3 print:hidden">
            {/* Update Order Status */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                Update Status
              </h3>
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={updatingStatus}
              >
                <SelectTrigger className="w-full border-neutral-700 bg-neutral-800 text-white">
                  {updatingStatus ? (
                    <Loader2 className="size-4 animate-spin text-neutral-400" />
                  ) : (
                    <SelectValue />
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
            </div>

            {/* Update Payment Status */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">
                Payment Status
              </h3>
              <Select
                value={order.paymentStatus}
                onValueChange={handlePaymentStatusChange}
                disabled={updatingPayment}
              >
                <SelectTrigger className="w-full border-neutral-700 bg-neutral-800 text-white">
                  {updatingPayment ? (
                    <Loader2 className="size-4 animate-spin text-neutral-400" />
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent className="border-neutral-700 bg-neutral-900">
                  {paymentStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="capitalize">{s}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Back Button */}
            <Button
              onClick={() => navigate('admin-orders')}
              className="w-full border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              variant="outline"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Orders
            </Button>
          </motion.div>

          {/* Dates */}
          <motion.div variants={itemVariants} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="size-4 text-cyan-400" />
              Dates
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Created</span>
                <span className="text-neutral-300">{formatShortDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Last Updated</span>
                <span className="text-neutral-300">{formatShortDate(order.updatedAt)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:space-y-4 > * + * { margin-top: 1rem !important; }
          .print\\:border-neutral-300 { border-color: #d4d4d4 !important; }
          [class*="bg-neutral-900"],
          [class*="bg-neutral-800"] { background: white !important; }
          [class*="text-white"] { color: black !important; }
          [class*="text-neutral-400"] { color: #525252 !important; }
          [class*="text-cyan-400"] { color: #0891b2 !important; }
          [class*="border-neutral-800"] { border-color: #d4d4d4 !important; }
        }
      `}</style>
    </motion.div>
  )
}
