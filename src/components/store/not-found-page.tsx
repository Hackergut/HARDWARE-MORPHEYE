'use client'

import { motion } from 'framer-motion'
import { Lock, Home, ShoppingBag, ShieldAlert, Link2 } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const { navigate } = useNavigationStore()

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Animated Graphic - Broken Chain / Lock */}
        <div className="relative mx-auto mb-8 size-40">
          {/* Outer ring with pulse */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(6, 182, 212, 0.2)',
                '0 0 0 20px rgba(6, 182, 212, 0)',
                '0 0 0 0 rgba(6, 182, 212, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full"
          />

          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-teal-500/5" />

          {/* Lock icon - broken */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Lock className="size-16 text-cyan-400/60" />
            </motion.div>
          </div>

          {/* Broken chain links floating around */}
          <motion.div
            animate={{
              x: [0, 6, -4, 0],
              y: [0, -8, 4, 0],
              rotate: [0, 15, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 right-2"
          >
            <Link2 className="size-6 text-cyan-500/40 rotate-45" />
          </motion.div>

          <motion.div
            animate={{
              x: [0, -8, 6, 0],
              y: [0, 6, -4, 0],
              rotate: [0, -20, 10, 0],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-4 left-0"
          >
            <Link2 className="size-5 text-cyan-500/30 -rotate-12" />
          </motion.div>

          {/* Error badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-background px-3 py-1 shadow-lg shadow-cyan-500/10">
              <ShieldAlert className="size-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400">404</span>
            </div>
          </motion.div>
        </div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-3 text-3xl font-bold text-foreground sm:text-4xl"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2 text-muted-foreground"
        >
          This block has been removed from the chain.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-sm text-muted-foreground/70"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to a secure destination.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button
            onClick={() => navigate('home')}
            className="bg-cyan-500 text-black hover:bg-cyan-400 px-8"
          >
            <Home className="mr-2 size-4" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigate('shop')}
            variant="outline"
            className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 px-8"
          >
            <ShoppingBag className="mr-2 size-4" />
            Browse Shop
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
