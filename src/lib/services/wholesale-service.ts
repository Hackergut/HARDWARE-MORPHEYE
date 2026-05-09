import type { WholesaleTier, WholesaleRequest, WholesaleRequestPayload } from '@/lib/types'

export class WholesaleService {
  private static baseUrl = '/api/wholesale'

  static async requestAccess(payload: WholesaleRequestPayload): Promise<WholesaleRequest> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to submit wholesale request')
    }
    const data = await res.json()
    return data.request || data
  }

  static async getRequests(): Promise<WholesaleRequest[]> {
    const res = await fetch(`${this.baseUrl}/request`)
    if (!res.ok) throw new Error('Failed to fetch wholesale requests')
    const data = await res.json()
    return data.requests || data
  }

  static async getTiers(): Promise<WholesaleTier[]> {
    const res = await fetch(`${this.baseUrl}/tiers`)
    if (!res.ok) throw new Error('Failed to fetch wholesale tiers')
    const data = await res.json()
    return data.tiers || data
  }

  static async updateRequestStatus(id: string, status: string): Promise<WholesaleRequest> {
    const res = await fetch(`${this.baseUrl}/request`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update request status')
    }
    const data = await res.json()
    return data.request || data
  }

  static async getMyRequest(): Promise<WholesaleRequest | null> {
    const res = await fetch(`${this.baseUrl}/request?mine=true`)
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to fetch your wholesale request')
    }
    const data = await res.json()
    return data.request || data
  }
}
