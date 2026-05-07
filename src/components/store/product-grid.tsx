'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, LayoutGrid, List, X, ShoppingBag, ArrowRight, Package, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/store/navigation-store'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ProductCard } from './product-card'

interface Product {
  id: string
  name: string
  slug: string
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  featured?: boolean
  rating?: number
  reviewCount?: number
  stock?: number
  category?: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

interface Brand {
  name: string
  productCount: number
  minPrice: number | null
}

interface ProductGridProps {
  title?: string
  products?: Product[]
  loading?: boolean
  category?: string
  totalCount?: number
}

const PRODUCTS_PER_PAGE = 12
const PRICE_MIN = 0
const PRICE_MAX = 500

// Shimmer skeleton card that matches product card dimensions
function SkeletonProductCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-[#111111] dark:bg-[#111111] bg-white relative">
      {/* Shimmer animation overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden rounded-xl">
        <div className="absolute inset-0 animate-[shimmer-slide_2s_infinite] bg-gradient-to-r from-transparent via-white/5 dark:via-white/5 via-neutral-200/30 to-transparent" />
      </div>
      {/* Image skeleton */}
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full bg-neutral-800 dark:bg-neutral-800 bg-neutral-200 rounded-none" />
        {/* Badge skeleton */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-12 rounded-full bg-neutral-700 dark:bg-neutral-700 bg-neutral-300" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-3 w-12 rounded bg-neutral-700 dark:bg-neutral-700 bg-neutral-300" />
        <Skeleton className="h-4 w-3/4 rounded bg-neutral-700 dark:bg-neutral-700 bg-neutral-300" />
        <Skeleton className="h-3 w-1/2 rounded bg-neutral-800 dark:bg-neutral-800 bg-neutral-200" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded bg-neutral-700 dark:bg-neutral-700 bg-neutral-300" />
          <Skeleton className="h-4 w-12 rounded bg-neutral-800 dark:bg-neutral-800 bg-neutral-200" />
        </div>
        <Skeleton className="h-8 w-full rounded-md bg-neutral-700 dark:bg-neutral-700 bg-neutral-300" />
      </div>
    </div>
  )
}

// Shimmer for list view
function SkeletonListItem() {
  return (
    <div className="relative flex items-center gap-4 rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-[#111111] dark:bg-[#111111] bg-white p-3 sm:p-4">
      <div className="absolute inset-0 z-10 overflow-hidden rounded-xl">
        <div className="absolute inset-0 animate-[shimmer-slide_2s_infinite] bg-gradient-to-r from-transparent via-white/5 dark:via-white/5 via-neutral-200/30 to-transparent" />
      </div>
      <Skeleton className="size-20 rounded-lg bg-neutral-800 dark:bg-neutral-800 bg-neutral-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5 rounded bg-neutral-700 dark:bg-neutral-700 bg-neutral-300" />
        <Skeleton className="h-3 w-2/5 rounded bg-neutral-800 dark:bg-neutral-800 bg-neutral-200" />
        <Skeleton className="h-3 w-1/4 rounded bg-neutral-800 dark:bg-neutral-800 bg-neutral-200" />
      </div>
      <Skeleton className="h-5 w-16 rounded bg-neutral-700 dark:bg-neutral-700 bg-neutral-300" />
    </div>
  )
}

export function ProductGrid({
  title = 'All Products',
  products: initialProducts,
  loading = false,
  category,
  totalCount: initialTotalCount,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [totalProductCount, setTotalProductCount] = useState<number>(initialTotalCount || 0)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(loading)
  const [searchFocused, setSearchFocused] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showDeals, setShowDeals] = useState(false)
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX])
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const { searchQuery, selectedBrand: navBrand, navigate } = useNavigationStore()

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts)
      return
    }
    fetchProducts()
  }, [initialProducts])

  useEffect(() => {
    if (searchQuery) setSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (navBrand) setSelectedBrand(navBrand)
  }, [navBrand])

  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  const fetchProducts = useCallback(async () => {
    setIsFilterLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all')
        params.set('category', selectedCategory)
      if (sort) params.set('sort', sort)
      if (search) params.set('search', search)
      if (selectedBrand && selectedBrand !== 'all')
        params.set('brand', selectedBrand)
      params.set('page', String(page))
      params.set('limit', String(PRODUCTS_PER_PAGE))

      const res = await fetch(`/api/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        let filteredProducts = data.products || []

        // Client-side deals filter (comparePrice > price)
        if (showDeals) {
          filteredProducts = filteredProducts.filter(
            (p: Product) => p.comparePrice && p.comparePrice > p.price
          )
        }

        // Client-side price range filter
        filteredProducts = filteredProducts.filter(
          (p: Product) => p.price >= priceRange[0] && p.price <= priceRange[1]
        )

        setProducts(filteredProducts)
        setTotalProductCount(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
      // Add a small delay so the skeleton is visible briefly for perceived performance
      setTimeout(() => setIsFilterLoading(false), 300)
    }
  }, [selectedCategory, sort, search, selectedBrand, page, showDeals, priceRange])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    } catch {
      // ignore
    }
  }

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands')
      if (res.ok) {
        const data = await res.json()
        setBrands(data.brands || [])
      }
    } catch {
      // ignore
    }
  }

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, sort, search, selectedBrand, showDeals, priceRange])

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts()
    }
  }, [selectedCategory, sort, fetchProducts, initialProducts, selectedBrand, page, showDeals, priceRange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  const clearSearch = () => {
    setSearch('')
    setPage(1)
    if (search) {
      setTimeout(() => fetchProducts(), 0)
    }
  }

  // Count active filters
  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedBrand !== 'all',
    showDeals,
    priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX,
    search !== '',
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setShowDeals(false)
    setPriceRange([PRICE_MIN, PRICE_MAX])
    setPage(1)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('ellipsis')
      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (page < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  // Full initial loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 bg-neutral-800 dark:bg-neutral-800 bg-neutral-200" />
            <Skeleton className="mt-2 h-4 w-32 bg-neutral-800 dark:bg-neutral-800 bg-neutral-200" />
          </div>
        </div>
        {/* Filter bar skeleton */}
        <div className="rounded-xl border border-neutral-800/60 dark:border-neutral-800/60 border-neutral-200 bg-neutral-900/50 dark:bg-neutral-900/50 bg-neutral-50 p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 bg-neutral-800 dark:bg-neutral-800 bg-neutral-200 rounded-md" />
            <Skeleton className="h-10 w-[160px] bg-neutral-800 dark:bg-neutral-800 bg-neutral-200 rounded-md" />
          </div>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full bg-neutral-800 dark:bg-neutral-800 bg-neutral-200" />
            ))}
          </div>
        </div>
        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  const displayedCount = products.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-white text-neutral-900">{title}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500 text-neutral-400">
            Showing <span className="font-medium text-cyan-400">{displayedCount}</span> of{' '}
            <span className="font-medium text-neutral-300 dark:text-neutral-300 text-neutral-700">{totalProductCount}</span> products
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/80 dark:bg-neutral-900/80 bg-neutral-50 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center rounded-md p-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm shadow-cyan-500/10'
                  : 'text-neutral-500 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-700'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center rounded-md p-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm shadow-cyan-500/10'
                  : 'text-neutral-500 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-700'
              }`}
              title="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-neutral-800/60 dark:border-neutral-800/60 border-neutral-200 bg-neutral-900/50 dark:bg-neutral-900/50 bg-neutral-50 p-4 backdrop-blur-sm">
        {/* Search + Sort Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products..."
              className={`h-10 border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800/80 dark:bg-neutral-800/80 bg-white pl-9 pr-9 text-sm text-white dark:text-white text-neutral-900 placeholder:text-neutral-500 transition-all duration-300 ${
                searchFocused
                  ? 'border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20'
                  : ''
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300"
              >
                <X className="size-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-[160px] border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800/80 dark:bg-neutral-800/80 bg-white text-sm text-white dark:text-white text-neutral-900 hover:border-neutral-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-900 dark:bg-neutral-900 bg-white text-white dark:text-white text-neutral-900">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'border border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800/60 dark:bg-neutral-800/60 bg-white text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-neutral-600 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                selectedCategory === cat.slug
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'border border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800/60 dark:bg-neutral-800/60 bg-white text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-neutral-600 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-700'
              }`}
            >
              {cat.name}
              <span
                className={`ml-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] ${
                  selectedCategory === cat.slug
                    ? 'bg-black/20 text-black'
                    : 'bg-neutral-700 dark:bg-neutral-700 bg-neutral-300 text-neutral-500 dark:text-neutral-500 text-neutral-500'
                }`}
              >
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>

        {/* Brand Filter Pills */}
        {brands.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-600 text-neutral-400">
              Brand:
            </span>
            <button
              onClick={() => setSelectedBrand('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                selectedBrand === 'all'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'border border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800/60 dark:bg-neutral-800/60 bg-white text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-neutral-600 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-700'
              }`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  selectedBrand === brand.name
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'border border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800/60 dark:bg-neutral-800/60 bg-white text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-neutral-600 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-700'
                }`}
              >
                {brand.name}
                <span
                  className={`ml-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] ${
                    selectedBrand === brand.name
                      ? 'bg-black/20 text-black'
                      : 'bg-neutral-700 dark:bg-neutral-700 bg-neutral-300 text-neutral-500 dark:text-neutral-500 text-neutral-500'
                  }`}
                >
                  {brand.productCount}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Deals Tab + Price Range Row */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Deals Filter Tab */}
            <button
              onClick={() => setShowDeals(!showDeals)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                showDeals
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20'
                  : 'border border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800/60 dark:bg-neutral-800/60 bg-white text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-amber-500/40 hover:text-amber-400'
              }`}
            >
              <Sparkles className="size-3" />
              Deals
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 min-w-0 sm:min-w-[280px]">
            <SlidersHorizontal className="size-4 shrink-0 text-neutral-500" />
            <div className="flex-1 min-w-0">
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="[&_[data-slot=slider-track]]:bg-neutral-800 dark:[&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-track]]:bg-neutral-200 [&_[data-slot=slider-range]]:bg-cyan-500 [&_[data-slot=slider-thumb]]:border-cyan-500 [&_[data-slot=slider-thumb]]:bg-neutral-900 dark:[&_[data-slot=slider-thumb]]:bg-neutral-900 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:hover:ring-cyan-500/30"
              />
            </div>
            <span className="shrink-0 text-[10px] font-medium text-neutral-400 dark:text-neutral-400 text-neutral-600">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-neutral-800/50 dark:border-neutral-800/50 border-neutral-200 pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-600 text-neutral-400">
              Active:
            </span>
            {search && (
              <div className="flex items-center gap-1 rounded-full border border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800 dark:bg-neutral-800 bg-neutral-100 px-2.5 py-1 text-[10px] text-neutral-300 dark:text-neutral-300 text-neutral-600">
                Search: &ldquo;{search}&rdquo;
                <button onClick={clearSearch} className="ml-1 text-neutral-500 hover:text-red-400 transition-colors">
                  <X className="size-3" />
                </button>
              </div>
            )}
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] text-cyan-400">
                {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 text-cyan-500/50 hover:text-cyan-300 transition-colors">
                  <X className="size-3" />
                </button>
              </div>
            )}
            {selectedBrand !== 'all' && (
              <div className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] text-cyan-400">
                {selectedBrand}
                <button onClick={() => setSelectedBrand('all')} className="ml-1 text-cyan-500/50 hover:text-cyan-300 transition-colors">
                  <X className="size-3" />
                </button>
              </div>
            )}
            {showDeals && (
              <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400">
                <Sparkles className="size-2.5" />
                Deals
                <button onClick={() => setShowDeals(false)} className="ml-1 text-amber-500/50 hover:text-amber-300 transition-colors">
                  <X className="size-3" />
                </button>
              </div>
            )}
            {(priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) && (
              <div className="flex items-center gap-1 rounded-full border border-neutral-700 dark:border-neutral-700 border-neutral-300 bg-neutral-800 dark:bg-neutral-800 bg-neutral-100 px-2.5 py-1 text-[10px] text-neutral-300 dark:text-neutral-300 text-neutral-600">
                ${priceRange[0]} - ${priceRange[1]}
                <button onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])} className="ml-1 text-neutral-500 hover:text-red-400 transition-colors">
                  <X className="size-3" />
                </button>
              </div>
            )}
            {activeFilterCount > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Grid / List with filter loading skeleton */}
      {isFilterLoading ? (
        viewMode === 'list' ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        )
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/30 dark:bg-neutral-900/30 bg-neutral-50 py-20 text-center"
        >
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-neutral-800/80 dark:bg-neutral-800/80 bg-neutral-200 shadow-lg shadow-cyan-500/5">
            <Search className="size-10 text-neutral-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white dark:text-white text-neutral-900">
            No products found
          </h3>
          <p className="mb-6 max-w-sm text-sm text-neutral-400 dark:text-neutral-400 text-neutral-600">
            We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
          </p>
          <Button
            onClick={clearAllFilters}
            className="bg-cyan-500 px-6 text-black hover:bg-cyan-400"
          >
            <ShoppingBag className="mr-2 size-4" />
            Browse All Products
          </Button>
        </motion.div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => navigate('product', { productId: product.id })}
                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-[#111111] dark:bg-[#111111] bg-white p-3 sm:p-4 transition-all hover:border-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/5"
              >
                <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800 dark:bg-neutral-800 bg-neutral-200">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-600">
                      <Package className="size-6" />
                    </div>
                  )}
                  {/* Deal badge on list view */}
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="absolute right-1 top-1 rounded bg-amber-500 px-1 py-0.5 text-[8px] font-bold text-black">
                      -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white dark:text-white text-neutral-900 group-hover:text-cyan-400 transition-colors">
                    {product.name}
                  </h3>
                  {product.shortDesc && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-500 text-neutral-400">
                      {product.shortDesc}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    {product.category && (
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-500 text-neutral-400">
                        {product.category.name}
                      </span>
                    )}
                    {product.brand && (
                      <span className="rounded border border-neutral-700 dark:border-neutral-700 border-neutral-300 px-1.5 py-0.5 text-[9px] text-neutral-400 dark:text-neutral-400 text-neutral-600">
                        {product.brand}
                      </span>
                    )}
                  </div>
                  {/* Rating in list view */}
                  {(product.rating ?? 0) > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-[10px] ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-amber-500'
                                : 'text-neutral-700 dark:text-neutral-700 text-neutral-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {product.reviewCount && (
                        <span className="text-[9px] text-neutral-600 dark:text-neutral-600 text-neutral-400">({product.reviewCount})</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-base font-bold text-cyan-400">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <p className="text-xs text-neutral-500 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </p>
                  )}
                </div>
                <ArrowRight className="size-4 flex-shrink-0 text-neutral-600 transition-colors group-hover:text-cyan-400" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Loading More indicator */}
      {isFilterLoading && !isLoading && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-neutral-500">
          <Loader2 className="size-4 animate-spin text-cyan-400" />
          <span>Loading more products...</span>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isFilterLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1 pt-4"
        >
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-9 border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/50 dark:bg-neutral-900/50 bg-white px-3 text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-neutral-700 dark:hover:border-neutral-700 hover:border-neutral-300 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:bg-neutral-50 hover:text-white dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, i) =>
              p === 'ellipsis' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex size-9 items-center justify-center text-sm text-neutral-600 dark:text-neutral-600 text-neutral-400"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 p-0 transition-all duration-200 ${
                    page === p
                      ? 'border-cyan-500 bg-cyan-500 text-black font-bold hover:bg-cyan-400 hover:text-black shadow-md shadow-cyan-500/20'
                      : 'border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/50 dark:bg-neutral-900/50 bg-white text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-neutral-700 dark:hover:border-neutral-700 hover:border-neutral-300 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:bg-neutral-50 hover:text-white dark:hover:text-white'
                  }`}
                >
                  {p}
                </Button>
              )
            )}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-9 border-neutral-800 dark:border-neutral-800 border-neutral-200 bg-neutral-900/50 dark:bg-neutral-900/50 bg-white px-3 text-neutral-400 dark:text-neutral-400 text-neutral-600 hover:border-neutral-700 dark:hover:border-neutral-700 hover:border-neutral-300 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:bg-neutral-50 hover:text-white dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
