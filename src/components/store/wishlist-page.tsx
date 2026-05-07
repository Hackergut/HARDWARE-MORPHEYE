'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, Package, ArrowRight } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'

export function WishlistPage() {
  const { navigate } = useNavigationStore()
  const { items, removeItem } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
    })
    showNotification(`${item.name} added to cart`, 'success')
  }

  const handleRemove = (id: string, name: string) => {
    removeItem(id)
    showNotification(`${name} removed from wishlist`, 'info')
  }

  // Empty state
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-4"
      >
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-card">
          <Heart className="size-10 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">Your wishlist is empty</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Save items you love for later. Browse our collection and tap the heart icon to add items.
        </p>
        <Button
          onClick={() => navigate('shop')}
          className="bg-cyan-500 text-black hover:bg-cyan-400"
        >
          <ShoppingCart className="mr-2 size-4" />
          Start Shopping
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('shop')}
          className="text-muted-foreground hover:text-cyan-400"
        >
          Continue Shopping
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border dark:bg-card bg-white transition-all hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              {/* Image */}
              <button
                onClick={() => navigate('product', { productId: item.id })}
                className="relative aspect-square w-full overflow-hidden bg-muted"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="size-12 text-muted-foreground" />
                  </div>
                )}
              </button>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <button
                  onClick={() => navigate('product', { productId: item.id })}
                  className="mb-2 text-left text-sm font-semibold text-foreground transition-colors hover:text-cyan-400 line-clamp-2"
                >
                  {item.name}
                </button>

                <span className="mb-4 text-lg font-bold text-cyan-400">
                  ${item.price.toFixed(2)}
                </span>

                <div className="mt-auto flex items-center gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    size="sm"
                    className="flex-1 bg-cyan-500 text-xs font-semibold text-black hover:bg-cyan-400"
                  >
                    <ShoppingCart className="mr-1.5 size-3.5" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleRemove(item.id, item.name)}
                    size="icon"
                    variant="ghost"
                    className="size-8 shrink-0 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
