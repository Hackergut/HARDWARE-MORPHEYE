import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await db.user.findFirst({
      where: { role: 'customer' },
      orderBy: { createdAt: 'asc' },
    })

    const referralCode = user?.referralCode || ''

    if (!referralCode && user) {
      const code = user.name
        ? user.name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).substring(2, 6)
        : 'morpheye' + Math.random().toString(36).substring(2, 6)

      await db.user.update({
        where: { id: user.id },
        data: { referralCode: code },
      })

      return NextResponse.json({ referralCode: code })
    }

    return NextResponse.json({ referralCode })
  } catch (error) {
    console.error('Error fetching referral code:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral code' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode } = body

    if (!referralCode) {
      return NextResponse.json(
        { error: 'referralCode is required' },
        { status: 400 }
      )
    }

    const referrer = await db.user.findUnique({
      where: { referralCode },
    })

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    const settings = await db.siteSetting.findMany()
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    const referralPoints = parseInt(settingsMap.referral_points || '500', 10)

    await db.user.update({
      where: { id: referrer.id },
      data: { loyaltyPoints: { increment: referralPoints } },
    })

    return NextResponse.json({
      message: 'Referral code applied successfully',
      pointsAwarded: referralPoints,
    })
  } catch (error) {
    console.error('Error applying referral:', error)
    return NextResponse.json(
      { error: 'Failed to apply referral code' },
      { status: 500 }
    )
  }
}
