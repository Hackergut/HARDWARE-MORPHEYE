import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, vatNumber, companyReg, phone, notes, userId } = body

    if (!businessName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, phone' },
        { status: 400 }
      )
    }

    const wholesaleRequest = await db.wholesaleRequest.create({
      data: {
        userId: userId || 'anonymous',
        businessName,
        vatNumber: vatNumber || null,
        companyReg: companyReg || null,
        phone,
        notes: notes || null,
        status: 'pending',
      },
    })

    return NextResponse.json({ request: wholesaleRequest }, { status: 201 })
  } catch (error) {
    console.error('Error creating wholesale request:', error)
    return NextResponse.json(
      { error: 'Failed to create wholesale request' },
      { status: 500 }
    )
  }
}
