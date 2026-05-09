import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/services/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, recipient, subject, body: emailBody } = body

    if (!type || !recipient) {
      return NextResponse.json(
        { error: 'Missing required fields: type, recipient' },
        { status: 400 }
      )
    }

    const validTypes = [
      'welcome',
      'abandoned_cart',
      'post_purchase',
      'win_back',
      'order_confirmation',
      'shipping_update',
      'review_request',
    ]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid email type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    if (!recipient || typeof recipient !== 'string' || !recipient.includes('@')) {
      return NextResponse.json(
        { error: 'A valid recipient email is required' },
        { status: 400 }
      )
    }

    await EmailService.send({
      type,
      recipient,
      subject: subject || null,
      body: emailBody || null,
    })

    return NextResponse.json(
      { message: 'Email queued successfully', type, recipient },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
