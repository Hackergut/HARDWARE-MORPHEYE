/**
 * Product Service - Single Responsibility: Handle all product-related API operations
 * Follows: Single Responsibility Principle (SRP) - Only handles product data operations
 * Follows: Open/Closed Principle (OCP) - Can be extended with new methods without modifying existing ones
 */

import type {
  ProductListItem,
  ProductDetail,
  ProductFormPayload,
  ProductFilters,
  ProductListResponse,
} from '@/lib/types'

export class ProductService {
  private static baseUrl = '/api/products'
  private static adminUrl = '/api/admin/products'

  static async list(filters?: ProductFilters): Promise<ProductListResponse> {
    const params = new URLSearchParams()
    if (filters?.category) params.set('category', filters.category)
    if (filters?.search) params.set('search', filters.search)
    if (filters?.featured) params.set('featured', 'true')
    if (filters?.brand) params.set('brand', filters.brand)
    if (filters?.sort) params.set('sort', filters.sort)
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))

    const res = await fetch(`${this.baseUrl}?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  }

  static async getById(id: string): Promise<ProductDetail> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch product')
    const data = await res.json()
    return data.product || data
  }

  static async create(payload: ProductFormPayload): Promise<ProductDetail> {
    const res = await fetch(this.adminUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create product')
    }
    return res.json()
  }

  static async update(id: string, payload: Partial<ProductFormPayload>): Promise<ProductDetail> {
    const res = await fetch(this.adminUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update product')
    }
    return res.json()
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete product')
  }

  static async listFeatured(limit = 8): Promise<ProductListItem[]> {
    const response = await this.list({ featured: true, limit })
    return response.products
  }
}
