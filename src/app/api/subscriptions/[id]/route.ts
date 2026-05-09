import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const subscription = await db.subscription.findUnique({
      where: { id },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, interval } = body

    const existing = await db.subscription.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'pause': {
        if (existing.status !== 'active') {
          return NextResponse.json(
            { error: 'Only active subscriptions can be paused' },
            { status: 400 }
          )
        }
        await db.subscription.update({
          where: { id },
          data: {
            status: 'paused',
            pauseUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
        return NextResponse.json({ message: 'Subscription paused successfully' })
      }

      case 'resume': {
        if (existing.status !== 'paused') {
          return NextResponse.json(
            { error: 'Only paused subscriptions can be resumed' },
            { status: 400 }
          )
        }
        const intervalMap: Record<string, number> = {
          weekly: 7,
          monthly: 30,
          quarterly: 90,
          yearly: 365,
        }
        const nextDelivery = new Date()
        nextDelivery.setDate(nextDelivery.getDate() + (intervalMap[existing.interval] || 30))

        await db.subscription.update({
          where: { id },
          data: {
            status: 'active',
            pauseUntil: null,
            nextDelivery,
          },
        })
        return NextResponse.json({ message: 'Subscription resumed successfully' })
      }

      case 'cancel': {
        if (existing.status === 'cancelled') {
          return NextResponse.json(
            { error: 'Subscription is already cancelled' },
            { status: 400 }
          )
        }
        await db.subscription.update({
          where: { id },
          data: {
            status: 'cancelled',
            cancelledAt: new Date(),
          },
        })
        return NextResponse.json({ message: 'Subscription cancelled successfully' })
      }

      case 'updateInterval': {
        const validIntervals = ['weekly', 'monthly', 'quarterly', 'yearly']
        if (!interval || !validIntervals.includes(interval)) {
          return NextResponse.json(
            { error: `Invalid interval. Must be one of: ${validIntervals.join(', ')}` },
            { status: 400 }
          )
        }
        await db.subscription.update({
          where: { id },
          data: { interval },
        })
        return NextResponse.json({ message: `Interval updated to ${interval}` })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be: pause, resume, cancel, or updateInterval' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.subscription.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    await db.subscription.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Subscription deleted successfully' })
  } catch (error) {
    console.error('Error deleting subscription:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    )
  }
}
