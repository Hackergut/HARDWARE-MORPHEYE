import { NextRequest, NextResponse } from 'next/server'
import { AbandonedCartService } from '@/lib/services/abandoned-cart-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, items, subtotal, couponCode } = body

    if (!email || !items || subtotal === undefined || subtotal === null) {
      return NextResponse.json(
        { error: 'Missing required fields: email, items, subtotal' },
        { status: 400 }
      )
    }

    if (typeof subtotal !== 'number' || subtotal < 0) {
      return NextResponse.json(
        { error: 'A valid subtotal is required' },
        { status: 400 }
      )
    }

    const cart = await AbandonedCartService.save({
      email,
      name: name || null,
      items: typeof items === 'string' ? items : JSON.stringify(items),
      subtotal,
      couponCode: couponCode || null,
    })

    return NextResponse.json(
      { message: 'Cart saved successfully', cart },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving abandoned cart:', error)
    return NextResponse.json(
      { error: 'Failed to save abandoned cart' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const carts = await AbandonedCartService.list()

    return NextResponse.json({ carts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching abandoned carts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    )
  }
}
