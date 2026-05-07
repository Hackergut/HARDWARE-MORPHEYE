'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Mail,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { useNavigationStore, type Page } from '@/store/navigation-store'
import { useAdminAuthStore } from '@/store/admin-auth-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navItems: { icon: React.ElementType; label: string; page: Page }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'admin' },
  { icon: Package, label: 'Products', page: 'admin-products' },
  { icon: ShoppingCart, label: 'Orders', page: 'admin-orders' },
  { icon: Mail, label: 'Messages', page: 'admin-contact' },
  { icon: Settings, label: 'Settings', page: 'admin-settings' },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { navigate, currentPage } = useNavigationStore()
  const logout = useAdminAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('home')
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 p-3 md:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Morpheye"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-sm font-bold text-white">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-neutral-400"
        >
          {collapsed ? <Menu className="size-5" /> : <X className="size-5" />}
        </Button>
      </div>

      {/* Mobile nav dropdown */}
      {!collapsed && (
        <div className="border-b border-neutral-800 bg-neutral-900 md:hidden">
          <nav className="flex flex-col p-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.page
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    navigate(item.page)
                    setCollapsed(true)
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
            <Separator className="my-2 bg-neutral-800" />
            <button
              onClick={() => {
                navigate('home')
                setCollapsed(true)
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to Store
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-neutral-800 md:bg-neutral-900">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-neutral-800 px-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Shield className="size-4 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Image
                src="/images/logo.png"
                alt="Morpheye"
                width={20}
                height={20}
                className="rounded"
              />
              <span className="text-sm font-bold text-white">Morpheye</span>
            </div>
            <span className="text-[10px] font-medium tracking-wider text-neutral-500 uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.page
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-800 p-3 space-y-1">
          <button
            onClick={() => navigate('home')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Store
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
