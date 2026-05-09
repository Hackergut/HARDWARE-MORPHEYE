'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Send, CreditCard, Wallet, ArrowUp, ShieldCheck, Loader2 } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const quickLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Shop', page: 'shop' as const },
  { label: 'Bundles', page: 'shop' as const },
  { label: 'Wholesale', page: 'wholesale' as const },
  { label: 'Loyalty', page: 'loyalty' as const },
  { label: 'Blog', page: 'blog' as const },
  { label: 'Contact', page: 'contact' as const },
  { label: 'Privacy Policy', page: 'privacy' as const },
  { label: 'Terms of Service', page: 'terms' as const },
]

const supportLinks = [
  { label: 'FAQ', page: 'faq' as const },
  { label: 'Shipping', page: null as string | null },
  { label: 'Returns', page: null as string | null },
  { label: 'Warranty', page: null as string | null },
  { label: 'Track Order', page: 'tracking' as string | null },
  { label: 'Subscriptions', page: 'subscriptions' as string | null },
]

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Send, label: 'Telegram', href: '#' },
]

const paymentMethods = [
  { icon: CreditCard, label: 'Visa', color: 'text-blue-400' },
  { icon: CreditCard, label: 'MC', color: 'text-orange-400' },
  { icon: CreditCard, label: 'Amex', color: 'text-blue-300' },
  { icon: Wallet, label: 'Crypto', color: 'text-cyan-400' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function StoreFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { navigate } = useNavigationStore()
  const showNotification = useNotificationStore((s) => s.show)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0],
          email,
          subject: 'Newsletter Subscription',
          message: `Newsletter subscription request from ${email}`,
        }),
      })

      if (res.ok) {
        setSubscribed(true)
        setEmail('')
        showNotification('Successfully subscribed to newsletter!', 'success')
        setTimeout(() => setSubscribed(false), 5000)
      } else {
        const data = await res.json()
        showNotification(data.error || 'Failed to subscribe. Please try again.', 'error')
      }
    } catch {
      showNotification('Network error. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative mt-auto border-t border-border bg-background">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Morpheye"
                width={28}
                height={28}
                className="rounded dark:invert"
              />
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold tracking-tight text-foreground leading-none">MORPHEYE</span>
                <span className="text-[9px] font-medium tracking-widest text-cyan-500/80 uppercase leading-none mt-1">
                  Official Reseller
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Authorized Hardware Wallet Reseller
            </p>
            <p className="text-xs text-muted-foreground">
              Your trusted source for certified crypto security hardware. We
              only sell genuine, factory-sealed devices.
            </p>
            {/* Trust badge */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2">
              <ShieldCheck className="size-4 text-cyan-400" />
              <span className="text-[10px] font-medium text-muted-foreground">Verified Authentic Reseller</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.page ? (
                    <button
                      onClick={() => navigate(link.page as Parameters<typeof navigate>[0])}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-cyan-400 hover:translate-x-0.5 transform inline-block"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <span className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-cyan-400">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  {link.page ? (
                    <button
                      onClick={() => navigate(link.page as Parameters<typeof navigate>[0])}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-cyan-400 hover:translate-x-0.5 transform inline-block"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <span className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-cyan-400">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              Stay Updated
            </h4>
            <p className="mb-3 text-xs text-muted-foreground">
              Get exclusive deals and security tips delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2.5">
                <ShieldCheck className="size-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium text-cyan-400">
                  Subscribed! Check your inbox.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError('')
                      }}
                      placeholder="you@email.com"
                      disabled={submitting}
                      className={`h-8 border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 ${
                        emailError ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting}
                    className="bg-cyan-500 text-black hover:bg-cyan-400 shrink-0"
                  >
                    {submitting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      'Join'
                    )}
                  </Button>
                </div>
                {emailError && (
                  <p className="text-[10px] text-red-400">{emailError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        <Separator className="my-8 sm:my-10 bg-muted" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Morpheye. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-8 items-center justify-center rounded-full border border-border text-neutral-500 transition-all duration-200 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-cyan-500/5"
              >
                <social.icon className="size-3.5" />
              </a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs">We accept:</span>
            <div className="flex items-center gap-1.5">
              {paymentMethods.map((method) => (
                <div
                  key={method.label}
                  className="flex items-center gap-1 rounded border border-border bg-card/50 px-2 py-1 transition-colors duration-200 hover:border-border dark:hover:border-border hover:border-neutral-300"
                >
                  <method.icon className={`size-3 ${method.color}`} />
                  <span className="text-[10px] font-medium">{method.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="back-to-top-visible fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border border-border bg-card/90 dark:bg-card/90 bg-white/90 text-cyan-400 shadow-lg shadow-cyan-500/10 backdrop-blur-sm transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 hover:shadow-cyan-500/20"
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" />
        </button>
      )}
    </footer>
  )
}
