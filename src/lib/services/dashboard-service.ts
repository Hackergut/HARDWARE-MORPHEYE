/**
 * Dashboard Service - Single Responsibility: Handle dashboard API operations
 */

import type { DashboardStats } from '@/lib/types'

export class DashboardService {
  private static baseUrl = '/api/admin/dashboard'

  static async getStats(): Promise<DashboardStats> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch dashboard stats')
    return res.json()
  }
}
