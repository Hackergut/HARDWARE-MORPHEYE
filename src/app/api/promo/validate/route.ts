import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      )
    }

    if (typeof cartTotal !== 'number' || cartTotal < 0) {
      return NextResponse.json(
        { error: 'Valid cart total is required' },
        { status: 400 }
      )
    }

    const promo = await db.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    })

    if (!promo) {
      return NextResponse.json(
        { error: 'Invalid promo code' },
        { status: 404 }
      )
    }

    if (!promo.active) {
      return NextResponse.json(
        { error: 'This promo code is no longer active' },
        { status: 400 }
      )
    }

    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return NextResponse.json(
        { error: 'This promo code has expired' },
        { status: 400 }
      )
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json(
        { error: 'This promo code has reached its usage limit' },
        { status: 400 }
      )
    }

    if (promo.minPurchase && cartTotal < promo.minPurchase) {
      return NextResponse.json(
        { error: `Minimum purchase of $${promo.minPurchase.toFixed(2)} required for this code` },
        { status: 400 }
      )
    }

    // Calculate discount amount
    let discountAmount = 0
    if (promo.type === 'percentage') {
      discountAmount = cartTotal * (promo.value / 100)
    } else {
      // Fixed amount discount
      discountAmount = Math.min(promo.value, cartTotal)
    }

    discountAmount = Math.round(discountAmount * 100) / 100

    return NextResponse.json({
      valid: true,
      promo: {
        id: promo.id,
        code: promo.code,
        description: promo.description,
        type: promo.type,
        value: promo.value,
        minPurchase: promo.minPurchase,
        discountAmount,
      },
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}
