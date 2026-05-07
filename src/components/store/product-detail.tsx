'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  ShoppingCart,
  Zap,
  Package,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Share2,
  CheckCircle2,
  BadgeCheck,
  Home,
  ChevronDown,
  Lock,
  X,
  Eye,
  Clock,
  Flame,
  Gift,
  PlusCircle,
  Maximize2,
  RotateCw,
  MoveHorizontal,
  HelpCircle,
  MessageCircleQuestion,
  Bell,
  BellRing,
  Mail as MailIcon,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useNotificationStore } from '@/store/notification-store'
import { useRecentlyViewedStore } from '@/store/recently-viewed-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductCard } from './product-card'
import { ProductReviews } from './product-reviews'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  sku?: string | null
  stock: number
  featured?: boolean
  specs: Record<string, string>
  tags: string[]
  rating: number
  reviewCount: number
  category?: { name: string; slug: string }
}

function extractFeatures(product: Product): string[] {
  const features: string[] = []

  if (product.tags && Array.isArray(product.tags)) {
    product.tags.forEach((tag) => {
      if (tag && tag.length > 1) {
        features.push(tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' '))
      }
    })
  }

  if (product.shortDesc) {
    const sentences = product.shortDesc.split(/[.!]/).filter((s) => s.trim().length > 10)
    sentences.slice(0, 3).forEach((s) => {
      features.push(s.trim())
    })
  }

  if (features.length < 3 && product.specs && typeof product.specs === 'object') {
    const specEntries = Object.entries(product.specs)
    specEntries.slice(0, 3).forEach(([key, value]) => {
      features.push(`${key}: ${value}`)
    })
  }

  return [...new Set(features)].slice(0, 6)
}

function getEstimatedDelivery(): { startDate: Date; endDate: Date; startStr: string; endStr: string } {
  const now = new Date()
  const addBusinessDays = (start: Date, days: number): Date => {
    const date = new Date(start)
    let addedDays = 0
    while (addedDays < days) {
      date.setDate(date.getDate() + 1)
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++
      }
    }
    return date
  }

  const startDate = addBusinessDays(now, 5)
  const endDate = addBusinessDays(now, 7)

  const formatShort = (d: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
  }

  return {
    startDate,
    endDate,
    startStr: formatShort(startDate),
    endStr: formatShort(endDate),
  }
}

