'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, LayoutGrid, List, X, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/store/navigation-store'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
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
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all')
        params.set('category', selectedCategory)
      if (sort) params.set('sort', sort)
      if (search) params.set('search', search)
      if (selectedBrand && selectedBrand !== 'all')
        params.set('brand', selectedBrand)
      params.set('limit', '24')

      const res = await fetch(`/api/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
        setTotalProductCount(data.pagination?.total || 0)
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, sort, search, selectedBrand])

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

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts()
    }
  }, [selectedCategory, sort, fetchProducts, initialProducts, selectedBrand])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const clearSearch = () => {
    setSearch('')
    if (search) {
      setTimeout(() => fetchProducts(), 0)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56 bg-neutral-800" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full bg-neutral-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
            >
              <Skeleton className="aspect-square bg-neutral-800" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4 bg-neutral-800" />
                <Skeleton className="h-3 w-1/2 bg-neutral-800" />
                <Skeleton className="h-5 w-1/3 bg-neutral-800" />
              </div>
            </div>
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
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Showing <span className="font-medium text-cyan-400">{displayedCount}</span> of{' '}
            <span className="font-medium text-neutral-300">{totalProductCount}</span> products
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/80 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center rounded-md p-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm shadow-cyan-500/10'
                  : 'text-neutral-500 hover:text-neutral-300'
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
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/50 p-4 backdrop-blur-sm">
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
              className={`h-10 border-neutral-700 bg-neutral-800/80 pl-9 pr-9 text-sm text-white placeholder:text-neutral-500 transition-all duration-300 ${
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
              <SelectTrigger className="h-10 w-[160px] border-neutral-700 bg-neutral-800/80 text-sm text-white hover:border-neutral-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-neutral-700 bg-neutral-900 text-white">
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
                : 'border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
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
                  : 'border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
              }`}
            >
              {cat.name}
              <span
                className={`ml-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] ${
                  selectedCategory === cat.slug
                    ? 'bg-black/20 text-black'
                    : 'bg-neutral-700 text-neutral-500'
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
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
              Brand:
            </span>
            <button
              onClick={() => setSelectedBrand('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                selectedBrand === 'all'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
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
                    : 'border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
                }`}
              >
                {brand.name}
                <span
                  className={`ml-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] ${
                    selectedBrand === brand.name
                      ? 'bg-black/20 text-black'
                      : 'bg-neutral-700 text-neutral-500'
                  }`}
                >
                  {brand.productCount}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid / List */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 py-20 text-center"
        >
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-neutral-800/80 shadow-lg shadow-cyan-500/5">
            <Search className="size-10 text-neutral-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">
            No products found
          </h3>
          <p className="mb-6 max-w-sm text-sm text-neutral-400">
            We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
          </p>
          <Button
            onClick={() => {
              setSearch('')
              setSelectedCategory('all')
              setSelectedBrand('all')
              navigate('shop')
            }}
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
                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-neutral-800 bg-[#111111] p-3 transition-all hover:border-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/5"
              >
                <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
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
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {product.name}
                  </h3>
                  {product.shortDesc && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                      {product.shortDesc}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    {product.category && (
                      <span className="text-[10px] text-neutral-500">
                        {product.category.name}
                      </span>
                    )}
                    {product.brand && (
                      <span className="rounded border border-neutral-700 px-1.5 py-0.5 text-[9px] text-neutral-400">
                        {product.brand}
                      </span>
                    )}
                  </div>
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
    </div>
  )
}
