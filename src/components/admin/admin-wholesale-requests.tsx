'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Phone,
  Mail,
  FileText,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useNavigationStore } from '@/store/navigation-store'
import { useNotificationStore } from '@/store/notification-store'
import { WholesaleService } from '@/lib/services'
import type { WholesaleRequest } from '@/lib/types'

interface WholesaleRequestWithUser extends WholesaleRequest {
  user?: { id: string; name: string | null; email: string } | null
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusFilters = ['all', 'pending', 'approved', 'rejected']

export function AdminWholesaleRequests() {
  const [requests, setRequests] = useState<WholesaleRequestWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<WholesaleRequestWithUser | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const showNotification = useNotificationStore((s) => s.show)
  const { navigate } = useNavigationStore()

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const data = await WholesaleService.getRequests()
      setRequests(data as WholesaleRequestWithUser[])
    } catch (err) {
      console.error('Failed to fetch wholesale requests:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const filtered = requests.filter((req) => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        req.businessName.toLowerCase().includes(q) ||
        req.phone.toLowerCase().includes(q) ||
        req.user?.email?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(true)
    try {
      const updated = await WholesaleService.updateRequestStatus(id, status)
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)))
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, ...updated })
      }
      showNotification(`Request ${status}`, 'success')
    } catch {
      showNotification('Failed to update request', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const openDetail = (req: WholesaleRequestWithUser) => {
    setSelectedRequest(req)
    setDetailOpen(true)
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

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-56 bg-neutral-800" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 bg-neutral-800" />
          <Skeleton className="h-10 w-40 bg-neutral-800" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 bg-neutral-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">Wholesale Requests</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Review and manage B2B wholesale access requests
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name, email, or phone..."
            className="border-neutral-700 bg-neutral-800 pl-9 text-white placeholder:text-neutral-500"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full border-neutral-700 bg-neutral-800 text-white sm:w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="border-neutral-700 bg-neutral-900">
            {statusFilters.map((s) => (
              <SelectItem key={s} value={s}>
                <span className="capitalize">{s === 'all' ? 'All Statuses' : s}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Business</TableHead>
                <TableHead className="hidden text-neutral-400 md:table-cell">Contact</TableHead>
                <TableHead className="hidden text-neutral-400 lg:table-cell">Date</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-neutral-400">
                    <Building2 className="mx-auto mb-2 size-8 text-neutral-600" />
                    No wholesale requests found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((req) => (
                  <TableRow
                    key={req.id}
                    className="cursor-pointer border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                    onClick={() => openDetail(req)}
                  >
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-white">{req.businessName}</p>
                        {req.vatNumber && (
                          <p className="text-xs text-neutral-500">VAT: {req.vatNumber}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm text-neutral-400">
                        <p>{req.phone}</p>
                        {req.user?.email && (
                          <p className="text-xs text-neutral-500">{req.user.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-neutral-400 lg:table-cell">
                      {formatDate(req.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          statusColors[req.status] ||
                          'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        }`}
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updating === req.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateStatus(req.id, 'approved')
                            }}
                            className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          >
                            {updating === req.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="mr-1 size-3.5" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updating === req.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateStatus(req.id, 'rejected')
                            }}
                            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <XCircle className="mr-1 size-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-neutral-800 bg-neutral-900 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Wholesale Request Details</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{selectedRequest.businessName}</h3>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    statusColors[selectedRequest.status] ||
                    'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                  }`}
                >
                  {selectedRequest.status}
                </Badge>
              </div>

              <Separator className="bg-neutral-800" />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-3.5 text-neutral-500" />
                    <span className="text-neutral-300">{selectedRequest.phone}</span>
                  </div>
                  {selectedRequest.user?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-3.5 text-neutral-500" />
                      <span className="text-neutral-300">{selectedRequest.user.email}</span>
                    </div>
                  )}
                  {selectedRequest.vatNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="size-3.5 text-neutral-500" />
                      <span className="text-neutral-300">VAT: {selectedRequest.vatNumber}</span>
                    </div>
                  )}
                  {selectedRequest.companyReg && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="size-3.5 text-neutral-500" />
                      <span className="text-neutral-300">CRN: {selectedRequest.companyReg}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                    Notes
                  </h4>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                    <p className="text-sm text-neutral-300">{selectedRequest.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Calendar className="size-3" />
                <span>Submitted: {formatDate(selectedRequest.createdAt)}</span>
              </div>

              {selectedRequest.status === 'pending' && (
                <>
                  <Separator className="bg-neutral-800" />
                  <div className="flex gap-3">
                    <Button
                      disabled={updating === selectedRequest.id}
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                      className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300"
                    >
                      {updating === selectedRequest.id ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 size-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      disabled={updating === selectedRequest.id}
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                      variant="outline"
                      className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <XCircle className="mr-2 size-4" />
                      Reject
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
