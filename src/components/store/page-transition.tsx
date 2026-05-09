'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/store/navigation-store'
import { useEffect, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { currentPage } = useNavigationStore()
  const [displayPage, setDisplayPage] = useState(currentPage)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (currentPage !== displayPage) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayPage(currentPage)
        setIsTransitioning(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentPage, displayPage])

  return (
    <div className="relative">
      {/* Page transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f7157]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.2 }}
                className="text-white text-lg font-bold tracking-wider uppercase"
              >
                {displayPage === 'home' ? 'Loading...' : displayPage.replace(/-/g, ' ')}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with fade */}
      <motion.div
        key={displayPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
