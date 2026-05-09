import { db } from '@/lib/db'

interface SaveCartParams {
  email: string
  name?: string | null
  items: string
  subtotal: number
  couponCode?: string | null
}

interface CartEntry {
  id: string
  email: string
  name: string | null
  items: string
  subtotal: number
  couponCode: string | null
  recovered: boolean
  sentAt: Date | null
  createdAt: Date
}

export class AbandonedCartService {
  static async save(params: SaveCartParams): Promise<CartEntry> {
    const existing = await db.abandonedCart.findFirst({
      where: { email: params.email, recovered: false },
      orderBy: { createdAt: 'desc' },
    })

    if (existing) {
      return db.abandonedCart.update({
        where: { id: existing.id },
        data: {
          items: params.items,
          subtotal: params.subtotal,
          couponCode: params.couponCode || null,
          name: params.name || null,
        },
      })
    }

    return db.abandonedCart.create({
      data: {
        email: params.email,
        name: params.name || null,
        items: params.items,
        subtotal: params.subtotal,
        couponCode: params.couponCode || null,
      },
    })
  }

  static async list(): Promise<CartEntry[]> {
    return db.abandonedCart.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  static async markRecovered(id: string): Promise<CartEntry> {
    return db.abandonedCart.update({
      where: { id },
      data: { recovered: true },
    })
  }

  static async markSent(id: string): Promise<CartEntry> {
    return db.abandonedCart.update({
      where: { id },
      data: { sentAt: new Date() },
    })
  }

  static async getUnrecovered(): Promise<CartEntry[]> {
    return db.abandonedCart.findMany({
      where: { recovered: false },
      orderBy: { createdAt: 'desc' },
    })
  }
}
