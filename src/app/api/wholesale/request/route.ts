import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mine = searchParams.get('mine')
    const userId = searchParams.get('userId')

    if (mine === 'true' && userId) {
      const req = await db.wholesaleRequest.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      if (!req) {
        return NextResponse.json(
          { error: 'No request found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ request: req })
    }

    if (mine === 'true') {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const requests = await db.wholesaleRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching wholesale requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wholesale requests' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id, status' },
        { status: 400 }
      )
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, approved, or rejected' },
        { status: 400 }
      )
    }

    const updated = await db.wholesaleRequest.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      },
    })

    if (status === 'approved') {
      await db.user.update({
        where: { id: updated.userId },
        data: { role: 'wholesale' },
      })
    }

    return NextResponse.json({ request: updated })
  } catch (error) {
    console.error('Error updating wholesale request:', error)
    return NextResponse.json(
      { error: 'Failed to update wholesale request' },
      { status: 500 }
    )
  }
}
