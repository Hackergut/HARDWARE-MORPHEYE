'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ShoppingBag, Package } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'

function getInitialOrderNumber(): string {
  if (typeof window === 'undefined') return ''
  const num = sessionStorage.getItem('lastOrderNumber')
  if (num) {
    sessionStorage.removeItem('lastOrderNumber')
    return num
  }
  return ''
}

export function CheckoutSuccess() {
  const { navigate } = useNavigationStore()
  const [orderNumber] = useState<string>(getInitialOrderNumber)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <CheckCircle2 className="size-20 text-emerald-500" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-3 text-3xl font-bold text-white"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-2 text-neutral-400"
      >
        Thank you for your purchase. Your order is being processed.
      </motion.p>

      {orderNumber && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-3"
        >
          <p className="text-xs text-neutral-500">Order Number</p>
          <p className="text-lg font-mono font-bold text-emerald-500">
            {orderNumber}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8 flex items-center gap-2 rounded-lg bg-neutral-900/50 px-4 py-3 text-sm text-neutral-400"
      >
        <Package className="size-4 text-emerald-500" />
        Estimated delivery: 3–7 business days
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Button
          onClick={() => navigate('shop')}
          className="bg-emerald-500 px-8 text-black hover:bg-emerald-600"
        >
          <ShoppingBag className="mr-2 size-4" />
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white"
        >
          Track Order
        </Button>
      </motion.div>
    </motion.div>
  )
}
