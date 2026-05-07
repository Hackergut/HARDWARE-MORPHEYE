'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scale, ChevronRight, FileText, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/store/navigation-store'

interface TOCItem {
  id: string
  label: string
}

const tocItems: TOCItem[] = [
  { id: 'acceptance', label: 'Acceptance of Terms' },
  { id: 'products-pricing', label: 'Products & Pricing' },
  { id: 'orders', label: 'Orders' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'warranties', label: 'Warranties' },
  { id: 'limitation', label: 'Limitation of Liability' },
  { id: 'governing-law', label: 'Governing Law' },
]

const LAST_UPDATED = 'March 4, 2026'

export function TermsPage() {
  const { navigate } = useNavigationStore()
  const [activeSection, setActiveSection] = useState<string>('acceptance')

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
            <Scale className="size-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          By accessing and using the Morpheye website and purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase.
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
          {/* 1. Acceptance */}
          <section id="acceptance" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                By accessing, browsing, or using the Morpheye website (the &ldquo;Site&rdquo;), and by purchasing products from us, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;), along with our Privacy Policy.
              </p>
              <p>
                If you do not agree to these Terms, you must not access or use the Site. We reserve the right to modify these Terms at any time. Changes become effective upon posting to the Site. Your continued use of the Site after any changes constitutes acceptance of the updated Terms.
              </p>
              <p>
                You must be at least 18 years old to use this Site and make purchases. By using this Site, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into binding agreements.
              </p>
            </div>
          </section>

          {/* 2. Products & Pricing */}
          <section id="products-pricing" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              2. Products & Pricing
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Morpheye sells authorized, genuine hardware wallets and security products sourced directly from manufacturers or authorized distributors. All products are new, factory-sealed, and come with original manufacturer warranties.
              </p>
              <div className="rounded-lg border border-border bg-card/30 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Pricing</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>All prices are displayed in US Dollars (USD) and include applicable taxes unless stated otherwise</li>
                  <li>Prices are subject to change without notice. The price charged will be the price in effect at the time of order placement</li>
                  <li>Promo codes and discounts are subject to specific terms and cannot be combined unless explicitly stated</li>
                  <li>We reserve the right to correct pricing errors. If a product is listed at an incorrect price, we may cancel the order and notify you</li>
                </ul>
              </div>
              <p>
                Product images and descriptions are provided for informational purposes. While we strive for accuracy, we do not guarantee that product descriptions, images, or other content on the Site are entirely accurate, complete, reliable, or error-free.
              </p>
            </div>
          </section>

          {/* 3. Orders */}
          <section id="orders" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              3. Orders
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                When you place an order through our Site, you are making an offer to purchase the selected products. All orders are subject to acceptance and availability.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Order Confirmation:</span> After placing an order, you will receive an email confirmation. This confirms we have received your order but does not constitute acceptance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Order Acceptance:</span> We reserve the right to refuse or cancel any order for any reason, including suspected fraud, pricing errors, or inventory shortages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Payment:</span> Payment must be received in full before we ship your order. We accept credit/debit cards, PayPal, and cryptocurrency</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Order Number:</span> Upon acceptance, you will receive a unique order number (MRP-XXXXXXXX-XXXX) for tracking purposes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Shipping */}
          <section id="shipping" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              4. Shipping
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                We ship to addresses worldwide. Shipping costs and delivery times vary based on your location and selected shipping method.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Standard Shipping</h4>
                  <p className="text-xs text-muted-foreground">5-7 business days. Free for orders over $150. $9.99 for orders under $150.</p>
                </div>
                <div className="rounded-lg border border-border bg-card/30 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-foreground">Express Shipping</h4>
                  <p className="text-xs text-muted-foreground">2-3 business days. $9.99 flat rate. Includes tracking and insurance.</p>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span>All shipments include tracking and insurance coverage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span>Processing time is typically 1 business day; orders placed after 5 PM EST are processed the next business day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span>International customers are responsible for customs duties, import taxes, and fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span>Delivery times are estimates and not guaranteed; we are not responsible for carrier delays</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Returns */}
          <section id="returns" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              5. Returns & Refunds
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
                <h3 className="mb-2 text-sm font-semibold text-amber-400">Important Security Notice</h3>
                <p className="text-xs text-muted-foreground">
                  Due to the security-sensitive nature of hardware wallets, we cannot accept returns on opened or initialized devices. A device that has been set up or had its recovery phrase generated may no longer be considered secure.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">30-Day Return Window:</span> Unused, unopened products may be returned within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Original Packaging Required:</span> Products must be returned in their original, undamaged packaging with all accessories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Damaged/Defective Items:</span> Contact us immediately if your device arrives damaged or with a broken tamper seal for a free replacement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Return Authorization:</span> All returns must be pre-authorized. Email support@morpheye.com to initiate a return</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span><span className="text-foreground font-medium">Refund Processing:</span> Approved refunds are processed within 5-10 business days to the original payment method</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Warranties */}
          <section id="warranties" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              6. Warranties
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Products sold by Morpheye carry the original manufacturer&apos;s warranty. Warranty terms and durations vary by manufacturer:
              </p>
              <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground">Brand</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground">Warranty Period</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground">Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">Ledger</td>
                      <td className="px-4 py-2.5">2 years</td>
                      <td className="px-4 py-2.5">Manufacturing defects, hardware failure</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">Trezor</td>
                      <td className="px-4 py-2.5">2 years</td>
                      <td className="px-4 py-2.5">Manufacturing defects, hardware failure</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">Keystone</td>
                      <td className="px-4 py-2.5">1 year</td>
                      <td className="px-4 py-2.5">Manufacturing defects, hardware failure</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-foreground">Cryptosteel</td>
                      <td className="px-4 py-2.5">Lifetime</td>
                      <td className="px-4 py-2.5">Manufacturing defects</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Warranty claims should be directed to the respective manufacturer. Morpheye will assist in facilitating warranty claims when needed. Warranties do not cover physical damage, water damage, unauthorized modifications, or tampering.
              </p>
            </div>
          </section>

          {/* 7. Limitation of Liability */}
          <section id="limitation" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="size-5 text-cyan-400" />
              7. Limitation of Liability
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                To the fullest extent permitted by applicable law:
              </p>
              <div className="rounded-lg border border-border bg-card/30 p-5 space-y-3">
                <p>
                  <span className="text-foreground font-medium">No Indirect Damages:</span> Morpheye shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising from your use of the Site or our products.
                </p>
                <p>
                  <span className="text-foreground font-medium">Maximum Liability:</span> In no event shall our total liability to you exceed the amount paid by you for the product or service giving rise to the claim.
                </p>
                <p>
                  <span className="text-foreground font-medium">Crypto Assets:</span> Morpheye is not responsible for the loss, theft, or inaccessibility of any cryptocurrency or digital assets. Hardware wallets are tools for securing private keys — you are solely responsible for safeguarding your recovery phrase and digital assets.
                </p>
                <p>
                  <span className="text-foreground font-medium">As-Is:</span> The Site and products are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied, to the fullest extent permissible under applicable law.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Governing Law */}
          <section id="governing-law" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <Scale className="size-5 text-cyan-400" />
              8. Governing Law
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in San Francisco County, California. You agree to waive any objection to venue in such courts and to service of process by certified mail.
              </p>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect. Our failure to enforce any right or provision of these Terms will not constitute a waiver of such right or provision.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
          <Mail className="size-6 text-cyan-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          Questions About Our Terms?
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          If you have any questions or concerns about these Terms of Service, please contact us.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => navigate('contact')}
            className="bg-cyan-500 text-black hover:bg-cyan-400 px-8"
          >
            Contact Us
          </Button>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variant="outline"
            className="border-border text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/30"
          >
            Back to Top
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
