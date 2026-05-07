'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  ArrowLeft,
  Tag,
  X,
  Lock,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  Truck,
  Mail,
  Phone,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CreditCard,
  Gift,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface AppliedPromo {
  id: string
  code: string
  description: string | null
  type: string
  value: number
  minPurchase: number | null
  discountAmount: number
}

// Step definitions
const STEPS = [
  { id: 1, label: 'Cart', icon: ShoppingCart },
  { id: 2, label: 'Details', icon: User },
  { id: 3, label: 'Payment', icon: CreditCard },
]

// Validation helper for individual fields
function getFieldStatus(field: string, value: string, errors: Record<string, string>): 'valid' | 'invalid' | 'empty' {
  if (errors[field]) return 'invalid'
  if (!value.trim()) return 'empty'
  // Extra validation checks
  if (field === 'customerEmail' && !/\S+@\S+\.\S+/.test(value)) return 'empty'
  return 'valid'
}

export function CheckoutPage() {
  const { navigate } = useNavigationStore()
  const { items, getTotal, clearCart } = useCartStore()
  const showNotification = useNotificationStore((s) => s.show)

  const [currentStep, setCurrentStep] = useState(2) // Start at Details step
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddr: '',
    shippingCity: '',
    shippingCountry: '',
    shippingZip: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)
  const [stepDirection, setStepDirection] = useState(0)

  // Promo code state
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  // Gift wrap state
  const [giftWrap, setGiftWrap] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const GIFT_WRAP_COST = 4.99

  const subtotal = getTotal()
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9.99
  const giftWrapCost = giftWrap ? GIFT_WRAP_COST : 0
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0
  const total = Math.max(0, subtotal + shipping + giftWrapCost - discountAmount)

  // Auto-collapse mobile summary on step change
  useEffect(() => {
    setMobileSummaryOpen(false)
  }, [currentStep])

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      showNotification('Please enter a promo code', 'error')
      return
    }

    setPromoLoading(true)
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput, cartTotal: subtotal }),
      })

      const data = await res.json()
      if (res.ok && data.valid) {
        setAppliedPromo(data.promo)
        setPromoInput('')
        showNotification(`Promo code ${data.promo.code} applied! You save $${data.promo.discountAmount.toFixed(2)}`, 'success')
      } else {
        showNotification(data.error || 'Invalid promo code', 'error')
      }
    } catch {
      showNotification('Failed to validate promo code', 'error')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    showNotification('Promo code removed', 'info')
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerName.trim()) e.customerName = 'Name is required'
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail))
      e.customerEmail = 'Invalid email address'
    if (!form.shippingAddr.trim()) e.shippingAddr = 'Address is required'
    if (!form.shippingCity.trim()) e.shippingCity = 'City is required'
    if (!form.shippingCountry.trim())
      e.shippingCountry = 'Country is required'
    if (!form.shippingZip.trim()) e.shippingZip = 'ZIP code is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))

      const body: Record<string, unknown> = {
        ...form,
        items: orderItems,
        paymentMethod: 'crypto',
      }

      // Include promo code data if applied
      if (appliedPromo) {
        body.promoCode = appliedPromo.code
        body.discount = discountAmount
      }

      // Include gift wrap data if enabled
      if (giftWrap) {
        body.giftWrap = true
        body.giftMessage = giftMessage.trim()
        body.giftWrapCost = GIFT_WRAP_COST
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        clearCart()
        setAppliedPromo(null)
        showNotification('Order placed successfully!', 'success')
        navigate('checkout-success')
        // Store order number and total for success page
        if (data.order?.orderNumber) {
          sessionStorage.setItem(
            'lastOrderNumber',
            data.order.orderNumber
          )
        }
        if (data.order?.total) {
          sessionStorage.setItem(
            'lastOrderTotal',
            String(data.order.total)
          )
        }
      } else {
        const data = await res.json()
        showNotification(data.error || 'Failed to place order', 'error')
      }
    } catch {
      showNotification('Network error. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
      >
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          Your cart is empty
        </h2>
        <p className="mb-8 text-muted-foreground">
          Add some items before checking out.
        </p>
        <Button
          onClick={() => navigate('shop')}
          className="bg-cyan-500 text-black hover:bg-cyan-400"
        >
          Shop Now
        </Button>
      </motion.div>
    )
  }

  const inputClass = (field: string) => {
    const status = getFieldStatus(field, form[field as keyof typeof form] || '', errors)
    const statusBorder = status === 'valid'
      ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
      : status === 'invalid'
        ? 'border-red-500/50 ring-1 ring-red-500/20'
        : focusedField === field
          ? 'border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20'
          : 'focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30'
    return `border-border bg-card text-foreground placeholder:text-muted-foreground transition-all duration-300 ${statusBorder}`
  }

  // Validation indicator component
  const ValidationIndicator = ({ field }: { field: string }) => {
    const value = form[field as keyof typeof form] || ''
    const status = getFieldStatus(field, value, errors)
    if (status === 'empty') return null
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {status === 'valid' ? (
          <Check className="size-4 text-emerald-500" />
        ) : (
          <AlertCircle className="size-4 text-red-500" />
        )}
      </motion.div>
    )
  }

  // Estimated delivery date
  const getEstimatedDelivery = () => {
    const now = new Date()
    const addBusinessDays = (start: Date, days: number): Date => {
      const date = new Date(start)
      let addedDays = 0
      while (addedDays < days) {
        date.setDate(date.getDate() + 1)
        if (date.getDay() !== 0 && date.getDay() !== 6) addedDays++
      }
      return date
    }
    const start = addBusinessDays(now, 5)
    const end = addBusinessDays(now, 7)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}`
  }

  // Step transition variants
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 60 : -60,
      opacity: 0,
    }),
  }

  const goToStep = (step: number) => {
    setStepDirection(step > currentStep ? 1 : -1)
    setCurrentStep(step)
  }

  // Order summary content (shared between mobile and desktop)
  const OrderSummaryContent = () => (
    <>
      <div className="max-h-72 space-y-3 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg bg-muted/30 p-2"
          >
            {/* Item thumbnail */}
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <span className="text-[8px] text-muted-foreground">No img</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{item.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">×{item.quantity}</span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <div className="flex items-center gap-0.5">
                  <Calendar className="size-2.5 text-muted-foreground" />
                  <span className="text-[9px] text-muted-foreground">{getEstimatedDelivery()}</span>
                </div>
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-4 bg-muted" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span
            className={shipping === 0 ? 'text-cyan-400' : 'text-foreground'}
          >
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Gift Wrap */}
        {giftWrap && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Gift className="size-3" />
              Gift Wrap
            </span>
            <span className="text-cyan-400">+${GIFT_WRAP_COST.toFixed(2)}</span>
          </div>
        )}

        {/* Promo Code Discount */}
        {appliedPromo && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Tag className="size-3" />
              {appliedPromo.code}
              <button
                onClick={handleRemovePromo}
                className="text-neutral-500 hover:text-red-400 transition"
              >
                <X className="size-3" />
              </button>
            </span>
            <span className="text-cyan-400">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <Separator className="bg-muted" />
        <div className="flex justify-between">
          <span className="text-base font-semibold text-foreground">
            Total
          </span>
          <span className="text-lg font-bold text-cyan-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Promo Code Input - Dashed border style */}
      {!appliedPromo && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Have a promo code?
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="border-dashed border-neutral-600 bg-muted pl-9 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30 h-9 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleApplyPromo()
                  }
                }}
              />
            </div>
            <Button
              type="button"
              onClick={handleApplyPromo}
              disabled={promoLoading || !promoInput.trim()}
              variant="outline"
              size="sm"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 disabled:opacity-40"
            >
              {promoLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Applied Promo Code Badge */}
      {appliedPromo && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2.5">
          <Tag className="size-4 text-cyan-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400">{appliedPromo.code}</span>
              <span className="text-[10px] text-muted-foreground">
                {appliedPromo.type === 'percentage'
                  ? `${appliedPromo.value}% off`
                  : `$${appliedPromo.value} off`}
              </span>
            </div>
            {appliedPromo.description && (
              <p className="text-[10px] text-neutral-500 truncate">{appliedPromo.description}</p>
            )}
          </div>
          <button
            onClick={handleRemovePromo}
            className="text-neutral-500 hover:text-red-400 transition shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <button
        onClick={() => navigate('cart')}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Return to Cart
      </button>

      {/* Secure Checkout Badge - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-center gap-3"
      >
        <div className="flex items-center gap-2.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-6 py-2.5 shadow-sm shadow-cyan-500/5">
          <Lock className="size-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 tracking-wide">Secure Checkout</span>
          <div className="h-3 w-px bg-border" />
          <ShieldCheck className="size-4 text-emerald-400" />
          <span className="text-[10px] text-muted-foreground font-medium">256-bit SSL</span>
        </div>
      </motion.div>

      <h1 className="mb-8 text-center text-2xl font-bold text-foreground">Checkout</h1>

      {/* 3-Step Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted ? '#06b6d4' : isCurrent ? '#06b6d4' : 'transparent',
                      borderColor: isCompleted ? '#06b6d4' : isCurrent ? '#06b6d4' : '#404040',
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                      isCurrent ? 'shadow-lg shadow-cyan-500/20' : ''
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-5 text-white" />
                    ) : (
                      <StepIcon className={`size-5 ${isCurrent ? 'text-white' : 'text-neutral-500'}`} />
                    )}
                  </motion.div>
                  <span className={`text-xs font-medium transition-colors ${
                    isCurrent ? 'text-cyan-400' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className="mx-3 mb-5 h-0.5 w-12 sm:w-20 rounded-full overflow-hidden bg-border">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="h-full bg-cyan-500"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Collapsible Order Summary */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-4 text-cyan-400" />
            <span className="text-sm font-semibold text-foreground">Order Summary</span>
            <span className="text-xs text-muted-foreground">({items.length} items)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-cyan-400">${total.toFixed(2)}</span>
            <motion.div
              animate={{ rotate: mobileSummaryOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="size-4 text-muted-foreground" />
            </motion.div>
          </div>
        </button>
        <AnimatePresence>
          {mobileSummaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="rounded-b-xl border border-t-0 border-border bg-card px-4 py-4">
                <OrderSummaryContent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Fields */}
          <div className="space-y-8 lg:col-span-2">
            <AnimatePresence mode="wait" custom={stepDirection}>
              <motion.div
                key={currentStep}
                custom={stepDirection}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {currentStep === 1 && (
                  /* Cart Review Step */
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10">
                        <ShoppingCart className="size-4 text-cyan-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Review Your Cart
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-3"
                        >
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="size-full object-cover" />
                            ) : (
                              <div className="flex size-full items-center justify-center">
                                <span className="text-[10px] text-muted-foreground">No img</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <span className="shrink-0 text-sm font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="bg-cyan-500 text-black hover:bg-cyan-400"
                      >
                        Continue to Details
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  /* Customer & Shipping Details */
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10">
                          <User className="size-4 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Customer Information
                        </h2>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              value={form.customerName}
                              onChange={(e) => updateField('customerName', e.target.value)}
                              onFocus={() => setFocusedField('customerName')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Enter your full name"
                              className={`pl-9 pr-9 ${inputClass('customerName')}`}
                            />
                            <ValidationIndicator field="customerName" />
                          </div>
                          {errors.customerName && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="size-3" />
                              {errors.customerName}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="email"
                              value={form.customerEmail}
                              onChange={(e) => updateField('customerEmail', e.target.value)}
                              onFocus={() => setFocusedField('customerEmail')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="your@email.com"
                              className={`pl-9 pr-9 ${inputClass('customerEmail')}`}
                            />
                            <ValidationIndicator field="customerEmail" />
                          </div>
                          {errors.customerEmail && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="size-3" />
                              {errors.customerEmail}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-muted-foreground">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="tel"
                              value={form.customerPhone}
                              onChange={(e) => updateField('customerPhone', e.target.value)}
                              onFocus={() => setFocusedField('customerPhone')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="+1 (555) 000-0000"
                              className={`pl-9 pr-9 ${inputClass('customerPhone')}`}
                            />
                            <ValidationIndicator field="customerPhone" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10">
                          <MapPin className="size-4 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Shipping Address
                        </h2>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-muted-foreground">Street Address *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              value={form.shippingAddr}
                              onChange={(e) => updateField('shippingAddr', e.target.value)}
                              onFocus={() => setFocusedField('shippingAddr')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="123 Main St, Apt 4"
                              className={`pl-9 pr-9 ${inputClass('shippingAddr')}`}
                            />
                            <ValidationIndicator field="shippingAddr" />
                          </div>
                          {errors.shippingAddr && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-xs text-red-500"
                            >
                              <AlertCircle className="size-3" />
                              {errors.shippingAddr}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">City *</Label>
                          <Input
                            value={form.shippingCity}
                            onChange={(e) => updateField('shippingCity', e.target.value)}
                            onFocus={() => setFocusedField('shippingCity')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="City name"
                            className={`pr-9 ${inputClass('shippingCity')}`}
                          />
                          <div className="relative -mt-7 ml-auto mr-3">
                            <ValidationIndicator field="shippingCity" />
                          </div>
                          {errors.shippingCity && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-xs text-red-500 mt-1"
                            >
                              <AlertCircle className="size-3" />
                              {errors.shippingCity}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Country *</Label>
                          <Input
                            value={form.shippingCountry}
                            onChange={(e) => updateField('shippingCountry', e.target.value)}
                            onFocus={() => setFocusedField('shippingCountry')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Country"
                            className={`pr-9 ${inputClass('shippingCountry')}`}
                          />
                          <div className="relative -mt-7 ml-auto mr-3">
                            <ValidationIndicator field="shippingCountry" />
                          </div>
                          {errors.shippingCountry && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-xs text-red-500 mt-1"
                            >
                              <AlertCircle className="size-3" />
                              {errors.shippingCountry}
                            </motion.p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">ZIP Code *</Label>
                          <Input
                            value={form.shippingZip}
                            onChange={(e) => updateField('shippingZip', e.target.value)}
                            onFocus={() => setFocusedField('shippingZip')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Postal code"
                            className={`pr-9 ${inputClass('shippingZip')}`}
                          />
                          <div className="relative -mt-7 ml-auto mr-3">
                            <ValidationIndicator field="shippingZip" />
                          </div>
                          {errors.shippingZip && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-xs text-red-500 mt-1"
                            >
                              <AlertCircle className="size-3" />
                              {errors.shippingZip}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Estimated delivery info */}
                    <div className="flex items-center gap-3 rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-4 py-3">
                      <Truck className="size-5 text-cyan-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          {getEstimatedDelivery()} — Free shipping on orders over $150
                        </p>
                      </div>
                    </div>

                    {/* Gift Wrap & Message */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10">
                          <Gift className="size-4 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Gift Wrap & Message
                        </h2>
                        <span className="ml-auto text-xs text-muted-foreground">Optional</span>
                      </div>

                      {/* Toggle */}
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Gift className="size-5 text-cyan-400" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Add gift wrapping</p>
                            <p className="text-xs text-muted-foreground">Premium gift wrap with custom message — +${GIFT_WRAP_COST.toFixed(2)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setGiftWrap(!giftWrap)
                            if (giftWrap) setGiftMessage('')
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                            giftWrap ? 'bg-cyan-500' : 'bg-neutral-700'
                          }`}
                          role="switch"
                          aria-checked={giftWrap}
                          aria-label="Toggle gift wrapping"
                        >
                          <span
                            className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              giftWrap ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Gift message input */}
                      <AnimatePresence>
                        {giftWrap && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 space-y-3">
                              <div className="space-y-2">
                                <Label className="text-muted-foreground">Gift Message</Label>
                                <textarea
                                  value={giftMessage}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 200) {
                                      setGiftMessage(e.target.value)
                                    }
                                  }}
                                  placeholder="Write a personal message for the recipient..."
                                  rows={3}
                                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 resize-none transition-colors"
                                />
                                <p className="text-right text-[10px] text-muted-foreground">
                                  {giftMessage.length}/200
                                </p>
                              </div>

                              {/* Gift message preview */}
                              {giftMessage.trim() && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 p-4"
                                >
                                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Preview</p>
                                  <div className="relative rounded-lg border border-border bg-card p-3">
                                    <Gift className="absolute -top-2 -right-1 size-5 text-cyan-400/30" />
                                    <p className="text-sm italic text-foreground leading-relaxed">
                                      &ldquo;{giftMessage}&rdquo;
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => goToStep(1)}
                        className="border-border text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="mr-1 size-4" />
                        Back to Cart
                      </Button>
                      <Button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="bg-cyan-500 text-black hover:bg-cyan-400"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  /* Payment Step */
                  <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10">
                          <CreditCard className="size-4 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Payment Method
                        </h2>
                      </div>

                      {/* Crypto payment info */}
                      <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                            <Lock className="size-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Cryptocurrency Payment</p>
                            <p className="text-xs text-muted-foreground">
                              Pay securely with Bitcoin, Ethereum, or other supported cryptocurrencies
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <span className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground">₿ BTC</span>
                          <span className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground">Ξ ETH</span>
                          <span className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground">◎ USDT</span>
                        </div>
                      </div>

                      {/* Order summary for payment step */}
                      <div className="mt-4 rounded-lg border border-border bg-muted/20 p-4">
                        <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order Summary</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Items ({items.length})</span>
                            <span className="text-foreground">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className={shipping === 0 ? 'text-cyan-400' : 'text-foreground'}>
                              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                            </span>
                          </div>
                          {giftWrap && (
                            <div className="flex justify-between text-sm">
                              <span className="flex items-center gap-1.5 text-cyan-400">
                                <Gift className="size-3" />
                                Gift Wrap
                              </span>
                              <span className="text-cyan-400">+${GIFT_WRAP_COST.toFixed(2)}</span>
                            </div>
                          )}
                          {appliedPromo && (
                            <div className="flex justify-between text-sm">
                              <span className="text-cyan-400">Discount ({appliedPromo.code})</span>
                              <span className="text-cyan-400">-${discountAmount.toFixed(2)}</span>
                            </div>
                          )}
                          <Separator className="bg-border my-1" />
                          <div className="flex justify-between">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="text-lg font-bold text-cyan-400">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping details review */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-cyan-400" />
                          <h3 className="text-sm font-semibold text-foreground">Shipping To</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => goToStep(2)}
                          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {form.customerName && <span className="text-foreground font-medium">{form.customerName}</span>}
                        {form.shippingAddr && <><br />{form.shippingAddr}</>}
                        {form.shippingCity && <>, {form.shippingCity}</>}
                        {form.shippingCountry && <>, {form.shippingCountry}</>}
                        {form.shippingZip && <> {form.shippingZip}</>}
                      </p>
                    </div>

                    {/* Trust badges before submit */}
                    <div className="flex items-center justify-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Lock className="size-3.5 text-cyan-400" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="size-3.5 text-emerald-400" />
                        <span>Money-Back</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Truck className="size-3.5 text-cyan-400" />
                        <span>Insured</span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => goToStep(2)}
                        className="border-border text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="mr-1 size-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-cyan-500 py-5 text-base font-semibold text-black hover:bg-cyan-400 disabled:opacity-60 sm:flex-none sm:px-12"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 size-4" />
                            Place Order — ${total.toFixed(2)}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar - Desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Order Summary
              </h2>

              <OrderSummaryContent />

              <Button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full bg-cyan-500 py-5 text-base font-semibold text-black hover:bg-cyan-400 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 size-4" />
                    Place Order
                  </>
                )}
              </Button>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Lock className="size-3 text-cyan-400" />
                  SSL Encrypted
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ShieldCheck className="size-3 text-emerald-400" />
                  Money-Back
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Truck className="size-3 text-cyan-400" />
                  Insured
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Your payment information is secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
