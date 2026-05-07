'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  MessageSquarePlus,
  X,
  BadgeCheck,
  ChevronDown,
  Loader2,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface Review {
  id: string
  author: string
  rating: number
  title?: string | null
  comment?: string | null
  verified: boolean
  createdAt: string
}

interface ReviewSummary {
  average: number
  total: number
  distribution: Record<number, number>
}

type SortOption = 'newest' | 'highest' | 'lowest'

interface ProductReviewsProps {
  productId: string
}

function StarRating({
  rating,
  size = 'sm',
  interactive = false,
  onChange,
}: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (r: number) => void
}) {
  const sizeClass = size === 'sm' ? 'size-4' : size === 'md' ? 'size-5' : 'size-6'

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(i + 1)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} disabled:cursor-default`}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              i < rating
                ? 'fill-amber-500 text-amber-500'
                : 'text-neutral-600'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary>({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Write review form
  const [showForm, setShowForm] = useState(false)
  const [formAuthor, setFormAuthor] = useState('')
  const [formRating, setFormRating] = useState(0)
  const [formTitle, setFormTitle] = useState('')
  const [formComment, setFormComment] = useState('')
  const [formHoverRating, setFormHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/products/${productId}/reviews?page=${page}&limit=5&sort=${sort}`
      )
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
        setSummary(data.summary || { average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [productId, page, sort])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!formAuthor.trim()) errors.author = 'Name is required'
    if (formRating < 1 || formRating > 5) errors.rating = 'Please select a rating'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: formAuthor,
          rating: formRating,
          title: formTitle || undefined,
          comment: formComment || undefined,
        }),
      })

      if (res.ok) {
        setShowForm(false)
        setFormAuthor('')
        setFormRating(0)
        setFormTitle('')
        setFormComment('')
        setFormErrors({})
        setPage(1)
        fetchReviews()
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const distMax = Math.max(...Object.values(summary.distribution), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 text-black hover:bg-cyan-400"
        >
          <MessageSquarePlus className="mr-2 size-4" />
          Write a Review
        </Button>
      </div>

      {/* Review Summary */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 p-6">
          <div className="text-5xl font-bold text-foreground mb-2">
            {summary.average.toFixed(1)}
          </div>
          <StarRating rating={Math.round(summary.average)} size="lg" />
          <p className="mt-2 text-sm text-muted-foreground">
            Based on {summary.total} review{summary.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3 rounded-xl border border-border bg-card/50 p-6">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] || 0
            const pct = summary.total > 0 ? (count / summary.total) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <span className="text-sm text-muted-foreground">{star}</span>
                  <Star className="size-3 fill-amber-500 text-amber-500" />
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                  />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        {(['newest', 'highest', 'lowest'] as SortOption[]).map((option) => (
          <button
            key={option}
            onClick={() => {
              setSort(option)
              setPage(1)
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              sort === option
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-muted-foreground hover:text-foreground border border-border hover:border-border'
            }`}
          >
            {option === 'newest' ? 'Newest' : option === 'highest' ? 'Highest Rating' : 'Lowest Rating'}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-cyan-500" />
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card/30 py-12 text-center"
            >
              <MessageSquarePlus className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </motion.div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card/50 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {review.author}
                        </span>
                        {review.verified && (
                          <span className="flex items-center gap-1 rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400">
                            <BadgeCheck className="size-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>

                {review.title && (
                  <h4 className="mt-3 text-sm font-semibold text-foreground">
                    {review.title}
                  </h4>
                )}

                {review.comment && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Next
          </Button>
        </div>
      )}

      {/* Write Review Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-lg rounded-2xl border border-border dark:bg-card bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Write a Review</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Author Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Your Name *
                  </label>
                  <Input
                    value={formAuthor}
                    onChange={(e) => {
                      setFormAuthor(e.target.value)
                      if (formErrors.author) setFormErrors((p) => { const n = { ...p }; delete n.author; return n })
                    }}
                    placeholder="John Doe"
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                  />
                  {formErrors.author && (
                    <p className="text-xs text-red-500">{formErrors.author}</p>
                  )}
                </div>

                {/* Star Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setFormRating(i + 1)
                          if (formErrors.rating) setFormErrors((p) => { const n = { ...p }; delete n.rating; return n })
                        }}
                        onMouseEnter={() => setFormHoverRating(i + 1)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`size-7 transition-colors ${
                            i < (formHoverRating || formRating)
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                    {formRating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formRating} star{formRating !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {formErrors.rating && (
                    <p className="text-xs text-red-500">{formErrors.rating}</p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Review Title
                  </label>
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                  />
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Your Review
                  </label>
                  <textarea
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 resize-none"
                  />
                </div>

                <Separator className="bg-muted" />

                <div className="flex items-center gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-border text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
