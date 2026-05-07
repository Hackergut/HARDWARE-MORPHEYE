'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Mail,
  MailOpen,
  Search,
  Inbox,
  Clock,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
  _localRead?: boolean
}

export function AdminContact() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const fetchMessages = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter === 'unread') {
        params.set('unread', 'true')
      }
      const res = await fetch(`/api/contact/messages?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setMessages(json.messages || [])
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const filteredMessages = messages.filter((msg) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      (msg.subject && msg.subject.toLowerCase().includes(q))
    )
  })

  const openDetail = (message: ContactMessage) => {
    setSelectedMessage(message)
    setDetailOpen(true)
  }

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, _localRead: true, read: true } : m
      )
    )
    if (selectedMessage?.id === messageId) {
      setSelectedMessage((prev) =>
        prev ? { ...prev, _localRead: true, read: true } : null
      )
    }
  }

  const markAsUnread = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, _localRead: false, read: false } : m
      )
    )
    if (selectedMessage?.id === messageId) {
      setSelectedMessage((prev) =>
        prev ? { ...prev, _localRead: false, read: false } : null
      )
    }
  }

  const isRead = (msg: ContactMessage) => {
    return msg._localRead !== undefined ? msg._localRead : msg.read
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const unreadCount = messages.filter((m) => !isRead(m)).length

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-40 bg-neutral-800" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 bg-neutral-800" />
          <Skeleton className="h-10 w-24 bg-neutral-800" />
          <Skeleton className="h-10 w-24 bg-neutral-800" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 bg-neutral-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white md:text-2xl">
            Messages
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage contact form submissions
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="border-neutral-700 bg-neutral-800 pl-9 text-white placeholder:text-neutral-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className={
              filter === 'all'
                ? 'bg-cyan-500 text-black font-semibold hover:bg-cyan-400'
                : 'text-neutral-400 hover:text-white'
            }
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className={
              filter === 'unread'
                ? 'bg-cyan-500 text-black font-semibold hover:bg-cyan-400'
                : 'text-neutral-400 hover:text-white'
            }
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-500">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="w-10 text-neutral-400"></TableHead>
                <TableHead className="text-neutral-400">Name</TableHead>
                <TableHead className="hidden text-neutral-400 md:table-cell">
                  Email
                </TableHead>
                <TableHead className="text-neutral-400">Subject</TableHead>
                <TableHead className="hidden text-neutral-400 lg:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-neutral-400"
                  >
                    <Inbox className="mx-auto mb-2 size-8 text-neutral-600" />
                    No messages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((msg) => (
                  <TableRow
                    key={msg.id}
                    className="cursor-pointer border-neutral-800 hover:bg-neutral-800/50"
                    onClick={() => openDetail(msg)}
                  >
                    <TableCell>
                      {isRead(msg) ? (
                        <MailOpen className="size-4 text-neutral-500" />
                      ) : (
                        <Mail className="size-4 text-amber-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${
                          isRead(msg)
                            ? 'text-neutral-300'
                            : 'font-medium text-white'
                        }`}
                      >
                        {msg.name}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-neutral-400 md:table-cell">
                      {msg.email}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${
                          isRead(msg)
                            ? 'text-neutral-400'
                            : 'font-medium text-white'
                        }`}
                      >
                        {msg.subject || 'No subject'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-neutral-400 lg:table-cell">
                      {formatDate(msg.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isRead(msg)
                            ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }
                      >
                        {isRead(msg) ? 'Read' : 'Unread'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-neutral-800 bg-neutral-900 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Message Details</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 py-4">
              {/* Sender Info */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-cyan-500/10">
                    <User className="size-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {selectedMessage.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject & Date */}
              <div className="space-y-2">
                {selectedMessage.subject && (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Subject
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {selectedMessage.subject}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock className="size-3" />
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              <Separator className="bg-neutral-800" />

              {/* Message Body */}
              <div>
                <p className="mb-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Message
                </p>
                <div className="whitespace-pre-wrap rounded-lg border border-neutral-800 bg-neutral-800/30 p-4 text-sm text-neutral-300">
                  {selectedMessage.message}
                </div>
              </div>

              <Separator className="bg-neutral-800" />

              {/* Actions */}
              <div className="flex gap-3">
                {isRead(selectedMessage) ? (
                  <Button
                    variant="outline"
                    onClick={() => markAsUnread(selectedMessage.id)}
                    className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  >
                    <Mail className="mr-2 size-4" />
                    Mark as Unread
                  </Button>
                ) : (
                  <Button
                    onClick={() => markAsRead(selectedMessage.id)}
                    className="bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
                  >
                    <MailOpen className="mr-2 size-4" />
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
