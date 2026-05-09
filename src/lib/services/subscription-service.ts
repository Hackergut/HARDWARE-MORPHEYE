import type { Subscription, SubscriptionInterval } from '@/lib/types'

export class SubscriptionService {
  private static baseUrl = '/api/subscriptions'

  static async list(): Promise<Subscription[]> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch subscriptions')
    const data = await res.json()
    return data.subscriptions ?? data
  }

  static async create(payload: {
    productId: string
    interval: SubscriptionInterval
    price: number
  }): Promise<Subscription> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create subscription')
    }
    const data = await res.json()
    return data.subscription ?? data
  }

  static async pause(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pause' }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to pause subscription')
    }
  }

  static async resume(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resume' }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to resume subscription')
    }
  }

  static async cancel(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to cancel subscription')
    }
  }

  static async updateInterval(id: string, interval: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateInterval', interval }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update interval')
    }
  }
}
