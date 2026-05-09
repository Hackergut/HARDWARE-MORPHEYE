import type { LoyaltyReward } from '@/lib/types'

export class LoyaltyService {
  private static baseUrl = '/api/loyalty'

  static async getPoints(): Promise<number> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch loyalty points')
    const data = await res.json()
    return data.points ?? 0
  }

  static async getTier(): Promise<string> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch loyalty tier')
    const data = await res.json()
    return data.tier ?? 'bronze'
  }

  static async getReferralCode(): Promise<string> {
    const res = await fetch(`${this.baseUrl}/referral`)
    if (!res.ok) throw new Error('Failed to fetch referral code')
    const data = await res.json()
    return data.referralCode ?? ''
  }

  static async getRewards(): Promise<LoyaltyReward[]> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch rewards')
    const data = await res.json()
    return data.rewards ?? []
  }

  static async redeemReward(rewardId: string): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'redeem', rewardId }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to redeem reward')
    }
  }

  static async getHistory(): Promise<any[]> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch history')
    const data = await res.json()
    return data.history ?? []
  }
}
