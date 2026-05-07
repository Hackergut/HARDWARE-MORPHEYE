import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Run independent queries in parallel
    const [
      totalProducts,
      totalOrders,
      revenueResult,
      recentOrders,
      ordersByStatus,
      topProducts,
    ] = await Promise.all([
      // Total active products
      db.product.count({ where: { active: true } }),

      // Total orders
      db.order.count(),

      // Total revenue (sum of all order totals)
      db.order.aggregate({
        _sum: {
          total: true,
        },
      }),

      // Recent 5 orders with items
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            select: {
              id: true,
              name: true,
              price: true,
              quantity: true,
            },
          },
        },
      }),

      // Orders grouped by status
      db.order.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),

      // Top 5 products by review count
      db.product.findMany({
        where: { active: true },
        orderBy: { reviewCount: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          rating: true,
          reviewCount: true,
          images: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
    ])

    // Format orders by status into a map
    const statusMap: Record<string, number> = {}
    for (const entry of ordersByStatus) {
      statusMap[entry.status] = entry._count.status
    }

    // Parse JSON fields in top products
    const parsedTopProducts = topProducts.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
    }))

    // Parse JSON fields in recent orders' items
    const parsedRecentOrders = recentOrders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
      })),
    }))

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
      recentOrders: parsedRecentOrders,
      ordersByStatus: statusMap,
      topProducts: parsedTopProducts,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
