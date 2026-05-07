'use client'

/**
 * Meta Pixel Integration Component
 * Follows: SRP - Only handles Meta Pixel initialization and event tracking
 * Follows: DIP - Reads pixel ID from settings API, not hardcoded
 */

import { useEffect } from 'react'

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
  }
}

export function MetaPixel() {
  useEffect(() => {
    async function initPixel() {
      try {
        const res = await fetch('/api/settings')
        if (!res.ok) return
        const settings = await res.json()
        const pixelId = settings.meta_pixel_id

        if (!pixelId || pixelId.trim() === '') return

        // Initialize Meta Pixel using the standard fbq snippet pattern
        if (typeof window !== 'undefined' && !window.fbq) {
          const w = window as Record<string, unknown>
          const fbqFunc = function (...args: unknown[]) {
            const f = w.fbq as Record<string, unknown>
            if (typeof f?.callMethod === 'function') {
              (f.callMethod as (...a: unknown[]) => void)(...args)
            } else {
              (f.queue as unknown[]).push(args)
            }
          }
          w.fbq = fbqFunc
          const fbqObj = w.fbq as Record<string, unknown>
          fbqObj.push = fbqFunc
          fbqObj.loaded = true
          fbqObj.version = '2.0'
          fbqObj.queue = []

          const script = document.createElement('script')
          script.async = true
          script.src = 'https://connect.facebook.net/en_US/fbevents.js'
          document.head.appendChild(script)

          window.fbq('init', pixelId)
          window.fbq('track', 'PageView')
        }
      } catch {
        // Pixel init failed silently
      }
    }

    initPixel()
  }, [])

  return null
}

// Utility functions for tracking events (used by other components)
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

export function trackPurchase(value: number, currency = 'USD') {
  trackEvent('Purchase', { value, currency })
}

export function trackAddToCart(value: number, currency = 'USD', contentName?: string) {
  trackEvent('AddToCart', {
    value,
    currency,
    content_name: contentName,
  })
}

export function trackInitCheckout(value: number, currency = 'USD') {
  trackEvent('InitiateCheckout', { value, currency })
}

export function trackViewContent(contentName: string, value?: number) {
  trackEvent('ViewContent', {
    content_name: contentName,
    value,
    currency: 'USD',
  })
}

export function trackSearch(searchString: string) {
  trackEvent('Search', { search_string: searchString })
}
