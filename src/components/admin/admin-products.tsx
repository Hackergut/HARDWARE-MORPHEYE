'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  Loader2,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useNotificationStore } from '@/store/notification-store'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  categoryId: string
  brand?: string | null
  sku?: string | null
  stock: number
  featured: boolean
  active: boolean
  specs: Record<string, string>
  tags: string[]
  rating: number
  reviewCount: number
  category?: { id: string; name: string; slug: string }
}

interface ProductForm {
  name: string
  slug: string
  shortDesc: string
  description: string
  price: string
  comparePrice: string
  brand: string
  sku: string
  stock: string
  categoryId: string
  featured: boolean
  active: boolean
  tags: string
  images: string[]
  specs: Array<{ key: string; value: string }>
}

const emptyForm: ProductForm = {
  name: '',
  slug: '',
  shortDesc: '',
  description: '',
  price: '',
  comparePrice: '',
  brand: '',
  sku: '',
  stock: '0',
  categoryId: '',
  featured: false,
  active: true,
  tags: '',
  images: [],
  specs: [],
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const showNotification = useNotificationStore((s) => s.show)

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filterCategory && filterCategory !== 'all')
        params.set('category', filterCategory)
      params.set('limit', '100')
      // For admin, also include inactive products - we'll fetch all
      const res = await fetch(`/api/products?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setProducts(json.products || [])
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }, [search, filterCategory])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const json = await res.json()
        setCategories(json.categories || [])
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openAddDialog = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    const specsObj = product.specs || {}
    const specsArr = Object.entries(specsObj).map(([key, value]) => ({
      key,
      value: String(value),
    }))
    setForm({
      name: product.name,
      slug: product.slug,
      shortDesc: product.shortDesc || '',
      description: product.description || '',
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      brand: product.brand || '',
      sku: product.sku || '',
      stock: String(product.stock),
      categoryId: product.categoryId,
      featured: product.featured,
      active: product.active,
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      images: Array.isArray(product.images) ? product.images : [],
      specs: specsArr,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setDeletingProduct(product)
    setDeleteOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      showNotification('Name, price, and category are required', 'error')
      return
    }

    setSaving(true)
    try {
      const specsObj: Record<string, string> = {}
      form.specs.forEach((s) => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim()
      })

      const tagsArr = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        shortDesc: form.shortDesc || null,
        description: form.description || null,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        brand: form.brand || null,
        sku: form.sku || null,
        stock: parseInt(form.stock, 10),
        categoryId: form.categoryId,
        featured: form.featured,
        active: form.active,
        images: form.images,
        specs: specsObj,
        tags: tagsArr,
      }

      let res: Response
      if (editingProduct) {
        res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        })
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        showNotification(
          editingProduct ? 'Product updated' : 'Product created',
          'success'
        )
        setDialogOpen(false)
        fetchProducts()
      } else {
        const json = await res.json()
        showNotification(json.error || 'Failed to save product', 'error')
      }
    } catch {
      showNotification('Failed to save product', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showNotification('Product deleted', 'success')
        setDeleteOpen(false)
        setDeletingProduct(null)
        fetchProducts()
      } else {
        showNotification('Failed to delete product', 'error')
      }
    } catch {
      showNotification('Failed to delete product', 'error')
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, active: !product.active }),
      })
      if (res.ok) {
        showNotification(product.active ? 'Product deactivated' : 'Product activated', 'success')
        fetchProducts()
      } else {
        showNotification('Failed to update product status', 'error')
      }
    } catch {
      showNotification('Failed to update product status', 'error')
    }
  }

  const addImageField = () => {
    setForm((f) => ({ ...f, images: [...f.images, ''] }))
  }

  const updateImage = (index: number, value: string) => {
    setForm((f) => {
      const images = [...f.images]
      images[index] = value
      return { ...f, images }
    })
  }

  const removeImage = (index: number) => {
    setForm((f) => {
      const images = f.images.filter((_, i) => i !== index)
      return { ...f, images }
    })
  }

  const addSpec = () => {
    setForm((f) => ({ ...f, specs: [...f.specs, { key: '', value: '' }] }))
  }

  const updateSpec = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setForm((f) => {
      const specs = [...f.specs]
      specs[index] = { ...specs[index], [field]: value }
      return { ...f, specs }
    })
  }

  const removeSpec = (index: number) => {
    setForm((f) => ({
      ...f,
      specs: f.specs.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-40 bg-neutral-800" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 bg-neutral-800" />
          <Skeleton className="h-10 w-32 bg-neutral-800" />
          <Skeleton className="h-10 w-32 bg-neutral-800" />
        </div>
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
            Products
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your product catalog
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
        >
          <Plus className="mr-2 size-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border-neutral-700 bg-neutral-800 pl-9 text-white placeholder:text-neutral-500"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full border-neutral-700 bg-neutral-800 text-white sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="border-neutral-700 bg-neutral-900">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Product</TableHead>
                <TableHead className="text-neutral-400">Brand</TableHead>
                <TableHead className="text-neutral-400">Price</TableHead>
                <TableHead className="text-neutral-400">Stock</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-right text-neutral-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-neutral-400"
                  >
                    <Package className="mx-auto mb-2 size-8 text-neutral-600" />
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 overflow-hidden rounded-lg bg-neutral-800">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
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
                        <div>
                          <p className="text-sm font-medium text-white">
                            {product.name}
                          </p>
                          {product.featured && (
                            <Badge className="mt-0.5 bg-cyan-500/10 text-[9px] text-cyan-400 border-cyan-500/20">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-300">
                      {product.brand || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-cyan-400">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.comparePrice &&
                        product.comparePrice > product.price && (
                          <span className="ml-1 text-xs text-neutral-500 line-through">
                            ${product.comparePrice.toFixed(2)}
                          </span>
                        )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            product.stock <= 5
                              ? 'text-red-400'
                              : product.stock <= 20
                                ? 'text-yellow-400'
                                : 'text-white'
                          }`}
                        >
                          {product.stock}
                        </span>
                        <div className="w-12 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              product.stock <= 5
                                ? 'bg-red-400 w-[15%]'
                                : product.stock <= 20
                                  ? 'bg-yellow-400 w-[40%]'
                                  : product.stock <= 50
                                    ? 'bg-cyan-400 w-[70%]'
                                    : 'bg-emerald-400 w-full'
                            }`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`group relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none ${
                          product.active
                            ? 'border-cyan-500/30 bg-cyan-500/20'
                            : 'border-neutral-700 bg-neutral-800'
                        }`}
                        title={product.active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        <span
                          className={`pointer-events-none inline-block size-3.5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                            product.active
                              ? 'translate-x-4 bg-cyan-400'
                              : 'translate-x-0.5 bg-neutral-500'
                          }`}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                          className="size-8 text-neutral-400 hover:text-cyan-400"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(product)}
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
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name & Slug */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-neutral-300">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: f.slug === slugify(f.name) ? slugify(name) : f.slug,
                    }))
                  }}
                  placeholder="Product name"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="product-slug"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label className="text-neutral-300">Short Description</Label>
              <Input
                value={form.shortDesc}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDesc: e.target.value }))
                }
                placeholder="Brief product description"
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <Label className="text-neutral-300">Full Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Detailed product description..."
                rows={3}
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Price, Compare Price, Brand, SKU */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-neutral-300">Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="0.00"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Compare Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, comparePrice: e.target.value }))
                  }
                  placeholder="0.00"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Brand</Label>
                <Input
                  value={form.brand}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, brand: e.target.value }))
                  }
                  placeholder="Brand name"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">SKU</Label>
                <Input
                  value={form.sku}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sku: e.target.value }))
                  }
                  placeholder="SKU-001"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Stock & Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-neutral-300">Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  placeholder="0"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300">Category *</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, categoryId: v }))
                  }
                >
                  <SelectTrigger className="border-neutral-700 bg-neutral-800 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-700 bg-neutral-900">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, featured: v }))
                  }
                />
                <Label className="text-neutral-300">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, active: v }))
                  }
                />
                <Label className="text-neutral-300">Active</Label>
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
                placeholder="hardware wallet, bitcoin, secure"
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-neutral-300">Image URLs</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addImageField}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Plus className="mr-1 size-3" />
                  Add Image
                </Button>
              </div>
              <div className="space-y-2">
                {form.images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={img}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="shrink-0 text-neutral-400 hover:text-red-400"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                {form.images.length === 0 && (
                  <p className="text-xs text-neutral-500">
                    No images added yet
                  </p>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-neutral-300">Specifications</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addSpec}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Plus className="mr-1 size-3" />
                  Add Spec
                </Button>
              </div>
              <div className="space-y-2">
                {form.specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec.key}
                      onChange={(e) =>
                        updateSpec(index, 'key', e.target.value)
                      }
                      placeholder="Key"
                      className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) =>
                        updateSpec(index, 'value', e.target.value)
                      }
                      placeholder="Value"
                      className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpec(index)}
                      className="shrink-0 text-neutral-400 hover:text-red-400"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                {form.specs.length === 0 && (
                  <p className="text-xs text-neutral-500">
                    No specifications added yet
                  </p>
                )}
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
              ) : editingProduct ? (
                'Update Product'
              ) : (
                'Create Product'
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
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete &quot;{deletingProduct?.name}
              &quot;? This action will deactivate the product.
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
