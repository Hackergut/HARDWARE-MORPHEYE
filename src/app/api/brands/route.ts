import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const brands = await db.product.groupBy({
      by: ['brand'],
      where: {
        active: true,
        brand: { not: null },
      },
      _count: {
        id: true,
      },
      _min: {
        price: true,
      },
    })

    const brandData = brands
      .filter((b) => b.brand !== null)
      .map((b) => ({
        name: b.brand,
        productCount: b._count.id,
        minPrice: b._min.price,
      }))
      .sort((a, b) => b.productCount - a.productCount)

    return NextResponse.json({ brands: brandData })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}
