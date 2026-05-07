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
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] md:flex-row">
      {/* Cyan accent line at top */}
      <div className="admin-accent-line md:hidden" />
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-gradient-to-b from-neutral-950 to-neutral-900/80">
        {/* Desktop accent line */}
        <div className="hidden md:block admin-accent-line" />
        <div key={currentPage} className="admin-tab-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
