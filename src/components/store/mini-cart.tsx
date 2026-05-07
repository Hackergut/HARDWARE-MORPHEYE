'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, X, Package, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface MiniCartProps {
  onClose: () => void
}

export function MiniCart({ onClose }: MiniCartProps) {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const getTotal = useCartStore((s) => s.getTotal)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const navigate = useNavigationStore((s) => s.navigate)

  const total = getTotal()
  const itemCount = getItemCount()
  const isEmpty = items.length === 0

  const handleViewCart = () => {
    onClose()
    navigate('cart')
  }

  const handleCheckout = () => {
    onClose()
    navigate('checkout')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-[340px] sm:w-[380px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl dark:shadow-black/50 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 dark:bg-card/80 bg-muted/50">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-cyan-500" />
          <span className="text-sm font-semibold text-foreground">Your Cart</span>
          {itemCount > 0 && (
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 dark:text-neutral-500 text-muted-foreground transition-colors hover:text-foreground dark:hover:bg-muted hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isEmpty ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center px-4 py-10"
          >
            <div className="mb-3 flex size-14 items-center justify-center rounded-full dark:bg-muted/80 bg-muted">
              <ShoppingCart className="size-6 dark:text-neutral-500 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium dark:text-neutral-300 text-muted-foreground">Your cart is empty</p>
            <p className="mt-1 text-xs dark:text-neutral-500 text-muted-foreground">Add some products to get started</p>
            <Button
              onClick={handleViewCart}
              size="sm"
              className="mt-4 bg-cyan-500 text-white hover:bg-cyan-400"
            >
              Browse Shop
              <ArrowRight className="ml-1 size-3" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Items list */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar px-3 py-2">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors dark:hover:bg-muted/50 hover:bg-muted/50"
                  >
                    {/* Thumbnail */}
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border dark:bg-card bg-muted/50">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground group-hover:text-cyan-400 transition-colors">
                        {item.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs font-semibold text-cyan-500">
                          ${item.price.toFixed(2)}
                        </span>
                        {/* Quantity controls */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateQuantity(item.id, item.quantity - 1)
                            }}
                            className="flex size-5 items-center justify-center rounded text-[10px] font-bold dark:text-neutral-500 text-muted-foreground transition-colors dark:hover:bg-muted hover:bg-muted hover:text-foreground"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-[10px] font-semibold dark:text-neutral-300 text-muted-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateQuantity(item.id, item.quantity + 1)
                            }}
                            className="flex size-5 items-center justify-center rounded text-[10px] font-bold dark:text-neutral-500 text-muted-foreground transition-colors dark:hover:bg-muted hover:bg-muted hover:text-foreground"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                      className="shrink-0 rounded-md p-1.5 dark:text-neutral-600 text-muted-foreground opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Separator className="dark:bg-muted bg-neutral-200" />

            {/* Footer */}
            <div className="px-4 py-3 space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-xs dark:text-neutral-400 text-muted-foreground">Subtotal</span>
                <span className="text-sm font-bold text-foreground">${total.toFixed(2)}</span>
              </div>
              {total < 150 && (
                <p className="text-[10px] dark:text-neutral-500 text-muted-foreground">
                  Add <span className="text-cyan-500 font-medium">${(150 - total).toFixed(2)}</span> more for free shipping
                </p>
              )}
              {total >= 150 && (
                <p className="text-[10px] text-emerald-500 font-medium">
                  ✓ You qualify for free shipping!
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewCart}
                  className="flex-1 dark:border-border border-neutral-300 bg-transparent dark:text-neutral-300 text-muted-foreground dark:hover:bg-muted hover:bg-muted hover:text-foreground text-xs"
                >
                  View Cart
                </Button>
                <Button
                  size="sm"
                  onClick={handleCheckout}
                  className="flex-1 bg-cyan-500 text-white hover:bg-cyan-400 text-xs font-semibold"
                >
                  Checkout
                  <ArrowRight className="ml-1 size-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
