import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      slug,
      description,
      shortDesc,
      price,
      comparePrice,
      images,
      categoryId,
      brand,
      sku,
      stock,
      featured,
      specs,
      tags,
      rating,
      reviewCount,
    } = body

    // Validate required fields
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, price, categoryId' },
        { status: 400 }
      )
    }

    // Stringify JSON fields if they are objects
    const imagesStr = typeof images === 'string' ? images : JSON.stringify(images || [])
    const specsStr = typeof specs === 'string' ? specs : JSON.stringify(specs || {})
    const tagsStr = typeof tags === 'string' ? tags : JSON.stringify(tags || [])

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description || null,
        shortDesc: shortDesc || null,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images: imagesStr,
        categoryId,
        brand: brand || null,
        sku: sku || null,
        stock: stock ? parseInt(stock, 10) : 0,
        featured: featured || false,
        specs: specsStr,
        tags: tagsStr,
        rating: rating ? parseFloat(rating) : 0,
        reviewCount: reviewCount ? parseInt(reviewCount, 10) : 0,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    // Parse JSON fields for response
    const parsed = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      specs: JSON.parse(product.specs || '{}'),
      tags: JSON.parse(product.tags || '[]'),
    }

    return NextResponse.json({ product: parsed }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Stringify JSON fields if they are objects
    if (updateData.images && typeof updateData.images !== 'string') {
      updateData.images = JSON.stringify(updateData.images)
    }
    if (updateData.specs && typeof updateData.specs !== 'string') {
      updateData.specs = JSON.stringify(updateData.specs)
    }
    if (updateData.tags && typeof updateData.tags !== 'string') {
      updateData.tags = JSON.stringify(updateData.tags)
    }

    // Convert numeric fields
    if (updateData.price !== undefined) {
      updateData.price = parseFloat(updateData.price)
    }
    if (updateData.comparePrice !== undefined) {
      updateData.comparePrice = updateData.comparePrice
        ? parseFloat(updateData.comparePrice)
        : null
    }
    if (updateData.stock !== undefined) {
      updateData.stock = parseInt(updateData.stock, 10)
    }
    if (updateData.rating !== undefined) {
      updateData.rating = parseFloat(updateData.rating)
    }
    if (updateData.reviewCount !== undefined) {
      updateData.reviewCount = parseInt(updateData.reviewCount, 10)
    }

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    // Parse JSON fields for response
    const parsed = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      specs: JSON.parse(product.specs || '{}'),
      tags: JSON.parse(product.tags || '[]'),
    }

    return NextResponse.json({ product: parsed })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
