'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  scale?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  y = 40,
  scale = 1,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Stagger children animation */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Horizontal scroll marquee */
export function Marquee({
  children,
  className = '',
  speed = 30,
  direction = 'left',
}: {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'left' | 'right'
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex w-max"
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

/* Text reveal character by character */
export function TextReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: delay + i * 0.03,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* Magnetic button effect */
export function MagneticButton({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  )
}
