'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  ShieldCheck,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  Info,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  icon: React.ElementType
  items: FAQItem[]
}

const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    title: 'General',
    icon: Info,
    items: [
      {
        question: 'What is Morpheye?',
        answer: 'Morpheye is an authorized reseller of hardware cryptocurrency wallets and security devices. We partner directly with leading manufacturers like Ledger, Trezor, Keystone, and Cryptosteel to provide genuine, factory-sealed products to customers worldwide. Our mission is to make crypto security accessible and trustworthy.',
      },
      {
        question: 'Are your products authentic?',
        answer: 'Absolutely. All products sold on Morpheye are sourced directly from manufacturers or their authorized distributors. Every device ships in original, tamper-evident packaging. We are a verified authorized reseller, and our supply chain is fully traceable. We never sell refurbished, used, or tampered devices.',
      },
      {
        question: 'How is Morpheye different from buying directly from the manufacturer?',
        answer: 'While manufacturer direct stores are great, Morpheye offers several advantages: competitive pricing through bulk purchasing, bundled deals and exclusive discounts, faster regional shipping in many areas, dedicated customer support familiar with multiple brands, and the convenience of comparing products from different manufacturers in one place.',
      },
      {
        question: 'Do you offer product bundles?',
        answer: 'Yes! We frequently offer curated bundles that combine complementary products — such as a hardware wallet paired with a metal seed backup — at a discounted price. Check our shop page or homepage for current bundle deals. Bundles are a great way to save money while ensuring complete crypto security.',
      },
      {
        question: 'Can I trust Morpheye with my crypto security needs?',
        answer: 'Your security is our top priority. As an authorized reseller, we adhere to strict supply chain security protocols. Devices are never opened, modified, or tampered with. We recommend that every customer verify the tamper-evident seals upon receipt. We also provide detailed setup guides and security best practices to help you get started safely.',
      },
    ],
  },
  {
    id: 'products-security',
    title: 'Products & Security',
    icon: ShieldCheck,
    items: [
      {
        question: 'What is a hardware wallet and do I need one?',
        answer: 'A hardware wallet is a physical device that stores your cryptocurrency private keys offline, away from internet-connected threats like hackers and malware. If you hold any significant amount of cryptocurrency, a hardware wallet is considered essential for security. Software wallets and exchange accounts are vulnerable to online attacks — a hardware wallet keeps your keys air-gapped and secure.',
      },
      {
        question: 'Which hardware wallet should I buy?',
        answer: 'The best wallet depends on your needs. Ledger Nano X is great for mobile users with Bluetooth support and a large coin selection. Trezor Model T offers an open-source design with a touchscreen. Keystone Pro provides air-gapped security with QR code signing. For budget options, the Ledger Nano S Plus and Trezor One are excellent choices. Our product pages include detailed comparison charts to help you decide.',
      },
      {
        question: 'What is a seed phrase backup and why do I need one?',
        answer: 'A seed phrase (recovery phrase) is a list of 12 or 24 words that can restore your crypto wallet if your device is lost, stolen, or damaged. A metal seed backup (like Cryptosteel) protects this phrase from fire, water, and physical damage. Without a secure backup, losing your hardware wallet could mean losing access to your crypto forever.',
      },
      {
        question: 'Can a hardware wallet be hacked?',
        answer: 'Hardware wallets are designed to keep your private keys offline and are extremely resistant to remote hacking. The most common attack vectors involve social engineering (tricking you into entering your seed phrase on a fake website) or physical tampering before you receive the device. Always buy from authorized resellers like Morpheye and verify tamper-evident seals upon receipt.',
      },
      {
        question: 'Do hardware wallets support all cryptocurrencies?',
        answer: 'Most modern hardware wallets support 1,000+ cryptocurrencies including Bitcoin, Ethereum, all ERC-20 tokens, and many other blockchains. However, support varies by device. Check each product\'s specifications for the complete list of supported assets. If you hold a specific altcoin, verify compatibility before purchasing.',
      },
    ],
  },
  {
    id: 'orders-shipping',
    title: 'Orders & Shipping',
    icon: Truck,
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 5-7 business days and is free for orders over $150. Express shipping is available for $9.99 and arrives in 2-3 business days. All orders include tracking information and shipping insurance. Processing time is typically 1 business day, and we ship on business days only (Monday through Friday, excluding holidays).',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. During checkout, you will see available shipping options and costs for your region. Please note that customers are responsible for any customs duties, import taxes, or fees charged by their country.',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order using our Order Tracking page — just enter your order number (format: MRP-XXXXXXXX-XXXX) to see real-time status updates. If you have any issues with tracking, please contact our support team.',
      },
      {
        question: 'What if my package is lost or damaged?',
        answer: 'All shipments include insurance. If your package is lost in transit or arrives damaged, contact us immediately at support@morpheye.com. We will investigate with the carrier and either reship your order or issue a full refund. For damaged packages, please take photos of the packaging and product before contacting us — this helps expedite the claim process.',
      },
      {
        question: 'Can I change my shipping address after placing an order?',
        answer: 'If your order hasn\'t been shipped yet, we may be able to update the shipping address. Please contact us immediately at support@morpheye.com with your order number and the correct address. Once an order has been shipped, we cannot change the delivery address. In that case, you may need to coordinate with the shipping carrier for redirection.',
      },
    ],
  },
  {
    id: 'returns-warranty',
    title: 'Returns & Warranty',
    icon: RotateCcw,
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for unused products in their original, unopened packaging. Due to the security-sensitive nature of hardware wallets, opened or initialized devices cannot be returned. If your device arrives damaged, defective, or with a broken tamper seal, contact us immediately for a replacement. Returns must be authorized before shipping — contact support to initiate a return.',
      },
      {
        question: 'How do I initiate a return?',
        answer: 'To start a return, email support@morpheye.com with your order number and reason for the return. Our team will review your request and, if approved, provide a return shipping label and instructions. Please do not ship items back without authorization. Refunds are processed within 5-10 business days after we receive and inspect the returned item.',
      },
      {
        question: 'What warranty coverage do you offer?',
        answer: 'All products come with their manufacturer\'s warranty, which typically ranges from 1-2 years depending on the brand. Ledger offers a 2-year warranty, Trezor provides a 2-year warranty, and Keystone offers a 1-year warranty. These warranties cover manufacturing defects and hardware failures under normal use. Physical damage, water damage, and tampering are not covered.',
      },
      {
        question: 'How do I claim a warranty replacement?',
        answer: 'For warranty claims, contact the manufacturer\'s support team directly using the information provided in your product\'s packaging. They will guide you through their warranty process. If you need assistance or have trouble reaching the manufacturer, our support team can help facilitate the process.',
      },
      {
        question: 'What should I do if my device arrives with a broken seal?',
        answer: 'Do NOT use or initialize a device that arrives with a broken or tampered seal. This is a critical security concern. Contact us immediately at support@morpheye.com with photos of the packaging and seal. We will send a replacement device at no cost and arrange for the return of the tampered device. Your security is our top priority.',
      },
    ],
  },
  {
    id: 'payment-billing',
    title: 'Payment & Billing',
    icon: CreditCard,
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit and debit cards (Visa, Mastercard, American Express), PayPal, and select cryptocurrency payments (Bitcoin, Ethereum, and stablecoins). All transactions are processed securely using 256-bit SSL encryption. We never store your full payment card details on our servers.',
      },
      {
        question: 'Is it safe to pay with cryptocurrency?',
        answer: 'Yes, cryptocurrency payments are processed through a secure, reputable payment processor. You will be given a unique wallet address and exact amount to send. The transaction is verified on the blockchain, and your order is confirmed once the payment receives sufficient confirmations. This process is trustless and secure.',
      },
      {
        question: 'Can I use a promo or discount code?',
        answer: 'Yes! We regularly offer promo codes through our newsletter, social media, and special promotions. Enter your code during checkout in the promo code field. Promo codes cannot be combined with other offers unless explicitly stated. Check our homepage and subscribe to our newsletter for the latest deals.',
      },
      {
        question: 'When will I be charged for my order?',
        answer: 'Your payment method is charged at the time of order placement. For cryptocurrency payments, the exchange rate is locked at the time of checkout for a limited window. If payment is not received within that window, you may need to recalculate at the current rate. We do not charge your card until the order is confirmed.',
      },
      {
        question: 'Do you offer financing or installment payments?',
        answer: 'We currently do not offer direct financing options. However, if you pay with a credit card that supports installment plans (like certain Visa or Mastercard offerings), you may be able to set up installments through your card issuer. We are exploring partnerships with financing providers and hope to offer this option in the future.',
      },
    ],
  },
]

