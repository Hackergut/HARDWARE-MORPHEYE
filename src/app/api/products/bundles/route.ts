import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter is required' },
        { status: 400 }
      )
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      select: { bundleIds: true, categoryId: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const bundleIds: string[] = (() => {
      try {
        const parsed = JSON.parse(product.bundleIds || '[]')
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    })()

    let products

    if (bundleIds.length > 0) {
      products = await db.product.findMany({
        where: {
          id: { in: bundleIds },
          active: true,
        },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      })
    } else {
      products = await db.product.findMany({
        where: {
          categoryId: product.categoryId,
          active: true,
          id: { not: productId },
        },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { rating: 'desc' },
        take: 3,
      })
    }

    const parsed = products.map((p) => ({
      ...p,
      images: (() => { try { return JSON.parse(p.images || '[]') } catch { return [] } })(),
    }))

    return NextResponse.json({ products: parsed })
  } catch (error) {
    console.error('Error fetching bundle products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle products' },
      { status: 500 }
    )
  }
}
