'use client'

import { useState } from 'react'
import { Facebook, Twitter, Instagram, Send, CreditCard, Wallet } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const quickLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Shop', page: 'shop' as const },
  { label: 'About', page: 'home' as const },
  { label: 'Contact', page: 'home' as const },
]

const supportLinks = [
  'FAQ',
  'Shipping',
  'Returns',
  'Warranty',
]

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Send, label: 'Telegram', href: '#' },
]

export function StoreFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { navigate } = useNavigationStore()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="mt-auto border-t border-neutral-800 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded bg-emerald-500 text-sm font-bold text-black">
                M
              </div>
              <span className="text-lg font-bold text-white">Morpheye</span>
            </div>
            <p className="text-sm text-neutral-400">
              Authorized Hardware Wallet Reseller
            </p>
            <p className="text-xs text-neutral-500">
              Your trusted source for certified crypto security hardware. We
              only sell genuine, factory-sealed devices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-neutral-400 transition-colors hover:text-emerald-500"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link}>
                  <span className="cursor-pointer text-sm text-neutral-400 transition-colors hover:text-emerald-500">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Stay Updated
            </h4>
            <p className="mb-3 text-xs text-neutral-400">
              Get exclusive deals and security tips delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="h-8 border-neutral-700 bg-neutral-900 text-xs text-white placeholder:text-neutral-500"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-500 text-black hover:bg-emerald-600"
              >
                Join
              </Button>
            </form>
            {subscribed && (
              <p className="mt-2 text-xs text-emerald-500">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        <Separator className="my-8 bg-neutral-800" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Morpheye. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-neutral-500 transition-colors hover:text-emerald-500"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 text-neutral-500">
            <span className="text-xs">We accept:</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1">
                <CreditCard className="size-3" />
                <span className="text-[10px]">Visa</span>
              </div>
              <div className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1">
                <CreditCard className="size-3" />
                <span className="text-[10px]">MC</span>
              </div>
              <div className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1">
                <Wallet className="size-3" />
                <span className="text-[10px]">Crypto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
