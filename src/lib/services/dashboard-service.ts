/**
 * Dashboard Service - Single Responsibility: Handle dashboard API operations
 */

import type { DashboardStats } from '@/lib/types'

interface WholesaleStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export class DashboardService {
  private static baseUrl = '/api/admin/dashboard'

  static async getStats(): Promise<DashboardStats> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch dashboard stats')
    return res.json()
  }

  static async getWholesaleStats(): Promise<WholesaleStats> {
    const res = await fetch('/api/wholesale/stats')
    if (!res.ok) throw new Error('Failed to fetch wholesale stats')
    const data = await res.json()
    return data.stats || data
  }

  static async getSubscriptionCount(): Promise<number> {
    const res = await fetch('/api/subscriptions/count')
    if (!res.ok) throw new Error('Failed to fetch subscription count')
    const data = await res.json()
    return data.count ?? 0
  }

  static async getAbandonedCartCount(): Promise<number> {
    const res = await fetch('/api/abandoned-cart/count')
    if (!res.ok) throw new Error('Failed to fetch abandoned cart count')
    const data = await res.json()
    return data.count ?? 0
  }
}
