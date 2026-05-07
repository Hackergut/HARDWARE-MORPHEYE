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
import { NotificationToast } from '@/components/store/notification-toast'
import { AdminLayout } from '@/components/admin/admin-layout'
import { MetaPixel } from '@/components/integrations/meta-pixel'

const adminPages = ['admin', 'admin-products', 'admin-orders', 'admin-contact', 'admin-settings']

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <TrustSection />
      <NewsletterSection />
    </>
  )
}

export default function Home() {
  const { currentPage } = useNavigationStore()

  const isAdmin = adminPages.includes(currentPage)

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
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
      default:
        return <HomePage />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <StoreHeader />
      <main className="flex-1">{renderPage()}</main>
      <StoreFooter />
      <NotificationToast />
      <MetaPixel />
    </div>
  )
}
