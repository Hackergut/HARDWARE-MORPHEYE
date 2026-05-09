'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigationStore } from '@/store/navigation-store'
import { motion } from 'framer-motion'

interface WholesaleStats {
  total: number
  pending: number
  approved: number
  rejected: number
  recentRequests: Array<{
    id: string
    businessName: string
    phone: string
    status: string
    createdAt: string
    user?: { name: string | null; email: string } | null
  }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function AdminWholesale() {
  const [stats, setStats] = useState<WholesaleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { navigate } = useNavigationStore()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/wholesale/request')
        if (res.ok) {
          const json = await res.json()
          const requests = json.requests || []
          setStats({
            total: requests.length,
            pending: requests.filter((r: { status: string }) => r.status === 'pending').length,
            approved: requests.filter((r: { status: string }) => r.status === 'approved').length,
            rejected: requests.filter((r: { status: string }) => r.status === 'rejected').length,
            recentRequests: requests.slice(0, 5),
          })
        }
      } catch (err) {
        console.error('Failed to fetch wholesale stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-48 bg-neutral-800" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <Skeleton className="h-3 w-20 bg-neutral-800" />
              <Skeleton className="h-8 w-16 bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 md:p-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-xl font-bold text-white md:text-2xl">Wholesale</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage B2B wholesale partnerships and requests
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Requests</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats?.total || 0}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <Users className="size-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Approved</p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">{stats?.approved || 0}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Pending</p>
                <p className="mt-2 text-2xl font-bold text-yellow-500">{stats?.pending || 0}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock className="size-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Rejected</p>
                <p className="mt-2 text-2xl font-bold text-red-400">{stats?.rejected || 0}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                <XCircle className="size-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <TrendingUp className="size-4 text-cyan-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('admin-wholesale-requests')}
                className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-cyan-300"
              >
                <Eye className="mr-2 size-4" />
                Review Requests
                {stats && stats.pending > 0 && (
                  <span className="ml-2 rounded-full bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-400">
                    {stats.pending} new
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {stats && stats.recentRequests.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-neutral-800 bg-neutral-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                <Building2 className="size-4 text-cyan-400" />
                Recent Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-800/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-800">
                        <Building2 className="size-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{req.businessName}</p>
                        <p className="text-xs text-neutral-500">{req.user?.email || req.phone}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                        statusColors[req.status] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate('admin-wholesale-requests')}
                variant="ghost"
                className="mt-3 w-full text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
