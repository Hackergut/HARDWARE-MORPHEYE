'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Gift, Package, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UpsellProduct {
  id: string
  name: string
  price: number
  images: string[]
}

interface UpsellModalProps {
  open: boolean
  onClose: () => void
  currentProducts: string[]
}

export function UpsellModal({ open, onClose, currentProducts }: UpsellModalProps) {
  const [products, setProducts] = useState<UpsellProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)

  useEffect(() => {
    if (!open) {
      setAddedIds(new Set())
      return
    }
    setLoading(true)
    fetch('/api/products?featured=true&limit=5')
      .then((r) => r.json())
      .then((data) => {
        const all = (data.products || []).filter(
          (p: UpsellProduct) => !currentProducts.includes(p.id)
        )
        setProducts(all.slice(0, 3))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open, currentProducts])

  const handleAdd = (product: UpsellProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
    })
    setAddedIds((prev) => new Set(prev).add(product.id))
    showNotification(`${product.name} added to your order!`, 'success')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-t-2xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <Sparkles className="size-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Complete Your Setup</h2>
                <p className="text-xs text-muted-foreground">Add these accessories to your order</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex animate-pulse items-center gap-3 rounded-lg border border-border p-3">
                    <div className="size-16 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-muted" />
                      <div className="h-4 w-1/4 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No recommendations available right now.</p>
            ) : (
              <div className="space-y-3">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 transition-all',
                      addedIds.has(product.id)
                        ? 'border-emerald-500/30 bg-emerald-500/5 opacity-60'
                        : 'border-border hover:border-cyan-500/30 hover:bg-cyan-500/5'
                    )}
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package className="size-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm font-bold text-cyan-400">${product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => handleAdd(product)}
                      disabled={addedIds.has(product.id)}
                      size="sm"
                      className={cn(
                        'shrink-0 text-xs font-semibold',
                        addedIds.has(product.id)
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-cyan-500 text-black hover:bg-cyan-400'
                      )}
                    >
                      <ShoppingCart className="mr-1 size-3.5" />
                      {addedIds.has(product.id) ? 'Added' : 'Add to Order'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <button
                onClick={onClose}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                No thanks, I&apos;m done
              </button>
              {products.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Gift className="size-3.5 text-cyan-400" />
                  Complete your setup
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
