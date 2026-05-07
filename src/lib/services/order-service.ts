/**
 * Order Service - Single Responsibility: Handle all order-related API operations
 * Follows: SRP - Only handles order data operations
 * Follows: OCP - Extensible for new order operations
 */

import type {
  OrderBase,
  OrderDetail,
  OrderCreatePayload,
  OrderStatus,
} from '@/lib/types'

export class OrderService {
  private static baseUrl = '/api/orders'

  static async list(filters?: { status?: OrderStatus; search?: string }): Promise<OrderBase[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.search) params.set('search', filters.search)

    const res = await fetch(`${this.baseUrl}?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch orders')
    const data = await res.json()
    return data.orders || data
  }

  static async getById(id: string): Promise<OrderDetail> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch order')
    const data = await res.json()
    return data.order || data
  }

  static async create(payload: OrderCreatePayload): Promise<OrderDetail> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create order')
    }
    return res.json()
  }

  static async updateStatus(
    id: string,
    status: OrderStatus,
    paymentStatus?: string
  ): Promise<OrderDetail> {
    const body: Record<string, string> = { status }
    if (paymentStatus) body.paymentStatus = paymentStatus

    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Failed to update order')
    return res.json()
  }

  static generateOrderNumber(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `MRP-${dateStr}-${rand}`
  }
}
