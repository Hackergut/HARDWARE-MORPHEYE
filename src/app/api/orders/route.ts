import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddr,
      shippingCity,
      shippingCountry,
      shippingZip,
      items,
      paymentMethod,
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, items' },
        { status: 400 }
      )
    }

    // Validate each item has productId and quantity
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Each item must have productId and quantity (min 1)' },
          { status: 400 }
        )
      }
    }

    // Fetch all products from the order
    const productIds = items.map((item: { productId: string }) => item.productId)
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
    })

    // Build a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]))

    // Validate all products exist and are active
    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product not found or inactive: ${item.productId}` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.name} (available: ${product.stock})` },
          { status: 400 }
        )
      }
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
      const product = productMap.get(item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    // Calculate shipping: free for orders over $150, otherwise $9.99
    const shipping = subtotal > 150 ? 0 : 9.99

    // Tax rate: 0% (configurable via settings)
    const taxRate = 0
    const tax = subtotal * taxRate

    const total = subtotal + shipping + tax

    // Generate unique order number
    const now = new Date()
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0')
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
    const orderNumber = `MRP-${dateStr}-${randomPart}`

    // Create order with order items in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          shippingAddr: shippingAddr || null,
          shippingCity: shippingCity || null,
          shippingCountry: shippingCountry || null,
          shippingZip: shippingZip || null,
          paymentMethod: paymentMethod || null,
          subtotal,
          shipping,
          tax,
          total,
          items: {
            create: items.map((item: { productId: string; quantity: number }) => {
              const product = productMap.get(item.productId)!
              const images = JSON.parse(product.images || '[]')
              return {
                productId: item.productId,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: images[0] || null,
              }
            }),
          },
        },
        include: {
          items: true,
        },
      })

      // Decrease stock for each product
      for (const item of items) {
        const product = productMap.get(item.productId)!
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        })
      }

      return newOrder
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
