import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], categories: [] })
    }

    const [products, categories] = await Promise.all([
      db.product.findMany({
        where: {
          active: true,
          name: { contains: q },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
        },
        take: 5,
      }),
      db.category.findMany({
        where: {
          name: { contains: q },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 3,
      }),
    ])

    const parsedProducts = products.map((p) => ({
      ...p,
      images: (() => {
        try {
          return JSON.parse(p.images || '[]')
        } catch {
          return []
        }
      })(),
    }))

    return NextResponse.json({
      products: parsedProducts,
      categories,
    })
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
