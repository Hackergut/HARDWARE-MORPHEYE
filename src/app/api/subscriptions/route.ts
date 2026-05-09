import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await db.user.findFirst({
      where: { role: 'customer' },
      orderBy: { createdAt: 'asc' },
    })

    if (!user) {
      return NextResponse.json({ subscriptions: [] })
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const enriched = await Promise.all(
      subscriptions.map(async (sub) => {
        const product = sub.productId
          ? await db.product.findUnique({
              where: { id: sub.productId },
              select: { name: true, images: true },
            })
          : null

        return {
          id: sub.id,
          userId: sub.userId,
          productId: sub.productId,
          productName: product?.name ?? null,
          productImage: product?.images
            ? (() => { try { return JSON.parse(product.images)[0] } catch { return null } })()
            : null,
          interval: sub.interval,
          price: sub.price,
          status: sub.status,
          nextDelivery: sub.nextDelivery?.toISOString() ?? null,
          lastOrderId: sub.lastOrderId,
          createdAt: sub.createdAt.toISOString(),
        }
      })
    )

    return NextResponse.json({ subscriptions: enriched })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, interval, price } = body

    if (!productId || !interval || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, interval, price' },
        { status: 400 }
      )
    }

    const validIntervals = ['weekly', 'monthly', 'quarterly', 'yearly']
    if (!validIntervals.includes(interval)) {
      return NextResponse.json(
        { error: `Invalid interval. Must be one of: ${validIntervals.join(', ')}` },
        { status: 400 }
      )
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
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

    const intervalMap: Record<string, number> = {
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      yearly: 365,
    }

    const nextDelivery = new Date()
    nextDelivery.setDate(nextDelivery.getDate() + (intervalMap[interval] || 30))

    const subscription = await db.subscription.create({
      data: {
        userId: user.id,
        productId,
        interval,
        price,
        nextDelivery,
        status: 'active',
      },
    })

    return NextResponse.json({ subscription }, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
