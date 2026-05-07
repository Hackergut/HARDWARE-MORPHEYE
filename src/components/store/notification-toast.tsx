'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useNotificationStore } from '@/store/notification-store'

export function NotificationToast() {
  const { message, type, hide } = useNotificationStore()

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        hide()
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [message, hide])

  const icons = {
    success: <CheckCircle2 className="size-5 text-emerald-500" />,
    error: <XCircle className="size-5 text-red-500" />,
    info: <Info className="size-5 text-blue-400" />,
  }

  const bgColors = {
    success: 'border-emerald-500/20 bg-card',
    error: 'border-red-500/20 bg-card',
    info: 'border-blue-400/20 bg-card',
  }

  return (
    <AnimatePresence>
      {message && type && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className={`fixed right-4 top-20 z-[100] flex max-w-sm items-center gap-3 rounded-lg border px-4 py-3 shadow-xl ${bgColors[type]}`}
        >
          {icons[type]}
          <span className="flex-1 text-sm text-foreground">{message}</span>
          <button
            onClick={hide}
            className="text-muted-foreground transition hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