function LightboxOverlay({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  productName,
}: {
  images: string[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  productName: string
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-card/80 text-foreground transition-colors hover:bg-muted"
        aria-label="Close lightbox"
      >
        <X className="size-5" />
      </button>

      {/* Image counter */}
      <div className="absolute bottom-6 left-6 z-10 rounded-lg bg-black/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
        {activeIndex + 1}/{images.length}
      </div>

      {/* Previous arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-card/80 text-foreground transition-colors hover:bg-muted"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-card/80 text-foreground transition-colors hover:bg-muted"
          aria-label="Next image"
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={activeIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {images[activeIndex] && (
          <Image
            src={images[activeIndex]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            width={1200}
            height={1200}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            sizes="90vw"
          />
        )}
      </motion.div>
    </motion.div>,
    document.body
  )
}

function getProductFAQs(product: Product): { question: string; answer: string }[] {
  const brand = (product.brand || '').toLowerCase()
  const category = (product.category?.name || '').toLowerCase()
  const isHardwareWallet = category.includes('hardware') || category.includes('wallet') || brand.includes('ledger') || brand.includes('trezor') || brand.includes('keystone')
  const isSeedStorage = category.includes('seed') || category.includes('backup') || category.includes('steel') || brand.includes('cryptosteel')
  const isAccessory = category.includes('accessory') || category.includes('cable') || category.includes('case')

  const faqs: { question: string; answer: string }[] = []

  if (isHardwareWallet) {
    faqs.push(
      {
        question: 'Is this compatible with my crypto?',
        answer: `Yes, the ${product.name} supports 1,000+ cryptocurrencies including Bitcoin, Ethereum, Solana, and all ERC-20 tokens. You can check the full list of supported assets on the manufacturer's official website. The device connects via USB-C or Bluetooth (model dependent) and works with both desktop and mobile apps.`
      },
      {
        question: 'Does it come with a warranty?',
        answer: `Yes, the ${product.name} comes with a manufacturer's warranty. ${brand.includes('ledger') ? 'Ledger offers a 2-year warranty on all devices.' : brand.includes('trezor') ? 'Trezor provides a 2-year warranty covering manufacturing defects.' : brand.includes('keystone') ? 'Keystone offers a 1-year warranty on their hardware wallets.' : 'The standard warranty is 1-2 years, covering manufacturing defects.'} Make sure to register your device after purchase to activate the warranty.`
      },
      {
        question: 'How do I set it up?',
        answer: 'Setting up your hardware wallet is straightforward: (1) Unbox and verify the tamper-evident seal is intact. (2) Connect to your computer or phone. (3) Initialize the device and create a new wallet. (4) Write down your 24-word recovery phrase on the provided card — store it offline and never share it. (5) Install the companion app and you\'re ready to send, receive, and manage your crypto securely.'
      },
      {
        question: 'Is it safe to buy a hardware wallet online?',
        answer: `When purchased from an authorized reseller like Morpheye, your device is 100% safe. We source directly from manufacturers, and every device ships in tamper-evident packaging. Always verify the holographic seal upon receipt. Never use a device if the packaging appears tampered with.`
      },
      {
        question: 'What happens if I lose my device?',
        answer: 'If you lose your hardware wallet, your funds are still safe as long as you have your recovery phrase. Simply purchase a new device (any compatible wallet) and restore your wallet using the 24-word recovery phrase. This is why it\'s critical to store your recovery phrase in a secure location — consider using a metal backup solution for fire and water protection.'
      },
      {
        question: 'Can I use this with multiple devices?',
        answer: 'Yes, you can connect your hardware wallet to multiple computers and phones. The wallet itself stores your private keys securely — you simply connect it to whichever device you want to use for transactions. The companion software is available for Windows, macOS, Linux, iOS, and Android.'
      }
    )
  } else if (isSeedStorage) {
    faqs.push(
      {
        question: 'What is a seed phrase backup?',
        answer: 'A seed phrase backup is a physical, offline record of your cryptocurrency wallet\'s recovery phrase. Unlike paper, metal backups like the ' + product.name + ' are resistant to fire, water, and corrosion, ensuring your recovery phrase survives extreme conditions.'
      },
      {
        question: 'How do I set it up?',
        answer: 'Setting up your ' + product.name + ' is simple: (1) Use the included engraving tool or letter tiles to stamp each word of your 24-word recovery phrase. (2) Double-check each word for accuracy. (3) Store the completed backup in a secure, hidden location. The process typically takes 15-30 minutes.'
      },
      {
        question: 'Is it really fire and water proof?',
        answer: `Yes, the ${product.name} is designed to withstand extreme conditions. It can survive temperatures up to 2100°F (1149°C) and prolonged water submersion. This far exceeds the protection offered by paper backups, which can be destroyed by a simple house fire or water damage.`
      },
      {
        question: 'How many words can it store?',
        answer: `The ${product.name} can store a complete 24-word recovery phrase (or 12-word for wallets that use shorter seeds). Each word is represented by its first 4 letters, which is sufficient to uniquely identify each word in the BIP-39 wordlist.`
      },
      {
        question: 'Should I use this instead of a hardware wallet?',
        answer: 'No — you should use both. A hardware wallet secures your private keys for daily transactions, while a metal seed backup protects your recovery phrase for disaster recovery. They complement each other: the hardware wallet is for active use, and the metal backup is your insurance policy.'
      }
    )
  } else if (isAccessory) {
    faqs.push(
      {
        question: 'Is this compatible with my device?',
        answer: `The ${product.name} is designed to be compatible with popular hardware wallets including Ledger, Trezor, and Keystone models. Check the product specifications above for exact compatibility details. If you're unsure, feel free to contact our support team.`
      },
      {
        question: 'Does it come with a warranty?',
        answer: `Yes, the ${product.name} comes with a manufacturer's warranty covering defects in materials and workmanship. Accessories typically carry a 1-year warranty period.`
      },
      {
        question: 'What\'s included in the package?',
        answer: `The ${product.name} ships with everything shown in the product images. Please refer to the specifications section above for detailed package contents. All our products are brand new and come in original manufacturer packaging.`
      }
    )
  }

  // Generic FAQs that apply to all products
  faqs.push(
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused products in their original, unopened packaging. Due to the security-sensitive nature of hardware wallets, opened devices cannot be returned. If your device arrives damaged or defective, contact us immediately for a replacement.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days and is free for orders over $150. Express shipping is available for $9.99 and arrives in 2-3 business days. All orders include tracking and insurance.'
    }
  )

  return faqs
}

function ProductFAQ({ product }: { product: Product }) {
  const faqs = getProductFAQs(product)
  const [openItems, setOpenItems] = useState<string[]>([])

  if (faqs.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-500/10">
          <MessageCircleQuestion className="size-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Customers Ask</h2>
          <p className="text-xs text-muted-foreground">Common questions about this product</p>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
      </div>

      <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-border/60 px-5 hover:bg-muted/20 transition-colors"
            >
              <AccordionTrigger className="text-sm font-medium text-neutral-200 hover:text-cyan-400 hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <HelpCircle className="size-4 shrink-0 text-cyan-500/60" />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4 pl-7">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  )
}

export function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [alsoBought, setAlsoBought] = useState<Product[]>([])
  const [bundleProducts, setBundleProducts] = useState<Product[]>([])
  const [bundleSelections, setBundleSelections] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
  const [heartAnimating, setHeartAnimating] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [liveViewCount, setLiveViewCount] = useState(0)
  const [recentPurchaseCount, setRecentPurchaseCount] = useState(0)
  const [hoursUntilDispatch, setHoursUntilDispatch] = useState(0)
  const [minutesUntilDispatch, setMinutesUntilDispatch] = useState(0)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [stickyBarDismissed, setStickyBarDismissed] = useState(false)
  const [isHoveringGallery, setIsHoveringGallery] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 })
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySubmitted, setNotifySubmitted] = useState(false)
  const [notifyFormOpen, setNotifyFormOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { selectedProductId, navigate } = useNavigationStore()
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const showNotification = useNotificationStore((s) => s.show)
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct)

  // Image auto-rotation (every 3 seconds, pause on hover)
  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || isHoveringGallery || lightboxOpen) return
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [product?.images, isHoveringGallery, lightboxOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  // IntersectionObserver for sticky add-to-cart bar
  useEffect(() => {
    if (!ctaRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px 0px -80px 0px' }
    )
    observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [loading])

  // Live view count - random 12-47, changes every 30s
  useEffect(() => {
    const setRandomViewCount = () => {
      setLiveViewCount(Math.floor(Math.random() * 36) + 12)
    }
    setRandomViewCount()
    const interval = setInterval(setRandomViewCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Recently purchased count - random 1-5
  useEffect(() => {
    setRecentPurchaseCount(Math.floor(Math.random() * 5) + 1)
  }, [])

  // Hours until 5PM dispatch
  useEffect(() => {
    const calculateDispatch = () => {
      const now = new Date()
      const dispatch = new Date(now)
      dispatch.setHours(17, 0, 0, 0) // 5PM today
      if (now >= dispatch) {
        // Already past 5PM, show tomorrow
        setHoursUntilDispatch(0)
        setMinutesUntilDispatch(0)
        return
      }
      const diff = dispatch.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setHoursUntilDispatch(hours)
      setMinutesUntilDispatch(minutes)
    }
    calculateDispatch()
    const interval = setInterval(calculateDispatch, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedProductId) {
      fetchProduct(selectedProductId)
    }
  }, [selectedProductId])

  const fetchProduct = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data.product || data)
        setActiveImage(0)
        setQuantity(1)
        addRecentlyViewed(data.product?.id || data.id)

        const catSlug = data.product?.category?.slug || data.category?.slug
        // Fetch related products (same category)
        if (catSlug) {
          const relRes = await fetch(
            `/api/products?category=${catSlug}&limit=4`
          )
          if (relRes.ok) {
            const relData = await relRes.json()
            setRelated(
              (relData.products || []).filter(
                (p: Product) => p.id !== (data.product?.id || data.id)
              )
            )
          }
        }

        // Fetch "Customers also bought" — featured products excluding current
        const featRes = await fetch('/api/products?featured=true&limit=4')
        if (featRes.ok) {
          const featData = await featRes.json()
          setAlsoBought(
            (featData.products || []).filter(
              (p: Product) => p.id !== (data.product?.id || data.id)
            ).slice(0, 4)
          )
        }

        // Fetch bundle products for "Frequently Bought Together" — related category products
        const bundleRes = await fetch(`/api/products?category=${catSlug || ''}&limit=3&sort=rating`)
        if (bundleRes.ok) {
          const bundleData = await bundleRes.json()
          const filtered = (bundleData.products || []).filter(
            (p: Product) => p.id !== (data.product?.id || data.id)
          ).slice(0, 3)
          setBundleProducts(filtered)
          // Default: all bundle items selected
          const selections: Record<string, boolean> = {}
          selections[data.product?.id || data.id] = true
          filtered.forEach((p: Product) => {
            selections[p.id] = true
          })
          setBundleSelections(selections)
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const toggleBundleSelection = (id: string) => {
    // Don't allow deselecting the current product
    if (id === product?.id) return
    setBundleSelections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getBundleTotal = () => {
    if (!product) return { original: 0, discounted: 0, savings: 0 }
    const currentProductPrice = product.price
    const selectedBundlePrices = bundleProducts
      .filter((p) => bundleSelections[p.id])
      .map((p) => p.price)
    const allPrices = [currentProductPrice, ...selectedBundlePrices]
    const original = allPrices.reduce((sum, p) => sum + p, 0)
    const discounted = original * 0.95 // 5% bundle discount
    const savings = original - discounted
    return { original, discounted, savings }
  }

  const handleAddBundleToCart = () => {
    if (!product) return
    // Add current product
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.slug,
    })
    // Add selected bundle products
    bundleProducts
      .filter((p) => bundleSelections[p.id])
      .forEach((p) => {
        addItem({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || '',
          slug: p.slug,
        })
      })
    const bundleTotal = getBundleTotal()
    showNotification(
      `Bundle added to cart! You saved $${bundleTotal.savings.toFixed(2)}`,
      'success'
    )
  }

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const lightboxPrev = useCallback(() => {
    if (!product?.images) return
    setLightboxIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }, [product?.images])

  const lightboxNext = useCallback(() => {
    if (!product?.images) return
    setLightboxIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }, [product?.images])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Product not found
          </h2>
          <Button
            onClick={() => navigate('shop')}
            className="bg-cyan-500 text-black hover:bg-cyan-400"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)
  const features = extractFeatures(product)

  const stockStatus =
    product.stock <= 0
      ? 'out_of_stock'
      : product.stock <= 5
        ? 'low_stock'
        : 'in_stock'

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : null

  const estimatedDelivery = getEstimatedDelivery()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        slug: product.slug,
      })
    }
    showNotification(`${quantity}x ${product.name} added to cart`, 'success')
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        slug: product.slug,
      })
    }
    navigate('checkout')
  }

  const handleWishlistToggle = () => {
    setHeartAnimating(true)
    setTimeout(() => setHeartAnimating(false), 300)
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      slug: product.slug,
    })
    showNotification(
      inWishlist ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`,
      inWishlist ? 'info' : 'success'
    )
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      showNotification('Link copied to clipboard!', 'success')
    } catch {
      showNotification('Failed to copy link', 'error')
    }
  }

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2 // -1 to 1

    // Parallax effect (subtle movement when not zoomed)
    if (!imageZoom) {
      setParallaxOffset({ x: x * 8, y: y * 8 }) // 8px max offset
    }

    // Zoom effect
    if (imageZoom) {
      setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
    }
  }

  const handleGalleryMouseEnter = () => {
    setIsHoveringGallery(true)
    setImageZoom(true)
  }

  const handleGalleryMouseLeave = () => {
    setIsHoveringGallery(false)
    setImageZoom(false)
    setParallaxOffset({ x: 0, y: 0 })
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Breadcrumb">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1 transition-colors hover:text-cyan-400"
        >
          <Home className="size-3.5" />
          Home
        </button>
        <ChevronDown className="-rotate-90 size-3" />
        <button
          onClick={() => navigate('shop')}
          className="transition-colors hover:text-cyan-400"
        >
          Shop
        </button>
        {product.category && (
          <>
            <ChevronDown className="-rotate-90 size-3" />
            <button
              onClick={() => navigate('shop', { category: product.category!.slug })}
              className="transition-colors hover:text-cyan-400"
            >
              {product.category.name}
            </button>
          </>
        )}
        <ChevronDown className="-rotate-90 size-3" />
        <span className="max-w-[200px] truncate text-muted-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div
            className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card"
            onMouseEnter={handleGalleryMouseEnter}
            onMouseLeave={handleGalleryMouseLeave}
            onMouseMove={handleImageMouseMove}
            style={{ cursor: imageZoom ? 'crosshair' : undefined }}
          >
            {product.images?.[activeImage] && !imgErrors[activeImage] ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: imageZoom ? 0 : parallaxOffset.x,
                    y: imageZoom ? 0 : parallaxOffset.y,
                  }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-200 ${
                      imageZoom ? 'scale-150' : 'scale-100'
                    }`}
                    style={imageZoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [activeImage]: true }))
                    }
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="size-20 text-muted-foreground" />
              </div>
            )}

            {/* Image Count Badge */}
            {product.images && product.images.length > 1 && (
              <div className="pointer-events-none absolute top-3 left-3 z-20 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {activeImage + 1}/{product.images.length}
              </div>
            )}

            {/* Full Screen Button */}
            {product.images?.[activeImage] && !imgErrors[activeImage] && (
              <button
                onClick={() => openLightbox(activeImage)}
                className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:scale-105"
                aria-label="Open full-screen image view"
              >
                <Maximize2 className="size-4" />
              </button>
            )
            }

            {/* 360° View Placeholder Button */}
            {product.images && product.images.length > 2 && (
              <button
                className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:text-foreground"
                aria-label="360 degree view (coming soon)"
                title="Coming soon"
              >
                <RotateCw className="size-3" />
                360° View
              </button>
            )}

            {/* Zoom indicator */}
            {imageZoom && product.images?.[activeImage] && !imgErrors[activeImage] && (
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
                Zoom
              </div>
            )}

            {/* Click to open lightbox on image area (not on buttons) */}
            {product.images?.[activeImage] && !imgErrors[activeImage] && (
              <button
                onClick={() => openLightbox(activeImage)}
                className="absolute inset-0 z-10 cursor-zoom-in"
                aria-label="Open full-screen image view"
              />
            )}

            {/* Navigation arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}

            {/* Swipe hint on mobile */}
            {isMobile && product.images && product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm sm:hidden">
                <MoveHorizontal className="size-3" />
                Swipe for more
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {product.images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    i === activeImage
                      ? 'border-cyan-500 shadow-md shadow-cyan-500/20'
                      : 'border-border hover:border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  {!imgErrors[i] ? (
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [i]: true }))
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <Package className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  {/* Active indicator line */}
                  {i === activeImage && (
                    <motion.div
                      layoutId="thumbnail-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Featured */}
          <div className="flex items-center gap-2">
            {product.brand && (
              <button
                onClick={() => navigate('shop', { brand: product.brand! })}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
              >
                {product.brand}
              </button>
            )}
            {product.featured && (
              <Badge className="bg-cyan-500 text-black">Featured</Badge>
            )}
            {discount && (
              <Badge className="bg-amber-500 text-black">
                Save {discount}%
              </Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {product.name}
          </h1>

          {/* Live View Count */}
          {liveViewCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="size-2 rounded-full bg-cyan-400"
                />
                <Eye className="size-3 text-cyan-400" />
                <span className="text-xs font-medium text-cyan-400">
                  {liveViewCount} people viewing this right now
                </span>
              </div>
            </motion.div>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-sm leading-relaxed text-muted-foreground">{product.shortDesc}</p>
          )}

          {/* Key Features */}
          {features.length > 0 && (
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Key Features</h3>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price - Animated highlight for high discounts */}
          <div className="flex items-baseline gap-3">
            <motion.span
              key={`price-${discount}`}
              initial={discount && discount > 20 ? { scale: 1, color: '#06b6d4' } : false}
              animate={discount && discount > 20 ? { scale: [1, 1.12, 1], color: ['#06b6d4', '#22d3ee', '#06b6d4'] } : {}}
              transition={discount && discount > 20 ? { duration: 0.8, ease: 'easeInOut' } : {}}
              className="text-3xl font-bold text-cyan-400"
            >
              ${product.price.toFixed(2)}
            </motion.span>
            {product.comparePrice &&
              product.comparePrice > product.price && (
                <span className="text-lg text-neutral-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            {discount && discount > 20 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4, type: 'spring', stiffness: 300 }}
                className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400 border border-red-500/25"
              >
                🔥 {discount}% OFF
              </motion.span>
            )}
          </div>

          {/* Stock - More Prominent */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card/30 px-4 py-3">
            <div
              className={`size-3 rounded-full ${
                stockStatus === 'in_stock'
                  ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                  : stockStatus === 'low_stock'
                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                stockStatus === 'in_stock'
                  ? 'text-cyan-400'
                  : stockStatus === 'low_stock'
                    ? 'text-amber-500'
                    : 'text-red-500'
              }`}
            >
              {stockStatus === 'in_stock'
                ? 'In Stock — Ready to Ship'
                : stockStatus === 'low_stock'
                  ? `Low Stock — Only ${product.stock} left!`
                  : 'Out of Stock'}
            </span>
          </div>

          {/* Out of Stock - Notify Me */}
          {stockStatus === 'out_of_stock' && (
            <div className="space-y-3">
              <button
                onClick={() => setNotifyFormOpen(!notifyFormOpen)}
                className="group flex w-full items-center gap-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-teal-500/5 px-5 py-4 transition-all duration-300 hover:border-cyan-500/50 hover:from-cyan-500/15 hover:to-teal-500/10"
              >
                <div className="relative flex size-10 items-center justify-center rounded-full bg-cyan-500/10">
                  <Bell className="size-5 text-cyan-400" />
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">Notify Me When Available</p>
                  <p className="text-xs text-muted-foreground">Get an email when this product is back in stock</p>
                </div>
                <ChevronDown className={`size-5 text-cyan-400 transition-transform duration-200 ${notifyFormOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {notifyFormOpen && !notifySubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <BellRing className="size-4 text-cyan-400" />
                        <span className="text-sm font-medium text-foreground">Back-in-Stock Notification</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter your email and we&apos;ll notify you as soon as the {product.name} is back in stock.
                      </p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="email"
                            value={notifyEmail}
                            onChange={(e) => setNotifyEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="border-border bg-muted pl-9 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30 h-10 text-sm"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (notifyEmail.trim() && /\S+@\S+\.\S+/.test(notifyEmail)) {
                              setNotifySubmitted(true)
                              showNotification('You\'ll be notified when this product is back in stock!', 'success')
                            } else {
                              showNotification('Please enter a valid email address', 'error')
                            }
                          }}
                          className="bg-cyan-500 text-black hover:bg-cyan-400 px-6"
                        >
                          Notify Me
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {notifySubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">You&apos;re on the list!</p>
                        <p className="text-xs text-muted-foreground">
                          We&apos;ll email <span className="text-cyan-400">{notifyEmail}</span> when this product is back in stock.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Recently Purchased & Dispatch Timer */}
          {stockStatus !== 'out_of_stock' && (
            <div className="flex flex-col gap-2">
              {/* Recently Purchased */}
              {recentPurchaseCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-2.5">
                  <Flame className="size-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-300">
                    {recentPurchaseCount} {recentPurchaseCount === 1 ? 'person' : 'people'} bought this in the last 24 hours
                  </span>
                </div>
              )}

              {/* Dispatch Timer */}
              {hoursUntilDispatch > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-4 py-2.5">
                  <Clock className="size-4 text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-300">
                    Order within <span className="font-bold text-cyan-400">{hoursUntilDispatch}h {minutesUntilDispatch}m</span> for guaranteed dispatch today
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Estimated Delivery - Enhanced */}
          {stockStatus !== 'out_of_stock' && (
            <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
              {/* Standard Delivery */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Truck className="size-4 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      Free Standard Shipping
                    </span>
                    <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                      FREE
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Estimated delivery: <span className="text-muted-foreground font-medium">{estimatedDelivery.startStr} - {estimatedDelivery.endStr}</span>
                  </span>
                </div>
              </div>
              <div className="mx-4 h-px bg-muted/60" />
              {/* Free Shipping Threshold */}
              <div className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Orders over <span className="font-semibold text-emerald-400">$150.00</span> qualify for free shipping
                  {product.price >= 150 ? (
                    <span className="ml-1 font-semibold text-emerald-400">✓ You qualify!</span>
                  ) : (
                    <span className="ml-1 text-muted-foreground">Add ${(150 - product.price).toFixed(2)} more</span>
                  )}
                </span>
              </div>
              <div className="mx-4 h-px bg-muted/60" />
              {/* Express Shipping */}
              <div className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                  <Zap className="size-3.5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Express Shipping</span>
                    <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                      $9.99
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">2-3 business days</span>
                </div>
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Quantity:</span>
              {/* Premium Quantity Selector */}
              <div className="flex items-center overflow-hidden rounded-xl border border-border bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex w-12 items-center justify-center border-x border-border/50 text-sm font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock || 99, quantity + 1))
                  }
                  className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div ref={ctaRef} className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAddToCart}
                disabled={stockStatus === 'out_of_stock'}
                size="lg"
                className="flex-1 bg-cyan-500 text-base font-semibold text-black hover:bg-cyan-400 transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="size-5" />
                      Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="size-5" />
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={stockStatus === 'out_of_stock'}
                size="lg"
                className="flex-1 bg-amber-500 text-base font-semibold text-black hover:bg-amber-600"
              >
                <Zap className="mr-2 size-5" />
                Buy Now
              </Button>
            </div>

            {/* Wishlist + Share Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                className={`flex-1 border-border ${
                  inWishlist
                    ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300'
                    : 'text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={inWishlist ? 'filled' : 'outline'}
                    initial={{ scale: heartAnimating ? 1.3 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      className={`size-4 ${
                        inWishlist ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    {inWishlist ? 'Saved' : 'Save for Later'}
                  </motion.span>
                </AnimatePresence>
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 border-border text-muted-foreground hover:border-border hover:text-foreground"
              >
                <Share2 className="mr-2 size-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Guaranteed Authentic Badge */}
          <div className="flex items-center gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <BadgeCheck className="size-5 shrink-0 text-cyan-400" />
            <div>
              <span className="text-sm font-semibold text-cyan-400">Guaranteed Authentic</span>
              <p className="text-xs text-muted-foreground">100% genuine products with full warranty</p>
            </div>
          </div>

          {/* Secure Checkout Badge */}
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <Lock className="size-5 shrink-0 text-emerald-400" />
            <div>
              <span className="text-sm font-semibold text-emerald-400">Secure Checkout</span>
              <p className="text-xs text-muted-foreground">256-bit SSL encrypted payment processing</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-card/50 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="size-4 text-cyan-400" />
              Authorized Reseller
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="size-4 text-cyan-400" />
              Secure Shipping
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="size-4 text-cyan-400" />
              Free Returns
            </div>
          </div>

          <Separator className="bg-muted" />

          {/* Specifications - Enhanced with alternating rows, bold labels, cyan left border */}
          {product.specs &&
            typeof product.specs === 'object' &&
            Object.keys(product.specs).length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-cyan-500/10">
                    <Zap className="size-3.5 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Specifications
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                </div>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <tr
                          key={key}
                          className={`border-b border-border/50 last:border-0 transition-colors hover:bg-cyan-500/[0.03] ${
                            index % 2 === 0 ? 'bg-card/80' : 'bg-muted/30'
                          }`}
                        >
                          <td className="px-4 py-3 w-2/5 border-l-2 border-l-cyan-500/40 font-semibold text-foreground">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Description Accordion */}
          {product.description && (
            <Accordion type="single" collapsible>
              <AccordionItem value="description" className="border-border">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-cyan-400">
                  Full Description
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-invert prose-sm max-w-none text-muted-foreground">
                    {product.description}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Customers Also Bought */}
      {alsoBought.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">
              Customers Also Bought
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alsoBought.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Frequently Bought Together */}
      {bundleProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <div className="mb-6 flex items-center gap-3">
            <Gift className="size-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-foreground">
              Frequently Bought Together
            </h2>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px] font-bold">
              5% BUNDLE DISCOUNT
            </Badge>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-4 sm:p-6">
            {/* Product cards with + symbols */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-0 sm:justify-center">
              {/* Current Product */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all w-full sm:w-auto ${
                  bundleSelections[product.id]
                    ? 'border-cyan-500/30 bg-cyan-500/5'
                    : 'border-border bg-card/50 opacity-60'
                }`}
              >
                <Checkbox
                  checked={bundleSelections[product.id]}
                  disabled
                  className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs font-bold text-cyan-400">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>

              {/* Bundle Products with + symbols */}
              {bundleProducts.map((bp, idx) => (
                <div key={bp.id} className="flex items-center gap-3 w-full sm:w-auto">
                  <PlusCircle className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-all w-full sm:w-auto cursor-pointer ${
                      bundleSelections[bp.id]
                        ? 'border-cyan-500/30 bg-cyan-500/5'
                        : 'border-border bg-card/50 opacity-60'
                    }`}
                    onClick={() => toggleBundleSelection(bp.id)}
                  >
                    <Checkbox
                      checked={bundleSelections[bp.id] || false}
                      onCheckedChange={() => toggleBundleSelection(bp.id)}
                      className="border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      {bp.images?.[0] ? (
                        <img
                          src={bp.images[0]}
                          alt={bp.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package className="size-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">{bp.name}</p>
                      <p className="text-xs font-bold text-cyan-400">${bp.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Bundle Total & Add to Cart */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-muted/40 p-4 sm:flex-row">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Price:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg text-neutral-500 line-through">
                      ${getBundleTotal().original.toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold text-cyan-400">
                      ${getBundleTotal().discounted.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  Save ${getBundleTotal().savings.toFixed(2)}
                </Badge>
              </div>
              <Button
                onClick={handleAddBundleToCart}
                className="w-full sm:w-auto bg-cyan-500 px-8 text-black font-semibold hover:bg-cyan-400 transition-all"
              >
                <ShoppingCart className="mr-2 size-4" />
                Add All to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Product Reviews */}
      {product && <ProductReviews productId={product.id} />}

      {/* Customers Ask - Product FAQ */}
      {product && <ProductFAQ product={product} />}

      {/* Image Lightbox */}
      {mounted && lightboxOpen && product.images && product.images.length > 0 && (
        <AnimatePresence>
          <LightboxOverlay
            images={product.images}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={lightboxPrev}
            onNext={lightboxNext}
            productName={product.name}
          />
        </AnimatePresence>
      )}
    </motion.div>

    {/* Sticky Add-to-Cart Bar */}
    {stockStatus !== 'out_of_stock' && (
      <AnimatePresence>
        {showStickyBar && !stickyBarDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 dark:bg-card bg-white/95 backdrop-blur-lg"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              {/* Product Info */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={`size-2 shrink-0 rounded-full ${
                    stockStatus === 'in_stock'
                      ? 'bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                      : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                  }`}
                />
                <p className="truncate text-sm font-medium text-foreground sm:max-w-xs">
                  {product.name}
                </p>
                <span className="shrink-0 text-sm font-bold text-cyan-400">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  onClick={handleAddToCart}
                  size="sm"
                  className="bg-cyan-500 text-sm font-semibold text-black hover:bg-cyan-400"
                >
                  <ShoppingCart className="mr-1.5 size-4" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  size="sm"
                  variant="outline"
                  className="border-cyan-500/40 text-sm font-semibold text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Zap className="mr-1.5 size-4" />
                  Buy Now
                </Button>
                <button
                  onClick={() => setStickyBarDismissed(true)}
                  className="ml-1 flex size-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close sticky bar"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )}
    </>
  )
}
