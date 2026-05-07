'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
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
  category?: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

interface ProductGridProps {
  title?: string
  products?: Product[]
  loading?: boolean
  category?: string
}

export function ProductGrid({
  title = 'All Products',
  products: initialProducts,
  loading = false,
  category,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')
  const [isLoading, setIsLoading] = useState(loading)
  const { searchQuery } = useNavigationStore()

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
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all')
        params.set('category', selectedCategory)
      if (sort) params.set('sort', sort)
      if (search) params.set('search', search)
      params.set('limit', '24')

      const res = await fetch(`/api/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts()
    }
  }, [selectedCategory, sort])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-neutral-800" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-neutral-400">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border-neutral-700 bg-neutral-900 pl-9 text-sm text-white placeholder:text-neutral-500"
          />
        </form>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-neutral-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] border-neutral-700 bg-neutral-900 text-sm text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="border-neutral-700 bg-neutral-900 text-white">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name} ({cat.productCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[150px] border-neutral-700 bg-neutral-900 text-sm text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-neutral-700 bg-neutral-900 text-white">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low → High</SelectItem>
              <SelectItem value="price_desc">Price: High → Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-neutral-800 p-4">
            <Search className="size-8 text-neutral-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            No products found
          </h3>
          <p className="text-sm text-neutral-400">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
