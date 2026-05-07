import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const sort = searchParams.get('sort') || 'newest'

    const skip = (page - 1) * limit

    const where = { productId: id }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'highest') orderBy = { rating: 'desc' }
    else if (sort === 'lowest') orderBy = { rating: 'asc' }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.review.count({ where }),
    ])

    // Calculate rating distribution
    const ratingCounts = await db.review.groupBy({
      by: ['rating'],
      where: { productId: id },
      _count: { rating: true },
    })

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratingCounts.forEach((rc) => {
      distribution[rc.rating] = rc._count.rating
    })

    const avgRating = await db.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: true,
    })

    return NextResponse.json({
      reviews,
      summary: {
        average: avgRating._avg.rating ?? 0,
        total: avgRating._count,
        distribution,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { author, rating, title, comment, verified } = body

    // Validate required fields
    if (!author || typeof author !== 'string' || author.trim().length === 0) {
      return NextResponse.json(
        { error: 'Author name is required' },
        { status: 400 }
      )
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check product exists
    const product = await db.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const review = await db.review.create({
      data: {
        productId: id,
        author: author.trim(),
        rating: Math.round(rating),
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        verified: verified ?? false,
      },
    })

    // Update product rating and review count
    const agg = await db.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: true,
    })

    await db.product.update({
      where: { id },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
