'use client'

import { useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { NotificationToast } from '@/components/store/notification-toast'
import { MetaPixel } from '@/components/integrations/meta-pixel'
import { useNavigationStore } from '@/store/navigation-store'

export default function AdminPage() {
  const navigate = useNavigationStore((s) => s.navigate)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      navigate(hash as Parameters<typeof navigate>[0])
    } else {
      navigate('admin' as Parameters<typeof navigate>[0])
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminLayout />
      <NotificationToast />
      <MetaPixel />
    </div>
  )
}
