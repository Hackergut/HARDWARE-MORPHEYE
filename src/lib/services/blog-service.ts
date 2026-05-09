import type { BlogPost } from '@/lib/types'

export class BlogService {
  private static baseUrl = '/api/blog'

  static async list(filters?: {
    page?: number
    limit?: number
    category?: string
  }): Promise<{ posts: BlogPost[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const params = new URLSearchParams()
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    if (filters?.category) params.set('category', filters.category)

    const res = await fetch(`${this.baseUrl}?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch blog posts')
    return res.json()
  }

  static async getBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${this.baseUrl}/${slug}`)
    if (!res.ok) throw new Error('Failed to fetch blog post')
    const data = await res.json()
    return data.post
  }

  static async create(payload: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create blog post')
    }
    return res.json()
  }

  static async update(id: string, payload: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update blog post')
    }
    const data = await res.json()
    return data.post
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete blog post')
  }
}
