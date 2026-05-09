'use client'

import { useAdminAuthStore } from '@/store/admin-auth-store'
import { useNavigationStore } from '@/store/navigation-store'
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminProducts } from '@/components/admin/admin-products'
import { AdminOrders } from '@/components/admin/admin-orders'
import { AdminOrderDetail } from '@/components/admin/admin-order-detail'
import { AdminContact } from '@/components/admin/admin-contact'
import { AdminSettings } from '@/components/admin/admin-settings'
import { AdminWholesale } from '@/components/admin/admin-wholesale'
import { AdminWholesaleRequests } from '@/components/admin/admin-wholesale-requests'
import { AdminEmailCampaigns } from '@/components/admin/admin-email-campaigns'
import { AdminBlog } from '@/components/admin/admin-blog'
import { AdminLoyalty } from '@/components/admin/admin-loyalty'
import { AdminSubscriptions } from '@/components/admin/admin-subscriptions'
import { AdminAbandonedCarts } from '@/components/admin/admin-abandoned-carts'

export function AdminLayout() {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated)
  const currentPage = useNavigationStore((s) => s.currentPage)

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminDashboard />
      case 'admin-products':
        return <AdminProducts />
      case 'admin-orders':
        return <AdminOrders />
      case 'admin-order-detail':
        return <AdminOrderDetail />
      case 'admin-contact':
        return <AdminContact />
      case 'admin-settings':
        return <AdminSettings />
      case 'admin-wholesale':
        return <AdminWholesale />
      case 'admin-wholesale-requests':
        return <AdminWholesaleRequests />
      case 'admin-email-campaigns':
        return <AdminEmailCampaigns />
      case 'admin-blog':
        return <AdminBlog />
      case 'admin-loyalty':
        return <AdminLoyalty />
      case 'admin-subscriptions':
        return <AdminSubscriptions />
      case 'admin-abandoned-carts':
        return <AdminAbandonedCarts />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] md:flex-row">
      <div className="admin-accent-line md:hidden" />
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-gradient-to-b from-neutral-950 to-neutral-900/80">
        <div className="hidden md:block admin-accent-line" />
        <div key={currentPage} className="admin-tab-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
