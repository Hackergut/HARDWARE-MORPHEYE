'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BookOpen,
  X,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNotificationStore } from '@/store/notification-store'

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

interface BlogForm {
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  published: boolean
  featured: boolean
  tags: string
  readTime: string
}

const emptyForm: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  category: '',
  author: 'Morpheye',
  published: false,
  featured: false,
  tags: '',
  readTime: '5',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null)
  const [form, setForm] = useState<BlogForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const showNotification = useNotificationStore((s) => s.show)

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.set('limit', '100')
      const res = await fetch(`/api/blog?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setPosts(json.posts || [])
      }
    } catch (err) {
      console.error('Failed to fetch blog posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const openAddDialog = () => {
    setEditingPost(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      image: post.image || '',
      category: post.category || '',
      author: post.author,
      published: post.published,
      featured: post.featured,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      readTime: String(post.readTime || ''),
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (post: BlogPost) => {
    setDeletingPost(post)
    setDeleteOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) {
      showNotification('Title, slug, and content are required', 'error')
      return
    }

    setSaving(true)
    try {
      const tagsArr = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        image: form.image || null,
        category: form.category || null,
        author: form.author || 'Morpheye',
        published: form.published,
        featured: form.featured,
        tags: tagsArr,
        readTime: form.readTime ? parseInt(form.readTime, 10) : null,
      }

      let res: Response
      if (editingPost) {
        res = await fetch(`/api/blog/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        showNotification(
          editingPost ? 'Blog post updated' : 'Blog post created',
          'success'
        )
        setDialogOpen(false)
        fetchPosts()
      } else {
        const json = await res.json()
        showNotification(json.error || 'Failed to save blog post', 'error')
      }
    } catch {
      showNotification('Failed to save blog post', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPost) return
    try {
      const res = await fetch(`/api/blog/${deletingPost.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showNotification('Blog post deleted', 'success')
        setDeleteOpen(false)
        setDeletingPost(null)
        fetchPosts()
      } else {
        showNotification('Failed to delete blog post', 'error')
      }
    } catch {
      showNotification('Failed to delete blog post', 'error')
    }
  }

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      })
      if (res.ok) {
        showNotification(
          post.published ? 'Post unpublished' : 'Post published',
          'success'
        )
        fetchPosts()
      } else {
        showNotification('Failed to update post status', 'error')
      }
    } catch {
      showNotification('Failed to update post status', 'error')
    }
  }

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const filtered = posts.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-40 bg-neutral-800" />
        <Skeleton className="h-10 w-full bg-neutral-800" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 bg-neutral-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white md:text-2xl">
            Blog Posts
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your blog content
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
        >
          <Plus className="mr-2 size-4" />
          New Post
        </Button>
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="border-neutral-700 bg-neutral-800 pl-9 text-white placeholder:text-neutral-500"
        />
      </div>

      {/* Posts Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Title</TableHead>
                <TableHead className="text-neutral-400">Category</TableHead>
                <TableHead className="text-neutral-400">Date</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-neutral-400">Featured</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-neutral-400"
                  >
                    <BookOpen className="mx-auto mb-2 size-8 text-neutral-600" />
                    No blog posts found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((post) => (
                  <TableRow
                    key={post.id}
                    className="border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-800">
                          <BookOpen className="size-4 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white max-w-[240px]">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-neutral-500 truncate">
                            /{post.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge className="bg-neutral-800 text-neutral-300 border-neutral-700 text-[10px] capitalize">
                          {post.category}
                        </Badge>
                      ) : (
                        <span className="text-xs text-neutral-600">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-neutral-400">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleTogglePublished(post)}
                        className={`group relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none ${
                          post.published
                            ? 'border-cyan-500/30 bg-cyan-500/20'
                            : 'border-neutral-700 bg-neutral-800'
                        }`}
                        title={post.published ? 'Click to unpublish' : 'Click to publish'}
                      >
                        <span
                          className={`pointer-events-none inline-block size-3.5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                            post.published
                              ? 'translate-x-4 bg-cyan-400'
                              : 'translate-x-0.5 bg-neutral-500'
                          }`}
                        />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.featured ? (
                          <Eye className="size-4 text-amber-400" />
                        ) : (
                          <EyeOff className="size-4 text-neutral-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(post)}
                          className="size-8 text-neutral-400 hover:text-cyan-400"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(post)}
                          className="size-8 text-neutral-400 hover:text-red-400"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-neutral-800 bg-neutral-900 text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingPost ? 'Edit Blog Post' : 'New Blog Post'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title & Slug */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-neutral-300">Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: f.slug === slugify(f.title) ? slugify(title) : f.slug,
                    }))
                  }}
                  placeholder="Post title"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="post-slug"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label className="text-neutral-300">Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
                placeholder="Brief summary of the post..."
                rows={2}
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="text-neutral-300">Content (Markdown) *</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="Write your blog content in Markdown..."
                rows={10}
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 font-mono text-sm"
              />
            </div>

            {/* Image, Category, Author, Read Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-neutral-300">Featured Image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="e.g. guides, news, reviews"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, author: e.target.value }))
                  }
                  placeholder="Morpheye"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Read Time (minutes)</Label>
                <Input
                  type="number"
                  value={form.readTime}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, readTime: e.target.value }))
                  }
                  placeholder="5"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-neutral-300">
                Tags (comma-separated)
              </Label>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="bitcoin, hardware wallet, security"
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, published: v }))
                  }
                />
                <Label className="text-neutral-300">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, featured: v }))
                  }
                />
                <Label className="text-neutral-300">Featured</Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-neutral-800 pt-4">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </span>
              ) : editingPost ? (
                'Update Post'
              ) : (
                'Create Post'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-neutral-800 bg-neutral-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Blog Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete &quot;{deletingPost?.title}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
