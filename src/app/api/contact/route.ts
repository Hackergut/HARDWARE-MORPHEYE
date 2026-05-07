import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      )
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
    })

    return NextResponse.json(
      { message: 'Contact message submitted successfully', contactMessage },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting contact message:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact message' },
      { status: 500 }
    )
  }
}
