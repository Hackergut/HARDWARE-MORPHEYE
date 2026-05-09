import { db } from '@/lib/db'
import type { EmailType } from '@/lib/types'

interface EmailPayload {
  type: EmailType
  recipient: string
  subject?: string
  body?: string
}

interface UserInfo {
  email: string
  name?: string | null
}

interface OrderInfo {
  orderNumber: string
  customerEmail: string
  customerName: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
}

interface CartItemInfo {
  name: string
  quantity: number
  price: number
}

export class EmailService {
  static async send({ type, recipient, subject, body }: EmailPayload): Promise<void> {
    try {
      await db.emailLog.create({
        data: {
          type,
          recipient,
          subject: subject || null,
          sent: true,
          createdAt: new Date(),
        },
      })
    } catch (error) {
      await db.emailLog.create({
        data: {
          type,
          recipient,
          subject: subject || null,
          sent: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          createdAt: new Date(),
        },
      })
      console.error(`Failed to send ${type} email to ${recipient}:`, error)
    }
  }

  static async sendWelcome(user: UserInfo): Promise<void> {
    const subject = 'Welcome to Morpheye – Secure Your Crypto'
    const body = `
      <h1>Welcome to Morpheye, ${user.name || 'Crypto Enthusiast'}!</h1>
      <p>Thank you for joining the most trusted hardware wallet store.</p>
      <p>Use code <strong>WELCOME10</strong> for 10% off your first order.</p>
    `

    await this.send({
      type: 'welcome',
      recipient: user.email,
      subject,
      body,
    })
  }

  static async sendOrderConfirmation(order: OrderInfo): Promise<void> {
    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">x${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join('')

    const subject = `Order Confirmed – #${order.orderNumber}`
    const body = `
      <h1>Thank you for your order, ${order.customerName}!</h1>
      <p>Your order <strong>#${order.orderNumber}</strong> has been confirmed.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;text-align:left;">Item</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="font-size:18px;font-weight:bold;">Total: $${order.total.toFixed(2)}</p>
    `

    await this.send({
      type: 'order_confirmation',
      recipient: order.customerEmail,
      subject,
      body,
    })
  }

  static async sendAbandonedCart(email: string, items: CartItemInfo[]): Promise<void> {
    const itemsList = items
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(', ')

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const subject = 'Your cart is waiting – Complete your purchase!'
    const body = `
      <h1>You left something behind!</h1>
      <p>Your cart with <strong>${items.length} item(s)</strong> is still waiting:</p>
      <p>${itemsList}</p>
      <p style="font-size:18px;font-weight:bold;">Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Come back and complete your purchase to secure your crypto assets.</p>
    `

    await this.send({
      type: 'abandoned_cart',
      recipient: email,
      subject,
      body,
    })
  }

  static async sendWinBack(email: string): Promise<void> {
    const subject = 'We miss you – Special offer inside!'
    const body = `
      <h1>We haven't seen you in a while!</h1>
      <p>As a valued customer, here's an exclusive <strong>15% off</strong> your next purchase.</p>
      <p>Use code <strong>MISSYOU15</strong> at checkout.</p>
    `

    await this.send({
      type: 'win_back',
      recipient: email,
      subject,
      body,
    })
  }

  static async sendReviewRequest(order: OrderInfo): Promise<void> {
    const subject = `How was your ${order.items[0]?.name || 'purchase'}?`
    const body = `
      <h1>We'd love your feedback!</h1>
      <p>Hi ${order.customerName}, we hope you're enjoying your new hardware wallet.</p>
      <p>Please take a moment to leave a review – your feedback helps other crypto enthusiasts make informed decisions.</p>
    `

    await this.send({
      type: 'review_request',
      recipient: order.customerEmail,
      subject,
      body,
    })
  }

  static async sendShippingUpdate(email: string, orderNumber: string): Promise<void> {
    const subject = `Your order #${orderNumber} has shipped!`
    const body = `
      <h1>Your order is on the way!</h1>
      <p>Order <strong>#${orderNumber}</strong> has been shipped and is on its way to you.</p>
      <p>Track your package to know exactly when it will arrive.</p>
    `

    await this.send({
      type: 'shipping_update',
      recipient: email,
      subject,
      body,
    })
  }
}
