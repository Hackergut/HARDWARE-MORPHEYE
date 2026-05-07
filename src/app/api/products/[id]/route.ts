import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    if (!product || !product.active) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsed = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      specs: JSON.parse(product.specs || '{}'),
      tags: JSON.parse(product.tags || '[]'),
    }

    return NextResponse.json({ product: parsed })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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

    // Stringify JSON fields if they are objects
    const updateData: Record<string, unknown> = { ...body }
    if (updateData.images && typeof updateData.images !== 'string') {
      updateData.images = JSON.stringify(updateData.images)
    }
    if (updateData.specs && typeof updateData.specs !== 'string') {
      updateData.specs = JSON.stringify(updateData.specs)
    }
    if (updateData.tags && typeof updateData.tags !== 'string') {
      updateData.tags = JSON.stringify(updateData.tags)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Soft delete - set active to false
    const product = await db.product.update({
      where: { id },
      data: { active: false },
    })

    return NextResponse.json({
      product,
      message: 'Product deactivated successfully',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