export function FAQPage() {
  const { navigate } = useNavigationStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return faqCategories
      .map((category) => {
        if (activeCategory && category.id !== activeCategory) return null

        const filteredItems = query
          ? category.items.filter(
              (item) =>
                item.question.toLowerCase().includes(query) ||
                item.answer.toLowerCase().includes(query)
            )
          : category.items

        if (filteredItems.length === 0) return null

        return { ...category, items: filteredItems }
      })
      .filter(Boolean) as FAQCategory[]
  }, [searchQuery, activeCategory])

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10"
        >
          <HelpCircle className="size-7 text-cyan-400" />
        </motion.div>
        <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground">
          Find answers to common questions about our products, orders, and services.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 border-border bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30 focus-visible:shadow-[0_0_16px_rgba(6,182,212,0.1)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            !activeCategory
              ? 'border-cyan-500 bg-cyan-500 text-black'
              : 'border-border bg-card text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400'
          }`}
        >
          All Topics
        </button>
        {faqCategories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              setActiveCategory(activeCategory === category.id ? null : category.id)
            }
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              activeCategory === category.id
                ? 'border-cyan-500 bg-cyan-500 text-black'
                : 'border-border bg-card text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400'
            }`}
          >
            <category.icon className="size-3.5" />
            {category.title}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="mb-4 text-sm text-muted-foreground">
          Found <span className="font-semibold text-cyan-400">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {/* FAQ Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory || 'all'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-8"
        >
          {filteredCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: catIndex * 0.08 }}
            >
              {/* Category Header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
                  <category.icon className="size-4 text-cyan-400" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {category.title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
              </div>

              {/* Questions */}
              <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
                <Accordion type="multiple">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      value={`${category.id}-${itemIndex}`}
                      className="border-border/60 px-5 hover:bg-muted/20 transition-colors"
                    >
                      <AccordionTrigger className="text-sm font-medium text-neutral-200 hover:text-cyan-400 hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left">
                          <ChevronDown className="size-4 shrink-0 text-cyan-500/40 transition-transform duration-200" />
                          <span>{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4 pl-7">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          ))}

          {filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <HelpCircle className="mx-auto mb-4 size-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No results found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or browse a different category.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory(null)
                }}
                variant="outline"
                className="mt-4 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Still Have Questions CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
          <MessageCircle className="size-6 text-cyan-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          Still Have Questions?
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Our support team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
        </p>
        <Button
          onClick={() => navigate('contact')}
          className="bg-cyan-500 text-black hover:bg-cyan-400 px-8"
        >
          Contact Support
        </Button>
      </motion.div>
    </motion.div>
  )
}
