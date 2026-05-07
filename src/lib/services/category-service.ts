/**
 * Category Service - Single Responsibility: Handle category-related API operations
 */

import type { CategoryWithCount, CategoryListResponse } from '@/lib/types'

export class CategoryService {
  private static baseUrl = '/api/categories'

  static async list(): Promise<CategoryWithCount[]> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch categories')
    const data: CategoryListResponse = await res.json()
    return data.categories || data
  }
}
