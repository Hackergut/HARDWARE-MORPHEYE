import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      )
    }

    // Validate order number format: MRP-XXXXXXXX-XXXX
    const orderNumberPattern = /^MRP-\d{8}-[A-Z0-9]{4}$/i
    if (!orderNumberPattern.test(orderNumber)) {
      return NextResponse.json(
        { error: 'Invalid order number format. Expected: MRP-XXXXXXXX-XXXX' },
        { status: 400 }
      )
    }

    const order = await db.order.findUnique({
      where: { orderNumber: orderNumber.toUpperCase() },
      include: {
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    )
  }
}
