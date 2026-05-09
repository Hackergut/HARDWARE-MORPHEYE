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
import { DealOfTheDay } from '@/components/store/deal-of-the-day'
import { OrderTrackingPage } from '@/components/store/order-tracking-page'
import { ContactPage } from '@/components/store/contact-page'
import { FAQPage } from '@/components/store/faq-page'
import { PrivacyPolicyPage } from '@/components/store/privacy-policy-page'
import { TermsPage } from '@/components/store/terms-page'
import { NotFoundPage } from '@/components/store/not-found-page'
import { SearchResultsPage } from '@/components/store/search-results-page'
import { CookieConsent } from '@/components/store/cookie-consent'
import { SocialProofNotification } from '@/components/store/social-proof-notification'
import { QuickViewModal } from '@/components/store/quick-view-modal'
import { NotificationToast } from '@/components/store/notification-toast'
import { AnnouncementBar } from '@/components/store/announcement-bar'
import { MetaPixel } from '@/components/integrations/meta-pixel'
import { FlashPromoBanner } from '@/components/store/flash-promo-banner'
import { CategoryShowcaseBanner } from '@/components/store/category-showcase-banner'
import { TrustSecurityBanner } from '@/components/store/trust-security-banner'
import { CryptoCtaBanner } from '@/components/store/crypto-cta-banner'
import { WholesalePage } from '@/components/store/wholesale-page'
import { WholesaleApplyPage } from '@/components/store/wholesale-apply-page'
import { LoyaltyPage } from '@/components/store/loyalty-page'
import { SubscriptionsPage } from '@/components/store/subscriptions-page'
import { BlogPage } from '@/components/store/blog-page'
import { BlogPostPage } from '@/components/store/blog-post-page'
import { ExitIntentPopup } from '@/components/store/exit-intent-popup'
import { CartAbandonmentTracker } from '@/components/store/cart-abandonment-tracker'
import { CurrencySelector } from '@/components/store/currency-selector'
import { AnimatePresence, motion } from 'framer-motion'

import { FeaturesSection } from '@/components/store/features-section'
import { ProductShowcaseSection } from '@/components/store/product-showcase-section'
import { TrustSectionV2 } from '@/components/store/trust-section-v2'
import { PageTransition } from '@/components/store/page-transition'

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductShowcaseSection />
      <TrustSectionV2 />
      <FlashPromoBanner />
      <FeaturedSection />
      <CategoryShowcaseBanner />
      <RecentlyViewedSection />
      <DealOfTheDay />
      <BrandShowcase />
      <TrustSecurityBanner />
      <CryptoCtaBanner />
    </>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
}

export default function Home() {
  const { currentPage } = useNavigationStore()

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
      case 'faq':
        return <FAQPage />
      case 'privacy':
        return <PrivacyPolicyPage />
      case 'terms':
        return <TermsPage />
      case 'wholesale':
        return <WholesalePage />
      case 'wholesale-apply':
        return <WholesaleApplyPage />
      case 'loyalty':
        return <LoyaltyPage />
      case 'subscriptions':
        return <SubscriptionsPage />
      case 'blog':
        return <BlogPage />
      case 'blog-post':
        return <BlogPostPage />
      default:
        return <NotFoundPage />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <StoreHeader />
      <main className="flex-1">
        <PageTransition>
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </PageTransition>
      </main>
      <StoreFooter />
      <QuickViewModal />
      <CookieConsent />
      <SocialProofNotification />
      <NotificationToast />
      <ExitIntentPopup />
      <CartAbandonmentTracker />
      <MetaPixel />
    </div>
  )
}
