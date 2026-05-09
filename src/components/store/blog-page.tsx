'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  Search,
  BookOpen,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  image?: string | null
  category?: string | null
  author: string
  published: boolean
  featured: boolean
  tags: string[]
  readTime?: number | null
  createdAt: string
}

export function BlogPage() {
  const { navigate } = useNavigationStore()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog?limit=50')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[]

  const filtered = posts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  const featured = filtered.find((p) => p.featured)
  const rest = filtered.filter((p) => p.id !== featured?.id)

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemAnim = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <BookOpen className="size-6 text-cyan-400" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
          Morpheye Blog
        </h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          News, guides, and insights about hardware wallets, crypto security, and self-custody.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-8 space-y-4"
      >
        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-all',
              !activeCategory
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                : 'border-border text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-all capitalize',
                activeCategory === cat
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                  : 'border-border text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
              <div className="aspect-[16/9] rounded-t-xl bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-5 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <BookOpen className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">No articles found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Featured Post */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <button
                onClick={() => navigate('blog-post', { postSlug: featured.slug })}
                className="group relative grid overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-cyan-500/30 sm:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto">
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <BookOpen className="size-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/40 sm:to-transparent" />
                  <Badge className="absolute left-4 top-4 bg-cyan-500 text-black">
                    Featured
                  </Badge>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  {featured.category && (
                    <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      {featured.category}
                    </span>
                  )}
                  <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {formatDate(featured.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {featured.readTime || 5} min read
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Read article <ArrowRight className="size-4" />
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Post Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((post) => (
              <motion.div key={post.id} variants={itemAnim}>
                <button
                  onClick={() => navigate('blog-post', { postSlug: post.slug })}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-300 hover:border-cyan-500/30"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <BookOpen className="size-8 text-muted-foreground" />
                      </div>
                    )}
                    {post.category && (
                      <Badge className="absolute left-3 top-3 bg-cyan-500/90 text-black text-[10px]">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime || 5} min
                      </span>
                    </div>
                    <h3 className="mt-2 mb-2 text-base font-semibold text-foreground line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-1 pt-4 text-xs font-medium text-muted-foreground group-hover:text-cyan-400 transition-colors">
                      Read more <ChevronRight className="size-3" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
