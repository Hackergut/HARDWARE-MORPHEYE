'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Lock, Truck } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const FREE_SHIPPING_THRESHOLD = 150

export function CartPage() {
  const { navigate } = useNavigationStore()
  const { items, removeItem, updateQuantity, clearCart, getTotal } =
    useCartStore()
  const showNotification = useNotificationStore((s) => s.show)

  const subtotal = getTotal()
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 9.99
  const total = subtotal + shipping
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  const handleClearCart = () => {
    clearCart()
    showNotification('Cart cleared', 'info')
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
      >
        <div className="mb-6 rounded-full bg-neutral-800 p-6">
          <ShoppingBag className="size-12 text-neutral-500" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Your cart is empty
        </h2>
        <p className="mb-8 text-neutral-400">
          Start shopping to add items to your cart.
        </p>
        <Button
          onClick={() => navigate('shop')}
          className="bg-cyan-500 px-8 text-black hover:bg-cyan-400"
        >
          Shop Now
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('shop')}
        className="mb-6 flex items-center gap-1 text-sm text-neutral-400 hover:text-cyan-400"
      >
        <ArrowLeft className="size-4" />
        Continue Shopping
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCart}
          className="text-neutral-400 hover:text-red-500"
        >
          <Trash2 className="mr-1 size-4" />
          Clear Cart
        </Button>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-cyan-400" />
            <span className="text-sm text-neutral-300">
              {remainingForFreeShipping > 0
                ? `Add $${remainingForFreeShipping.toFixed(2)} more for free shipping`
                : 'You qualify for free shipping!'}
            </span>
          </div>
          <span className="text-xs text-neutral-500">$150 minimum</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              shippingProgress >= 100
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                : 'bg-gradient-to-r from-cyan-500/60 to-cyan-500'
            }`}
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-neutral-800 border-l-2 border-l-cyan-500 bg-neutral-900 p-4 transition-all duration-200 hover:border-neutral-700 hover:border-l-cyan-400"
            >
              {/* Item Image */}
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <ShoppingBag className="size-6 text-neutral-600" />
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="size-8 text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0 rounded-md border border-neutral-700">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="flex size-7 items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="flex w-8 items-center justify-center text-xs font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="flex size-7 items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Order Summary
            </h2>

            <div className="space-y-3">
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
              {shipping > 0 && (
                <p className="text-xs text-neutral-500">
                  Free shipping on orders over $150
                </p>
              )}

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
              onClick={() => navigate('checkout')}
              className="mt-6 w-full bg-cyan-500 py-5 text-base font-semibold text-black hover:bg-cyan-400 pulse-glow"
            >
              Proceed to Checkout
            </Button>

            {/* Order Protection Badge */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2.5">
              <Lock className="size-4 text-cyan-400 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-semibold text-white">Order Protection</p>
                <p className="text-[9px] text-neutral-500">256-bit SSL encrypted checkout</p>
              </div>
              <ShieldCheck className="ml-auto size-4 text-emerald-400 shrink-0" />
            </div>

            <button
              onClick={() => navigate('shop')}
              className="mt-3 w-full text-center text-sm text-neutral-400 hover:text-cyan-400"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
