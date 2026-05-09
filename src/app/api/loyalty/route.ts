import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import type { LoyaltyReward } from '@/lib/types'

export async function GET() {
  try {
    const user = await db.user.findFirst({
      where: { role: 'customer' },
      orderBy: { createdAt: 'asc' },
    })

    const points = user?.loyaltyPoints ?? 0
    const tier = user?.loyaltyTier ?? 'bronze'

    const rewardProducts = await db.product.findMany({
      where: { isReward: true, active: true },
    })

    const rewards: LoyaltyReward[] = rewardProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.shortDesc,
      pointsCost: p.rewardCost ?? 0,
      type: 'product' as const,
      value: p.price.toString(),
      active: true,
      image: (() => { try { return JSON.parse(p.images || '[]')[0] } catch { return null } })(),
    }))

    const history: any[] = []

    return NextResponse.json({
      points,
      tier,
      rewards,
      history,
      nextTierPoints: tier === 'bronze' ? 500 : tier === 'silver' ? 2000 : tier === 'gold' ? 5000 : 5000,
      tierProgress: tier === 'bronze' ? points / 500 : tier === 'silver' ? points / 2000 : tier === 'gold' ? points / 5000 : 1,
    })
  } catch (error) {
    console.error('Error fetching loyalty data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, rewardId } = body

    if (action === 'redeem') {
      if (!rewardId) {
        return NextResponse.json(
          { error: 'rewardId is required' },
          { status: 400 }
        )
      }

      const reward = await db.product.findUnique({
        where: { id: rewardId },
      })

      if (!reward || !reward.isReward) {
        return NextResponse.json(
          { error: 'Reward not found or inactive' },
          { status: 404 }
        )
      }

      const user = await db.user.findFirst({
        where: { role: 'customer' },
        orderBy: { createdAt: 'asc' },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const cost = reward.rewardCost ?? 0
      if (user.loyaltyPoints < cost) {
        return NextResponse.json(
          { error: 'Insufficient points' },
          { status: 400 }
        )
      }

      await db.user.update({
        where: { id: user.id },
        data: { loyaltyPoints: user.loyaltyPoints - cost },
      })

      return NextResponse.json({
        message: `Successfully redeemed ${reward.name}`,
        pointsRemaining: user.loyaltyPoints - cost,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing loyalty action:', error)
    return NextResponse.json(
      { error: 'Failed to process loyalty action' },
      { status: 500 }
    )
  }
}
