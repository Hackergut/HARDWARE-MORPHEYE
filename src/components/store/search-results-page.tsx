'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  TrendingUp,
  Clock,
  Package,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { ProductCard } from './product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  brand?: string | null
  featured?: boolean
  rating?: number
  reviewCount?: number
  stock?: number
  shortDesc?: string | null
  createdAt?: string | Date | null
}

const TRENDING_SEARCHES = ['Ledger Nano X', 'Trezor', 'Hardware Wallet', 'Seed Phrase', 'Bundle']
const RECENT_KEY = 'morpheye-recent-searches'
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addRecentSearch(query: string) {
  try {
    const existing = getRecentSearches()
    const filtered = existing.filter((s) => s.toLowerCase() !== query.toLowerCase())
    const updated = [query, ...filtered].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  } catch {
    // localStorage not available
  }
}

function removeRecentSearch(query: string) {
  try {
    const existing = getRecentSearches()
    const updated = existing.filter((s) => s !== query)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  } catch {
    // localStorage not available
  }
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border bg-card/50 p-4">
          <div className="aspect-square rounded-lg bg-muted" />
          <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
          <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [totalResults, setTotalResults] = useState(0)

  const { searchQuery: navQuery, navigate } = useNavigationStore()

  // Pre-fill from navigation store
  useEffect(() => {
    if (navQuery) {
      setSearchQuery(navQuery)
      performSearch(navQuery)
    } else {
      setRecentSearches(getRecentSearches())
    }
  }, [navQuery])

  const performSearch = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setHasSearched(true)
    addRecentSearch(trimmed)

    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(trimmed)}&limit=24`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.products || [])
        setTotalResults(data.total || (data.products || []).length)
      } else {
        setResults([])
        setTotalResults(0)
      }
    } catch {
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
      setRecentSearches(getRecentSearches())
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
    }
  }

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term)
    performSearch(term)
  }

  const handleRecentClick = (term: string) => {
    setSearchQuery(term)
    performSearch(term)
  }

  const handleRemoveRecent = (term: string) => {
    removeRecentSearch(term)
    setRecentSearches(getRecentSearches())
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setResults([])
    setHasSearched(false)
    setTotalResults(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
          Search
        </h1>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for hardware wallets, accessories, bundles..."
                className="h-12 border-border bg-card/50 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="h-12 bg-cyan-500 px-6 font-semibold text-black hover:bg-cyan-400"
            >
              <Search className="mr-2 size-4" />
              Search
            </Button>
          </div>
        </form>

        {/* Results Count */}
        {hasSearched && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            {totalResults > 0 ? (
              <>
                Showing <span className="font-semibold text-foreground">{results.length}</span> of{' '}
                <span className="font-semibold text-foreground">{totalResults}</span> results for{' '}
                <span className="font-semibold text-cyan-400">&ldquo;{navQuery || searchQuery}&rdquo;</span>
              </>
            ) : (
              <>
                No results for{' '}
                <span className="font-semibold text-cyan-400">&ldquo;{navQuery || searchQuery}&rdquo;</span>
              </>
            )}
          </motion.p>
        )}
      </div>

      {/* Main Content */}
      {!hasSearched ? (
        /* Landing State - Trending & Recent */
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="rounded-xl border border-border bg-card/50 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="size-4 text-cyan-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent Searches
                  </h2>
                </div>
                <ul className="space-y-1">
                  {recentSearches.map((term) => (
                    <li key={term} className="group flex items-center">
                      <button
                        onClick={() => handleRecentClick(term)}
                        className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                      >
                        <Clock className="size-3.5 text-muted-foreground group-hover:text-cyan-500" />
                        {term}
                        <ArrowRight className="ml-auto size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                      <button
                        onClick={() => handleRemoveRecent(term)}
                        className="mr-2 flex size-6 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-neutral-400 group-hover:opacity-100"
                        aria-label={`Remove ${term} from recent searches`}
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Trending Searches */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="size-4 text-cyan-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Trending Searches
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-2 text-sm text-muted-foreground transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400"
                  >
                    <TrendingUp className="size-3" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ) : loading ? (
        /* Loading State */
        <SearchSkeleton />
      ) : results.length > 0 ? (
        /* Results Grid */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {results.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Package className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            No products found
          </h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t find any products matching your search. Try different keywords or browse our suggestions below.
          </p>

          {/* Suggestions */}
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Try searching for
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTrendingClick(term)}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => navigate('shop')}
            className="bg-cyan-500 font-semibold text-black hover:bg-cyan-400"
          >
            <ShoppingBag className="mr-2 size-4" />
            Browse All Products
          </Button>
        </motion.div>
      )}

      {/* Recently Searched - shown at bottom when results are visible */}
      {hasSearched && recentSearches.length > 0 && results.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Searches
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleRecentClick(term)}
                className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
