/**
 * Settings Service - Single Responsibility: Handle site settings API operations
 */

import type { SiteSettings } from '@/lib/types'

export class SettingsService {
  private static baseUrl = '/api/settings'

  static async getAll(): Promise<SiteSettings> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch settings')
    return res.json()
  }

  static async update(key: string, value: string): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    if (!res.ok) throw new Error('Failed to update setting')
  }

  static async updateMany(settings: Record<string, string>): Promise<void> {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        this.update(key, value)
      )
    )
  }
}
