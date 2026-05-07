'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Menu, Shield, X, Heart, ArrowLeftRight, Package, Tag, Headphones } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useComparisonStore } from '@/store/comparison-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface SuggestionProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

interface SuggestionCategory {
  id: string
  name: string
  slug: string
}

interface Suggestions {
  products: SuggestionProduct[]
  categories: SuggestionCategory[]
}

const navLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Shop', page: 'shop' as const },
  { label: 'Bundles', page: 'shop' as const, category: 'bundles' },
  { label: 'Support', page: 'contact' as const },
]

export function StoreHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [suggestions, setSuggestions] = useState<Suggestions>({ products: [], categories: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { navigate, currentPage } = useNavigationStore()
  const itemCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useWishlistStore((s) => s.getItemCount())
  const comparisonCount = useComparisonStore((s) => s.getItemCount())

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions({ products: [], categories: [] })
      setShowSuggestions(false)
      return
    }
    setSuggestionsLoading(true)
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(true)
      }
    } catch {
      // ignore
    } finally {
      setSuggestionsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (!searchOpen) return
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchValue.trim())
    }, 300)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchValue, searchOpen, fetchSuggestions])

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close suggestions on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Scroll listener for border glow effect and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(Math.min(100, progress))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate('shop', { query: searchValue.trim() })
      setSearchValue('')
      setSearchOpen(false)
      setShowSuggestions(false)
    }
  }

  const handleProductClick = (productId: string) => {
    navigate('product', { productId })
    setSearchValue('')
    setSearchOpen(false)
    setShowSuggestions(false)
  }

  const handleCategoryClick = (categorySlug: string) => {
    navigate('shop', { category: categorySlug })
    setSearchValue('')
    setSearchOpen(false)
    setShowSuggestions(false)
  }

  const hasSuggestions = suggestions.products.length > 0 || suggestions.categories.length > 0

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 header-glow ${scrolled ? 'scrolled' : ''}`}>
      {/* Thin scroll progress bar at the very top */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%`, position: 'absolute', top: 0, bottom: 'auto' }}
      />

      <div className={`w-full backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 shadow-[0_1px_20px_rgba(6,182,212,0.08)]'
          : 'bg-[#0a0a0a]/80'
      }`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo with glow */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 transition-opacity hover:opacity-80 logo-glow"
          >
            <Image
              src="/images/logo.png"
              alt="Morpheye"
              width={36}
              height={36}
              className="rounded-lg invert"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white">
                MORPHEYE
              </span>
              <span className="-mt-1 text-[9px] font-medium tracking-widest text-cyan-500/80 uppercase">
                Official Reseller
              </span>
            </div>
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
                  currentPage === link.page || (link.page === 'contact' && currentPage === 'contact')
                    ? 'text-cyan-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label === 'Support' && <Headphones className="inline size-3.5 mr-1 -mt-0.5" />}
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <div ref={searchContainerRef} className="relative">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="flex items-center gap-2 overflow-hidden"
                  >
                    <Input
                      autoFocus
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onFocus={() => {
                        if (searchValue.trim().length >= 2 && hasSuggestions) {
                          setShowSuggestions(true)
                        }
                      }}
                      placeholder="Search products..."
                      className="h-8 border-neutral-700 bg-neutral-900 text-sm text-white placeholder:text-neutral-500 focus-visible:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchValue('')
                        setShowSuggestions(false)
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

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchValue.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-[60] mt-2 w-80 overflow-hidden rounded-lg border border-neutral-800 bg-[#111111] shadow-xl shadow-black/40"
                  >
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {/* Loading indicator */}
                      {suggestionsLoading && (
                        <div className="flex items-center justify-center px-4 py-3">
                          <div className="size-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                        </div>
                      )}

                      {!suggestionsLoading && (
                        <>
                          {/* Category Suggestions */}
                          {suggestions.categories.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                                <Tag className="size-3 text-cyan-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                                  Categories
                                </span>
                              </div>
                              {suggestions.categories.map((cat) => (
                                <button
                                  key={cat.id}
                                  onClick={() => handleCategoryClick(cat.slug)}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-cyan-500/10"
                                >
                                  <div className="flex size-7 items-center justify-center rounded-md bg-neutral-800">
                                    <Tag className="size-3.5 text-cyan-400" />
                                  </div>
                                  <span className="text-sm text-neutral-300 group-hover:text-cyan-400">
                                    {cat.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Divider between categories and products */}
                          {suggestions.categories.length > 0 && suggestions.products.length > 0 && (
                            <div className="mx-4 border-t border-neutral-800" />
                          )}

                          {/* Product Suggestions */}
                          {suggestions.products.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                                <Package className="size-3 text-cyan-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                                  Products
                                </span>
                              </div>
                              {suggestions.products.map((prod) => (
                                <button
                                  key={prod.id}
                                  onClick={() => handleProductClick(prod.id)}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-cyan-500/10"
                                >
                                  <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-neutral-800">
                                    {prod.images?.[0] ? (
                                      <Image
                                        src={prod.images[0]}
                                        alt={prod.name}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center">
                                        <Package className="size-4 text-neutral-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm text-neutral-300">
                                      {prod.name}
                                    </p>
                                    <p className="text-xs font-semibold text-cyan-400">
                                      ${prod.price.toFixed(2)}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* No results */}
                          {!hasSuggestions && !suggestionsLoading && (
                            <div className="px-4 py-6 text-center">
                              <p className="text-sm text-neutral-500">
                                No results for &ldquo;{searchValue}&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Footer link */}
                          {hasSuggestions && (
                            <div className="border-t border-neutral-800">
                              <button
                                onClick={handleSearch}
                                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/10"
                              >
                                <Search className="size-3" />
                                View all results for &ldquo;{searchValue}&rdquo;
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('wishlist')}
              className="relative text-neutral-400 hover:text-red-400"
            >
              <Heart className="size-4" />
              {wishlistCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] font-bold text-white">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Comparison */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('comparison')}
              className="relative text-neutral-400 hover:text-cyan-400"
              title="Compare Products"
            >
              <ArrowLeftRight className="size-4" />
              {comparisonCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-cyan-500 p-0 text-[10px] font-bold text-black">
                  {comparisonCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('cart')}
              className="relative text-neutral-400 hover:text-white"
            >
              <ShoppingCart className="size-4" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-cyan-500 p-0 text-[10px] font-bold text-black">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Admin */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('admin')}
              className="text-neutral-400 hover:text-cyan-400"
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
              onClick={() => navigate('wishlist')}
              className="relative text-neutral-400"
            >
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] font-bold text-white">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('comparison')}
              className="relative text-neutral-400"
              title="Compare Products"
            >
              <ArrowLeftRight className="size-5" />
              {comparisonCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-cyan-500 p-0 text-[10px] font-bold text-black">
                  {comparisonCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('cart')}
              className="relative text-neutral-400"
            >
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-cyan-500 p-0 text-[10px] font-bold text-black">
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
                  <SheetTitle className="text-left text-white flex items-center gap-2">
                    <Image
                      src="/images/logo.png"
                      alt="Morpheye"
                      width={24}
                      height={24}
                      className="rounded invert"
                    />
                    MORPHEYE
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
                      className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        currentPage === link.page
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      {link.label === 'Support' && <Headphones className="size-4" />}
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
                      className="bg-cyan-500 text-black hover:bg-cyan-400"
                    >
                      <Search className="size-4" />
                    </Button>
                  </form>
                  <button
                    onClick={() => {
                      navigate('wishlist')
                      setMobileOpen(false)
                    }}
                    className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      currentPage === 'wishlist'
                        ? 'bg-red-500/10 text-red-400'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <Heart className="size-4" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <Badge className="ml-auto bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {wishlistCount}
                      </Badge>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigate('comparison')
                      setMobileOpen(false)
                    }}
                    className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      currentPage === 'comparison'
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <ArrowLeftRight className="size-4" />
                    Compare
                    {comparisonCount > 0 && (
                      <Badge className="ml-auto bg-cyan-500 px-1.5 text-[10px] font-bold text-black">
                        {comparisonCount}
                      </Badge>
                    )}
                  </button>
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

        {/* Bottom scroll progress bar */}
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  )
}
