'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

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

  const subtotal = getTotal()
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9.99
  const total = subtotal + shipping

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

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          paymentMethod: 'crypto',
        }),
      })

      if (res.ok) {
        const data = await res.json()
        clearCart()
        showNotification('Order placed successfully!', 'success')
        navigate('checkout-success')
        // Store order number for success page
        if (data.order?.orderNumber) {
          sessionStorage.setItem(
            'lastOrderNumber',
            data.order.orderNumber
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
        <h2 className="mb-2 text-2xl font-bold text-white">
          Your cart is empty
        </h2>
        <p className="mb-8 text-neutral-400">
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

  const inputClass =
    'border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <button
        onClick={() => navigate('cart')}
        className="mb-6 flex items-center gap-1 text-sm text-neutral-400 hover:text-cyan-400"
      >
        <ArrowLeft className="size-4" />
        Back to Cart
      </button>

      <h1 className="mb-8 text-2xl font-bold text-white">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Fields */}
          <div className="space-y-8 lg:col-span-2">
            {/* Customer Info */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Customer Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-neutral-300">Full Name *</Label>
                  <Input
                    value={form.customerName}
                    onChange={(e) =>
                      updateField('customerName', e.target.value)
                    }
                    placeholder="John Doe"
                    className={inputClass}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-500">
                      {errors.customerName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">Email *</Label>
                  <Input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      updateField('customerEmail', e.target.value)
                    }
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-red-500">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-neutral-300">Phone</Label>
                  <Input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) =>
                      updateField('customerPhone', e.target.value)
                    }
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-neutral-300">Street Address *</Label>
                  <Input
                    value={form.shippingAddr}
                    onChange={(e) =>
                      updateField('shippingAddr', e.target.value)
                    }
                    placeholder="123 Main St, Apt 4"
                    className={inputClass}
                  />
                  {errors.shippingAddr && (
                    <p className="text-xs text-red-500">
                      {errors.shippingAddr}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">City *</Label>
                  <Input
                    value={form.shippingCity}
                    onChange={(e) =>
                      updateField('shippingCity', e.target.value)
                    }
                    placeholder="New York"
                    className={inputClass}
                  />
                  {errors.shippingCity && (
                    <p className="text-xs text-red-500">
                      {errors.shippingCity}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">Country *</Label>
                  <Input
                    value={form.shippingCountry}
                    onChange={(e) =>
                      updateField('shippingCountry', e.target.value)
                    }
                    placeholder="United States"
                    className={inputClass}
                  />
                  {errors.shippingCountry && (
                    <p className="text-xs text-red-500">
                      {errors.shippingCountry}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">ZIP Code *</Label>
                  <Input
                    value={form.shippingZip}
                    onChange={(e) =>
                      updateField('shippingZip', e.target.value)
                    }
                    placeholder="10001"
                    className={inputClass}
                  />
                  {errors.shippingZip && (
                    <p className="text-xs text-red-500">
                      {errors.shippingZip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Order Summary
              </h2>

              <div className="max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-neutral-300">
                      {item.name}{' '}
                      <span className="text-neutral-500">×{item.quantity}</span>
                    </span>
                    <span className="text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4 bg-neutral-800" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Shipping</span>
                  <span
                    className={
                      shipping === 0 ? 'text-cyan-400' : 'text-white'
                    }
                  >
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator className="bg-neutral-800" />
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-cyan-400">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full bg-cyan-500 py-5 text-base font-semibold text-black hover:bg-cyan-400 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>

              <p className="mt-3 text-center text-xs text-neutral-500">
                Your payment information is secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
