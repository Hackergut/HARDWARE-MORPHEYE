import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, minPoints, discountPct, minOrder, netTermDays, description, active } = body

    const tier = await db.wholesaleTier.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(minPoints !== undefined && { minPoints }),
        ...(discountPct !== undefined && { discountPct }),
        ...(minOrder !== undefined && { minOrder }),
        ...(netTermDays !== undefined && { netTermDays }),
        ...(description !== undefined && { description }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json({ tier })
  } catch (error) {
    console.error('Error updating wholesale tier:', error)
    return NextResponse.json(
      { error: 'Failed to update wholesale tier' },
      { status: 500 }
    )
  }
}
