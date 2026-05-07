'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const COOKIE_CONSENT_KEY = 'morpheye_cookie_consent'

interface CookiePreferences {
  analytics: boolean
  marketing: boolean
  functional: boolean
}

interface ConsentData {
  accepted: boolean
  preferences: CookiePreferences
  timestamp: number
}

function getStoredConsent(): ConsentData | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      return JSON.parse(stored) as ConsentData
    }
  } catch {
    // ignore
  }
  return null
}

function saveConsent(accepted: boolean, preferences: CookiePreferences) {
  const data: ConsentData = {
    accepted,
    preferences,
    timestamp: Date.now(),
  }
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data))
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    marketing: false,
    functional: true,
  })

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored) {
      // Small delay for better UX - show after page loads
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    saveConsent(true, {
      analytics: true,
      marketing: true,
      functional: true,
    })
    setVisible(false)
  }

  const handleAcceptSelected = () => {
    saveConsent(true, preferences)
    setVisible(false)
  }

  const handleRejectAll = () => {
    saveConsent(false, {
      analytics: false,
      marketing: false,
      functional: false,
    })
    setVisible(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] border-t border-cyan-500/20 bg-[#0d0d0d]/95 px-4 py-5 backdrop-blur-xl sm:px-6"
        >
          <div className="mx-auto max-w-5xl">
            {!showCustomize ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                {/* Icon + Text */}
                <div className="flex flex-1 items-start gap-3 sm:items-center">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                    <Cookie className="size-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      We value your privacy
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.{' '}
                      <button
                        onClick={() => setShowCustomize(true)}
                        className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                      >
                        Customize preferences
                      </button>
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    size="sm"
                    className="border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white hover:bg-neutral-800"
                  >
                    Reject All
                  </Button>
                  <Button
                    onClick={() => setShowCustomize(true)}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    Customize
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                      <ShieldCheck className="size-4 text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Cookie Preferences
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <p className="text-xs text-neutral-400">
                  Manage your cookie preferences. Essential cookies cannot be disabled as they are required for the website to function properly.
                </p>

                {/* Cookie Categories */}
                <div className="space-y-3">
                  {/* Essential - Always on */}
                  <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Checkbox checked disabled className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" />
                      <div>
                        <p className="text-sm font-medium text-white">Essential</p>
                        <p className="text-[11px] text-neutral-500">Required for basic site functionality</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-400/60">Always Active</span>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
                    <button
                      onClick={() => togglePreference('analytics')}
                      className="flex items-center gap-3 text-left"
                    >
                      <Checkbox
                        checked={preferences.analytics}
                        className="border-neutral-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">Analytics</p>
                        <p className="text-[11px] text-neutral-500">Help us improve by tracking usage patterns</p>
                      </div>
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
                    <button
                      onClick={() => togglePreference('marketing')}
                      className="flex items-center gap-3 text-left"
                    >
                      <Checkbox
                        checked={preferences.marketing}
                        className="border-neutral-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">Marketing</p>
                        <p className="text-[11px] text-neutral-500">Personalized ads and promotional content</p>
                      </div>
                    </button>
                  </div>

                  {/* Functional */}
                  <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
                    <button
                      onClick={() => togglePreference('functional')}
                      className="flex items-center gap-3 text-left"
                    >
                      <Checkbox
                        checked={preferences.functional}
                        className="border-neutral-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">Functional</p>
                        <p className="text-[11px] text-neutral-500">Enhanced features and preferences</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Back
                  </button>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white hover:bg-neutral-800"
                    >
                      Reject All
                    </Button>
                    <Button
                      onClick={handleAcceptSelected}
                      size="sm"
                      className="bg-cyan-500 text-black hover:bg-cyan-400"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
