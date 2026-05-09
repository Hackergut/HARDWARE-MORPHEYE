import { NextRequest, NextResponse } from 'next/server'
import { AbandonedCartService } from '@/lib/services/abandoned-cart-service'

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    const cart = await AbandonedCartService.markRecovered(id)

    return NextResponse.json(
      { message: 'Cart marked as recovered', cart },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating abandoned cart:', error)
    return NextResponse.json(
      { error: 'Failed to update abandoned cart' },
      { status: 500 }
    )
  }
}
