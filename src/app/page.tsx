'use client'

import { useNavigationStore } from '@/store/navigation-store'
import { StoreHeader } from '@/components/store/store-header'
import { StoreFooter } from '@/components/store/store-footer'
import { HeroSection } from '@/components/store/hero-section'
import { FeaturedSection } from '@/components/store/featured-section'
import { CategoriesSection } from '@/components/store/categories-section'
import { TrustSection } from '@/components/store/trust-section'
import { NewsletterSection } from '@/components/store/newsletter-section'
import { ShopPage } from '@/components/store/shop-page'
import { ProductDetail } from '@/components/store/product-detail'
import { CartPage } from '@/components/store/cart-page'
import { CheckoutPage } from '@/components/store/checkout-page'
import { CheckoutSuccess } from '@/components/store/checkout-success'
import { WishlistPage } from '@/components/store/wishlist-page'
import { ComparisonPage } from '@/components/store/comparison-page'
import { RecentlyViewedSection } from '@/components/store/recently-viewed-section'
import { BrandShowcase } from '@/components/store/brand-showcase'
import { OrderTrackingPage } from '@/components/store/order-tracking-page'
import { ContactPage } from '@/components/store/contact-page'
import { SearchResultsPage } from '@/components/store/search-results-page'
import { CookieConsent } from '@/components/store/cookie-consent'
import { SocialProofNotification } from '@/components/store/social-proof-notification'
import { QuickViewModal } from '@/components/store/quick-view-modal'
import { NotificationToast } from '@/components/store/notification-toast'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AnnouncementBar } from '@/components/store/announcement-bar'
import { MetaPixel } from '@/components/integrations/meta-pixel'
import { AnimatePresence, motion } from 'framer-motion'

const adminPages = ['admin', 'admin-products', 'admin-orders', 'admin-order-detail', 'admin-contact', 'admin-settings']

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <RecentlyViewedSection />
      <CategoriesSection />
      <BrandShowcase />
      <TrustSection />
      <NewsletterSection />
    </>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function Home() {
  const { currentPage } = useNavigationStore()

  const isAdmin = adminPages.includes(currentPage)

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AdminLayout />
        <NotificationToast />
        <MetaPixel />
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'shop':
        return <ShopPage />
      case 'product':
        return <ProductDetail />
      case 'cart':
        return <CartPage />
      case 'checkout':
        return <CheckoutPage />
      case 'checkout-success':
        return <CheckoutSuccess />
      case 'wishlist':
        return <WishlistPage />
      case 'comparison':
        return <ComparisonPage />
      case 'tracking':
        return <OrderTrackingPage />
      case 'contact':
        return <ContactPage />
      case 'search':
        return <SearchResultsPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <StoreHeader />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <StoreFooter />
      <QuickViewModal />
      <CookieConsent />
      <SocialProofNotification />
      <NotificationToast />
      <MetaPixel />
    </div>
  )
}
