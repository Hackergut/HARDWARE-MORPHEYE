/**
 * Contact Service - Single Responsibility: Handle contact message API operations
 */

import type { ContactMessage, ContactCreatePayload } from '@/lib/types'

export class ContactService {
  private static baseUrl = '/api/contact'

  static async submit(payload: ContactCreatePayload): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to submit message')
  }

  static async listMessages(unreadOnly = false): Promise<ContactMessage[]> {
    const params = new URLSearchParams()
    if (unreadOnly) params.set('unread', 'true')

    const res = await fetch(`${this.baseUrl}/messages?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch messages')
    const data = await res.json()
    return data.messages || data
  }
}
