'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  BookOpen,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
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
  updatedAt: string
}

export function BlogPostPage() {
  const { navigate, selectedPostSlug } = useNavigationStore()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (selectedPostSlug) {
      fetchPost(selectedPostSlug)
    } else {
      setLoading(false)
    }
  }, [selectedPostSlug])

  const fetchPost = async (slug: string) => {
    try {
      const res = await fetch(`/api/blog/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data.post)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-24 rounded bg-muted" />
          <div className="aspect-[16/9] rounded-xl bg-muted" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-3 size-10 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Article not found
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => navigate('blog')}
            className="bg-cyan-500 text-black hover:bg-cyan-400"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        onClick={() => navigate('blog')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cyan-400"
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </motion.button>

      <article>
        {/* Category + Meta */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          {post.category && (
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 capitalize">
              {post.category}
            </Badge>
          )}
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {post.readTime || 5} min read
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6 text-3xl font-bold text-foreground sm:text-4xl"
        >
          {post.title}
        </motion.h1>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <User className="size-4" />
          <span>By <span className="font-medium text-foreground">{post.author}</span></span>
        </motion.div>

        {/* Featured Image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl border border-border"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="prose prose-invert prose-cyan max-w-none"
        >
          <ReactMarkdown
            components={{
              h1: ({ children, ...props }) => (
                <h1 className="mb-4 mt-8 text-2xl font-bold text-foreground" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 className="mb-3 mt-6 text-xl font-bold text-foreground" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className="mb-2 mt-5 text-lg font-semibold text-foreground" {...props}>
                  {children}
                </h3>
              ),
              p: ({ children, ...props }) => (
                <p className="mb-4 leading-relaxed text-muted-foreground" {...props}>
                  {children}
                </p>
              ),
              ul: ({ children, ...props }) => (
                <ul className="mb-4 list-disc space-y-1 pl-5 text-muted-foreground" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="mb-4 list-decimal space-y-1 pl-5 text-muted-foreground" {...props}>
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li className="text-sm leading-relaxed" {...props}>{children}</li>
              ),
              a: ({ children, href, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-2 transition-colors hover:text-cyan-300"
                  {...props}
                >
                  {children}
                </a>
              ),
              strong: ({ children, ...props }) => (
                <strong className="font-semibold text-foreground" {...props}>
                  {children}
                </strong>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className="mb-4 border-l-4 border-cyan-500/40 bg-card/50 py-3 pl-4 text-sm italic text-muted-foreground"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              code: ({ children, ...props }) => (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-cyan-400"
                  {...props}
                >
                  {children}
                </code>
              ),
              pre: ({ children, ...props }) => (
                <pre
                  className="mb-4 overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm"
                  {...props}
                >
                  {children}
                </pre>
              ),
              img: ({ src, alt, ...props }) => (
                <Image
                  src={src || ''}
                  alt={alt || ''}
                  width={800}
                  height={450}
                  className="my-6 rounded-lg border border-border"
                  {...props}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6"
          >
            <Tag className="size-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </article>
    </motion.div>
  )
}
