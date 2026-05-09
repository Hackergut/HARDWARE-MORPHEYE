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
  User,
  Users,
  Send,
  FileText,
  Award,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { useNavigationStore, type Page } from '@/store/navigation-store'
import { useAdminAuthStore } from '@/store/admin-auth-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navItems: { icon: React.ElementType; label: string; page: Page; activeFor: Page[] }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'admin', activeFor: ['admin'] },
  { icon: Package, label: 'Products', page: 'admin-products', activeFor: ['admin-products'] },
  { icon: ShoppingCart, label: 'Orders', page: 'admin-orders', activeFor: ['admin-orders', 'admin-order-detail'] },
  { icon: Users, label: 'Wholesale', page: 'admin-wholesale', activeFor: ['admin-wholesale', 'admin-wholesale-requests'] },
  { icon: Send, label: 'Email Campaigns', page: 'admin-email-campaigns', activeFor: ['admin-email-campaigns'] },
  { icon: Trash2, label: 'Abandoned Carts', page: 'admin-abandoned-carts', activeFor: ['admin-abandoned-carts'] },
  { icon: FileText, label: 'Blog', page: 'admin-blog', activeFor: ['admin-blog'] },
  { icon: Award, label: 'Loyalty', page: 'admin-loyalty', activeFor: ['admin-loyalty'] },
  { icon: RefreshCw, label: 'Subscriptions', page: 'admin-subscriptions', activeFor: ['admin-subscriptions'] },
  { icon: Mail, label: 'Messages', page: 'admin-contact', activeFor: ['admin-contact'] },
  { icon: Settings, label: 'Settings', page: 'admin-settings', activeFor: ['admin-settings'] },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const { navigate, currentPage } = useNavigationStore()
  const logout = useAdminAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('home')
  }

  const isActive = (item: typeof navItems[number]) => {
    return item.activeFor.includes(currentPage)
  }

  return (
    <TooltipProvider delayDuration={200}>
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
              const active = isActive(item)
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    navigate(item.page)
                    setCollapsed(true)
                  }}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'admin-nav-active'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
            <Separator className="my-2 bg-neutral-800" />
            {/* User Avatar - Mobile */}
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
                <User className="size-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-[10px] text-neutral-500">admin@morpheye.com</p>
              </div>
            </div>
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
          <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Shield className="size-4 text-cyan-400" />
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
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Tooltip key={item.page}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(item.page)}
                    className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'admin-nav-active'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <span className="absolute right-3 size-1.5 rounded-full bg-cyan-400" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="border-neutral-700 bg-neutral-900 text-neutral-300">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* User Avatar + Footer */}
        <div className="border-t border-neutral-800 p-3 space-y-1">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1">
            <div className="flex size-9 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <User className="size-4 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">Admin</p>
              <p className="truncate text-[10px] text-neutral-500">admin@morpheye.com</p>
            </div>
          </div>
          <Separator className="bg-neutral-800" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate('home')}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <ArrowLeft className="size-4" />
                Back to Store
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="border-neutral-700 bg-neutral-900 text-neutral-300">
              Back to Store
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="border-neutral-700 bg-neutral-900 text-neutral-300">
              Logout
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
