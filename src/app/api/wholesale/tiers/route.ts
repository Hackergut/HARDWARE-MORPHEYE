import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tiers = await db.wholesaleTier.findMany({
      where: { active: true },
      orderBy: { minPoints: 'asc' },
    })
    return NextResponse.json({ tiers })
  } catch (error) {
    console.error('Error fetching wholesale tiers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wholesale tiers' },
      { status: 500 }
    )
  }
}
