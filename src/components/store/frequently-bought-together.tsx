'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Package, Gift, CheckCircle2 } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface BundleProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

interface FrequentlyBoughtTogetherProps {
  productId: string
}

export function FrequentlyBoughtTogether({ productId }: FrequentlyBoughtTogetherProps) {
  const [mainProduct, setMainProduct] = useState<BundleProduct | null>(null)
  const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([])
  const [selections, setSelections] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const { navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const showNotification = useNotificationStore((s) => s.show)

  useEffect(() => {
    if (!productId) return
    setLoading(true)

    Promise.all([
      fetch(`/api/products/${productId}`).then((r) => r.json()),
      fetch(`/api/products/bundles?productId=${productId}`).then((r) => r.json()),
    ])
      .then(([productData, bundleData]) => {
        const main = productData.product || productData
        setMainProduct(main)
        const bundles = (bundleData.products || bundleData || []).filter(
          (p: BundleProduct) => p.id !== main.id
        ).slice(0, 3)
        setBundleProducts(bundles)

        const sel: Record<string, boolean> = {}
        sel[main.id] = true
        bundles.forEach((p: BundleProduct) => {
          sel[p.id] = true
        })
        setSelections(sel)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId])

  const toggleSelection = (id: string) => {
    if (id === mainProduct?.id) return
    setSelections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getBundleTotal = () => {
    if (!mainProduct) return { original: 0, discounted: 0, savings: 0 }
    const selectedPrices = bundleProducts
      .filter((p) => selections[p.id])
      .map((p) => p.price)
    const allPrices = [mainProduct.price, ...selectedPrices]
    const original = allPrices.reduce((sum, p) => sum + p, 0)
    const discounted = original * 0.95
    const savings = original - discounted
    return { original, discounted, savings }
  }

  const handleAddAll = () => {
    if (!mainProduct) return

    addItem({
      id: mainProduct.id,
      name: mainProduct.name,
      price: mainProduct.price,
      image: mainProduct.images?.[0] || '',
      slug: mainProduct.slug,
    })

    bundleProducts
      .filter((p) => selections[p.id])
      .forEach((p) => {
        addItem({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || '',
          slug: p.slug,
        })
      })

    const total = getBundleTotal()
    showNotification(`Bundle added! You saved $${total.savings.toFixed(2)}`, 'success')
  }

  if (loading) return null

  const allProducts = mainProduct
    ? [mainProduct, ...bundleProducts]
    : bundleProducts

  if (allProducts.length < 2) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      <div className="mb-6 flex items-center gap-3">
        <Gift className="size-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-foreground">Frequently Bought Together</h2>
        <Badge className="border-cyan-500/30 bg-cyan-500/20 text-[10px] font-bold text-cyan-400">5% BUNDLE DISCOUNT</Badge>
        <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-4 sm:p-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-0 sm:justify-center">
          {allProducts.map((product, idx) => (
            <div key={product.id} className="flex items-center gap-3 sm:w-auto w-full">
              {idx > 0 && <PlusCircle className="hidden size-5 shrink-0 text-muted-foreground sm:block" />}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all sm:w-auto w-full',
                  selections[product.id]
                    ? 'border-cyan-500/30 bg-cyan-500/5'
                    : 'border-border bg-card/50 opacity-60'
                )}
                onClick={() => toggleSelection(product.id)}
              >
                <Checkbox
                  checked={selections[product.id] || false}
                  onCheckedChange={() => toggleSelection(product.id)}
                  disabled={product.id === mainProduct?.id}
                  className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs font-bold text-cyan-400">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-muted/40 p-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Price:</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg text-neutral-500 line-through">
                  ${getBundleTotal().original.toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-cyan-400">
                  ${getBundleTotal().discounted.toFixed(2)}
                </span>
              </div>
            </div>
            <Badge className="border-emerald-500/30 bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
              Save ${getBundleTotal().savings.toFixed(2)}
            </Badge>
          </div>
          <Button
            onClick={handleAddAll}
            className="w-full bg-cyan-500 px-8 font-semibold text-black transition-all hover:bg-cyan-400 sm:w-auto"
          >
            <ShoppingCart className="mr-2 size-4" />
            Add All to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function PlusCircle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-5 shrink-0 text-muted-foreground', className)}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  )
}
