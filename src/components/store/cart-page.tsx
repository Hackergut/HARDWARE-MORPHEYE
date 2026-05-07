'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Lock, Truck, Tag, X, Loader2, Clock, AlertTriangle, Heart, ShoppingCart, Package, Sparkles } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const FREE_SHIPPING_THRESHOLD = 150

interface AppliedPromo {
  id: string
  code: string
  description: string | null
  type: string
  value: number
  minPurchase: number | null
  discountAmount: number
}

interface SuggestedProduct {
  id: string
  name: string
  price: number
  images: string[]
  slug: string
  brand?: string | null
}

export function CartPage() {
  const { navigate } = useNavigationStore()
  const { items, removeItem, updateQuantity, clearCart, getTotal } =
    useCartStore()
  const { items: wishlistItems, toggleItem: toggleWishlistItem, isInWishlist } = useWishlistStore()
  const showNotification = useNotificationStore((s) => s.show)

  // Promo code state
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  // Cart timer state
  const [cartTimer, setCartTimer] = useState(30 * 60) // 30 minutes in seconds

  // Remove confirmation dialog
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)

  // Suggested products
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([])

  // Reset cart timer on page visit
  useEffect(() => {
    const stored = localStorage.getItem('morpheye_cart_timer')
    if (stored) {
      const elapsed = Math.floor((Date.now() - parseInt(stored)) / 1000)
      const remaining = Math.max(0, 30 * 60 - elapsed)
      setCartTimer(remaining)
    } else {
      localStorage.setItem('morpheye_cart_timer', Date.now().toString())
      setCartTimer(30 * 60)
    }
  }, [])

  useEffect(() => {
    if (cartTimer <= 0) return
    const interval = setInterval(() => {
      setCartTimer((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [cartTimer])

  // Fetch suggested products
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await fetch('/api/products?featured=true&limit=4')
        if (res.ok) {
          const data = await res.json()
          setSuggestedProducts(
            (data.products || [])
              .filter((p: SuggestedProduct) => !items.find((i) => i.id === p.id))
              .slice(0, 4)
          )
        }
      } catch {
        // ignore
      }
    }
    fetchSuggested()
  }, [items])

  const timerMinutes = Math.floor(cartTimer / 60)
  const timerSeconds = cartTimer % 60

  const hasHighDemandItems = items.length > 0

  const subtotal = getTotal()
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 9.99
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0
  const total = Math.max(0, subtotal + shipping - discountAmount)
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

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

  const handleClearCart = () => {
    clearCart()
    setAppliedPromo(null)
    showNotification('Cart cleared', 'info')
  }

  const revalidatePromo = async () => {
    if (!appliedPromo) return
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: appliedPromo.code, cartTotal: subtotal }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setAppliedPromo(data.promo)
      } else {
        setAppliedPromo(null)
        showNotification(data.error || 'Promo code no longer valid', 'error')
      }
    } catch {
      // keep promo as is
    }
  }

  const handleQuantityChange = (id: string, qty: number) => {
    updateQuantity(id, qty)
    if (appliedPromo) {
      setTimeout(() => revalidatePromo(), 100)
    }
  }

  const handleRemoveClick = (id: string) => {
    setItemToRemove(id)
    setRemoveDialogOpen(true)
  }

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove)
      if (appliedPromo) setTimeout(() => revalidatePromo(), 100)
    }
    setRemoveDialogOpen(false)
    setItemToRemove(null)
  }

  const handleAddSuggestedToCart = (product: SuggestedProduct) => {
    const cartStore = useCartStore.getState()
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.slug,
    })
    showNotification(`${product.name} added to cart`, 'success')
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
      >
        {/* Better empty cart state */}
        <div className="relative mb-8">
          <div className="flex size-28 items-center justify-center rounded-full bg-muted/80">
            <ShoppingBag className="size-14 text-muted-foreground" />
          </div>
          <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-cyan-500/10">
            <Sparkles className="size-4 text-cyan-400" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          Your cart is empty
        </h2>
        <p className="mb-8 max-w-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Explore our premium collection of hardware wallets and security devices.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('shop')}
            className="bg-cyan-500 px-8 text-black hover:bg-cyan-400"
          >
            <ShoppingCart className="mr-2 size-4" />
            Shop Now
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('wishlist')}
            className="border-border text-muted-foreground hover:text-foreground hover:border-border"
          >
            <Heart className="mr-2 size-4" />
            View Wishlist
          </Button>
        </div>
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
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400"
      >
        <ArrowLeft className="size-4" />
        Continue Shopping
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCart}
          className="text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="mr-1 size-4" />
          Clear Cart
        </Button>
      </div>

      {/* Cart Abandonment Reminder */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-2.5">
          <Clock className="size-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium text-amber-300">
            Your cart is reserved for 30 minutes
          </span>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="ml-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20"
          >
            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
          </motion.span>
        </div>
        {hasHighDemandItems && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/15 bg-red-500/5 px-4 py-2.5">
            <AlertTriangle className="size-4 text-red-400 shrink-0" />
            <span className="text-xs font-medium text-red-300">
              Items in your cart are in high demand
            </span>
          </div>
        )}
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground">
              {remainingForFreeShipping > 0
                ? `Add $${remainingForFreeShipping.toFixed(2)} more for free shipping`
                : 'You qualify for free shipping!'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">$150 minimum</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
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

      <div className="mt-6 grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-4 rounded-xl border border-border border-l-2 border-l-cyan-500 bg-card p-3 sm:p-4 transition-all duration-200 hover:border-border hover:border-l-cyan-400"
            >
              {/* Item Image */}
              <div
                className="relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-muted"
                onClick={() => navigate('product', { productId: item.id })}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <ShoppingBag className="size-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="cursor-pointer text-sm font-semibold text-foreground transition-colors hover:text-cyan-400"
                      onClick={() => navigate('product', { productId: item.id })}
                    >
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveClick(item.id)}
                    className="size-8 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Premium Quantity Selector matching product detail */}
                  <div className="flex items-center overflow-hidden rounded-xl border border-border bg-card">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="flex w-8 items-center justify-center text-xs font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="mb-4 text-base sm:text-lg font-semibold text-foreground">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span
                  className={
                    shipping === 0 ? 'text-cyan-400' : 'text-foreground'
                  }
                >
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over $150
                </p>
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

            {/* Promo Code Input */}
            {!appliedPromo && (
              <div className="mt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="border-border bg-muted pl-9 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyPromo()
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    variant="outline"
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
              onClick={() => navigate('checkout')}
              className="mt-4 w-full bg-cyan-500 py-5 text-base font-semibold text-black hover:bg-cyan-400 pulse-glow"
            >
              Proceed to Checkout
            </Button>

            {/* Order Protection Badge */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
              <Lock className="size-4 text-cyan-400 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-semibold text-foreground">Order Protection</p>
                <p className="text-[9px] text-muted-foreground">256-bit SSL encrypted checkout</p>
              </div>
              <ShieldCheck className="ml-auto size-4 text-emerald-400 shrink-0" />
            </div>

            <button
              onClick={() => navigate('shop')}
              className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-cyan-400"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Saved Items from Wishlist */}
      {wishlistItems.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-3">
            <Heart className="size-5 text-red-400" />
            <h2 className="text-lg font-bold text-foreground">Saved for Later</h2>
            <span className="text-xs text-muted-foreground">({wishlistItems.length} items)</span>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {wishlistItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="group flex cursor-pointer flex-col rounded-xl border border-border bg-card/50 p-3 transition-all hover:border-cyan-500/20"
                onClick={() => navigate('product', { productId: item.id })}
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="size-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="mb-1 line-clamp-1 text-xs font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-cyan-400">${item.price.toFixed(2)}</p>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 flex-1 border-border text-[10px] text-muted-foreground hover:border-cyan-500/40 hover:text-cyan-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      const cartStore = useCartStore.getState()
                      cartStore.addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        slug: item.slug,
                      })
                      showNotification(`${item.name} added to cart`, 'success')
                    }}
                  >
                    <ShoppingCart className="mr-1 size-3" />
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 size-7 text-muted-foreground hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlistItem(item)
                      showNotification(`${item.name} removed from wishlist`, 'info')
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* You Might Also Like */}
      {suggestedProducts.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="size-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-foreground">You Might Also Like</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {suggestedProducts.map((product) => (
              <div
                key={product.id}
                className="group flex cursor-pointer flex-col rounded-xl border border-border bg-card/50 p-3 transition-all hover:border-cyan-500/20"
                onClick={() => navigate('product', { productId: product.id })}
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  {product.brand && (
                    <div className="absolute left-2 top-2 rounded-md border border-neutral-600/50 bg-card/80 px-1.5 py-0.5 text-[8px] text-muted-foreground backdrop-blur-sm">
                      {product.brand}
                    </div>
                  )}
                </div>
                <h3 className="mb-1 line-clamp-1 text-xs font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-cyan-400">${product.price.toFixed(2)}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7 text-muted-foreground hover:text-cyan-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddSuggestedToCart(product)
                    }}
                  >
                    <ShoppingCart className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent className="border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Remove Item</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to remove this item from your cart? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRemove}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="mr-2 size-4" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
