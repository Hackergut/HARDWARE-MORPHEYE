'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, ChevronRight, FileText, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TOCItem {
  id: string
  label: string
}

const tocItems: TOCItem[] = [
  { id: 'information-collection', label: 'Information We Collect' },
  { id: 'use-of-information', label: 'How We Use Your Information' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'third-party-services', label: 'Third-Party Services' },
  { id: 'user-rights', label: 'Your Rights' },
  { id: 'contact', label: 'Contact Us' },
]

const LAST_UPDATED = 'March 4, 2026'

export function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>('information-collection')

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }))

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(sections[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
            <Shield className="size-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          At Morpheye, we take your privacy and data security seriously. This Privacy Policy explains how we collect, use, protect, and share your personal information when you visit our website and purchase our products.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Table of Contents Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {activeSection === item.id && (
                    <ChevronRight className="size-3 shrink-0 text-cyan-400" />
                  )}
                  <span className={activeSection === item.id ? '' : 'ml-5'}>
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile TOC */}
        <div className="lg:hidden col-span-full">
          <div className="rounded-xl border border-border bg-card/50 p-4 mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Table of Contents
            </h3>
            <div className="flex flex-wrap gap-2">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'border-cyan-500 bg-cyan-500 text-black'
                      : 'border-border text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-10">
          {/* 1. Information Collection */}
          <section id="information-collection" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                We collect information to provide and improve our services, process your orders, and ensure a secure shopping experience. The types of information we collect include:
              </p>

              <div className="rounded-lg border border-border bg-card/30 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li><span className="text-foreground font-medium">Identity Data:</span> Full name, email address, phone number</li>
                  <li><span className="text-foreground font-medium">Payment Data:</span> Payment method information processed securely through our payment providers (we do not store full card details)</li>
                  <li><span className="text-foreground font-medium">Shipping Data:</span> Delivery address, city, country, ZIP code</li>
                  <li><span className="text-foreground font-medium">Transaction Data:</span> Order history, purchased products, order totals</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card/30 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Technical Information</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li><span className="text-foreground font-medium">Device Data:</span> Browser type, operating system, device identifiers</li>
                  <li><span className="text-foreground font-medium">Usage Data:</span> Pages visited, time spent, click patterns, referral source</li>
                  <li><span className="text-foreground font-medium">IP Address:</span> Used for fraud prevention and geographic analytics</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card/30 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Communication Data</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Contact form submissions, support tickets, and email correspondence</li>
                  <li>Newsletter subscription preferences and engagement data</li>
                  <li>Product review submissions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Use of Information */}
          <section id="use-of-information" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Order Processing:</span> To fulfill your orders, process payments, arrange shipping, and provide order updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Communication:</span> To respond to your inquiries, send order confirmations, shipping notifications, and customer support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Security:</span> To verify your identity, prevent fraud, and protect against unauthorized transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Improvement:</span> To analyze usage patterns, improve our website and services, and enhance user experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Marketing:</span> To send promotional offers and newsletters (only with your explicit consent, easily opt-out anytime)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Legal Compliance:</span> To comply with applicable laws, regulations, and legal processes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Data Security */}
          <section id="data-security" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <Shield className="size-5 text-cyan-400" />
              3. Data Security
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                As a company specializing in cryptocurrency security products, we hold ourselves to the highest standards of data protection. We implement industry-leading security measures to safeguard your information:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-cyan-400">256-bit SSL Encryption</h4>
                  <p className="text-xs text-muted-foreground">All data transmitted between your browser and our servers is encrypted using TLS 1.3</p>
                </div>
                <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-cyan-400">Secure Payment Processing</h4>
                  <p className="text-xs text-muted-foreground">Payment data is handled by PCI-DSS compliant providers; we never store full card numbers</p>
                </div>
                <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-cyan-400">Access Controls</h4>
                  <p className="text-xs text-muted-foreground">Strict role-based access controls limit employee access to personal data on a need-to-know basis</p>
                </div>
                <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-cyan-400">Regular Audits</h4>
                  <p className="text-xs text-muted-foreground">We conduct regular security audits and penetration testing to identify and address vulnerabilities</p>
                </div>
              </div>
              <p>
                While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest possible standards.
              </p>
            </div>
          </section>

          {/* 4. Cookies */}
          <section id="cookies" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              4. Cookies & Tracking
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>
              <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground">Type</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground">Purpose</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">Essential</td>
                      <td className="px-4 py-2.5">Site functionality, cart, authentication</td>
                      <td className="px-4 py-2.5">Session / Persistent</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">Analytics</td>
                      <td className="px-4 py-2.5">Usage patterns, performance monitoring</td>
                      <td className="px-4 py-2.5">Up to 2 years</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">Marketing</td>
                      <td className="px-4 py-2.5">Targeted ads, conversion tracking</td>
                      <td className="px-4 py-2.5">Up to 1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-foreground">Functional</td>
                      <td className="px-4 py-2.5">Preferences, personalization</td>
                      <td className="px-4 py-2.5">Up to 1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                You can manage your cookie preferences at any time through your browser settings. Disabling certain cookies may affect site functionality. We display a cookie consent banner on your first visit to inform you of our cookie usage.
              </p>
            </div>
          </section>

          {/* 5. Third-Party Services */}
          <section id="third-party-services" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              5. Third-Party Services
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                We may share your information with trusted third-party service providers who assist us in operating our business. These providers are contractually obligated to protect your data and use it only for the purposes we specify:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Payment Processors:</span> To securely process your payments (Stripe, PayPal, crypto payment gateways)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Shipping Carriers:</span> To deliver your orders and provide tracking information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Analytics Providers:</span> To understand site usage and improve our services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Email Services:</span> To send order confirmations, shipping updates, and newsletters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Marketing Platforms:</span> For retargeting and advertising with your consent</span>
                </li>
              </ul>
              <p>
                We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We only share data as necessary to provide our services.
              </p>
            </div>
          </section>

          {/* 6. User Rights */}
          <section id="user-rights" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              6. Your Rights
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Access</h4>
                  <p className="text-xs text-muted-foreground">Request a copy of the personal data we hold about you</p>
                </div>
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Correction</h4>
                  <p className="text-xs text-muted-foreground">Request correction of inaccurate or incomplete personal data</p>
                </div>
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Deletion</h4>
                  <p className="text-xs text-muted-foreground">Request deletion of your personal data, subject to legal retention requirements</p>
                </div>
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Portability</h4>
                  <p className="text-xs text-muted-foreground">Request transfer of your data in a structured, commonly used format</p>
                </div>
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Opt-Out</h4>
                  <p className="text-xs text-muted-foreground">Unsubscribe from marketing communications at any time via email or account settings</p>
                </div>
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Restriction</h4>
                  <p className="text-xs text-muted-foreground">Request restriction of processing in certain circumstances</p>
                </div>
              </div>
              <p>
                To exercise any of these rights, please contact us at <span className="text-cyan-400">privacy@morpheye.com</span>. We will respond to your request within 30 days. We may need to verify your identity before processing your request.
              </p>
            </div>
          </section>

          {/* 7. Contact */}
          <section id="contact" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <Mail className="size-5 text-cyan-400" />
              7. Contact Us
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Mail className="size-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">privacy@morpheye.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Phone className="size-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">+1 (800) 555-0199</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
                    <MapPin className="size-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium text-foreground">Morpheye Inc., 123 Crypto Lane, Suite 400, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Back to Top */}
      <div className="mt-12 text-center">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="outline"
          className="border-border text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/30"
        >
          Back to Top
        </Button>
      </div>
    </motion.div>
  )
}
