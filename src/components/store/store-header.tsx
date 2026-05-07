'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Menu, Shield, X } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

const navLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Shop', page: 'shop' as const },
  { label: 'Bundles', page: 'shop' as const, category: 'bundles' },
]

export function StoreHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { navigate, currentPage } = useNavigationStore()
  const itemCount = useCartStore((s) => s.getItemCount())

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate('shop', { query: searchValue.trim() })
      setSearchValue('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logo.png"
            alt="Morpheye"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="text-xl font-bold tracking-tight text-white">
            Morpheye
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() =>
                navigate(link.page, link.category ? { category: link.category } : undefined)
              }
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? 'text-emerald-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearch}
                className="flex items-center gap-2 overflow-hidden"
              >
                <Input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search products..."
                  className="h-8 border-neutral-700 bg-neutral-900 text-sm text-white placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchValue('')
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </motion.form>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="text-neutral-400 hover:text-white"
                >
                  <Search className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('cart')}
            className="relative text-neutral-400 hover:text-white"
          >
            <ShoppingCart className="size-4" />
            {itemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 p-0 text-[10px] font-bold text-black">
                {itemCount}
              </Badge>
            )}
          </Button>

          {/* Admin */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('admin')}
            className="text-neutral-400 hover:text-emerald-500"
            title="Admin Panel"
          >
            <Shield className="size-4" />
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('cart')}
            className="relative text-neutral-400"
          >
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 p-0 text-[10px] font-bold text-black">
                {itemCount}
              </Badge>
            )}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-neutral-400">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-neutral-800 bg-[#0a0a0a] text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-white">
                  Morpheye
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4 pt-4">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      navigate(
                        link.page,
                        link.category ? { category: link.category } : undefined
                      )
                      setMobileOpen(false)
                    }}
                    className={`rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      currentPage === link.page
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="my-2 border-t border-neutral-800" />
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search products..."
                    className="border-neutral-700 bg-neutral-900 text-sm text-white placeholder:text-neutral-500"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-emerald-500 text-black hover:bg-emerald-600"
                  >
                    <Search className="size-4" />
                  </Button>
                </form>
                <button
                  onClick={() => {
                    navigate('admin')
                    setMobileOpen(false)
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
                >
                  <Shield className="size-4" />
                  Admin
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
