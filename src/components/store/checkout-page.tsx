'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Tag, X, Lock, ShieldCheck, User, MapPin, Calendar, Truck } from 'lucide-react'
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

export function CheckoutPage() {
  const { navigate } = useNavigationStore()
  const { items, getTotal, clearCart } = useCartStore()
  const showNotification = useNotificationStore((s) => s.show)

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

  // Promo code state
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  const subtotal = getTotal()
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9.99
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0
  const total = Math.max(0, subtotal + shipping - discountAmount)

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

  const inputClass = (field: string) =>
    `border-border bg-card text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
      focusedField === field
        ? 'border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20'
        : 'focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30'
    }`

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <button
        onClick={() => navigate('cart')}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400"
      >
        <ArrowLeft className="size-4" />
        Return to Cart
      </button>

      {/* Secure Checkout Badge */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-2">
          <Lock className="size-4 text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400">Secure Checkout</span>
          <ShieldCheck className="size-4 text-emerald-400" />
        </div>
      </div>

      <h1 className="mb-8 text-center text-2xl font-bold text-foreground">Checkout</h1>

      {/* Returning Customer Prompt */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card/50 px-5 py-3"
      >
        <div className="flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Returning customer?</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          onClick={() => showNotification('Login feature coming soon!', 'info')}
        >
          Sign In for Faster Checkout
        </Button>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Fields */}
          <div className="space-y-8 lg:col-span-2">
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
                  <Input
                    value={form.customerName}
                    onChange={(e) => updateField('customerName', e.target.value)}
                    onFocus={() => setFocusedField('customerName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your full name"
                    className={inputClass('customerName')}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-500">{errors.customerName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Email *</Label>
                  <Input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => updateField('customerEmail', e.target.value)}
                    onFocus={() => setFocusedField('customerEmail')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    className={inputClass('customerEmail')}
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-red-500">{errors.customerEmail}</p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-muted-foreground">Phone</Label>
                  <Input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => updateField('customerPhone', e.target.value)}
                    onFocus={() => setFocusedField('customerPhone')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass('customerPhone')}
                  />
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
                  <Input
                    value={form.shippingAddr}
                    onChange={(e) => updateField('shippingAddr', e.target.value)}
                    onFocus={() => setFocusedField('shippingAddr')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="123 Main St, Apt 4"
                    className={inputClass('shippingAddr')}
                  />
                  {errors.shippingAddr && (
                    <p className="text-xs text-red-500">{errors.shippingAddr}</p>
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
                    className={inputClass('shippingCity')}
                  />
                  {errors.shippingCity && (
                    <p className="text-xs text-red-500">{errors.shippingCity}</p>
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
                    className={inputClass('shippingCountry')}
                  />
                  {errors.shippingCountry && (
                    <p className="text-xs text-red-500">{errors.shippingCountry}</p>
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
                    className={inputClass('shippingZip')}
                  />
                  {errors.shippingZip && (
                    <p className="text-xs text-red-500">{errors.shippingZip}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Order Summary
              </h2>

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
