'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  Star,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

interface DashboardData {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    customerName: string
    total: number
    status: string
    createdAt: string
  }>
  ordersByStatus: Record<string, number>
  topProducts: Array<{
    id: string
    name: string
    price: number
    rating: number
    reviewCount: number
    images: string[]
  }>
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusBarColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ElementType
  title: string
  value: string | number
  subtitle?: string
  color: string
}) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>
            )}
          </div>
          <div
            className={`flex size-10 items-center justify-center rounded-lg ${color}`}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] rounded-xl bg-neutral-800" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl bg-neutral-800" />
          <Skeleton className="h-[300px] rounded-xl bg-neutral-800" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-neutral-400">Failed to load dashboard data</p>
      </div>
    )
  }

  const pendingOrders = data.ordersByStatus?.pending || 0
  const totalOrdersAll = Object.values(data.ordersByStatus || {}).reduce(
    (a, b) => a + b,
    0
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Overview of your Morpheye store
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          title="Total Products"
          value={data.totalProducts}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={data.totalOrders}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${(data.totalRevenue || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="bg-amber-500/10 text-amber-500"
        />
        <StatCard
          icon={Clock}
          title="Pending Orders"
          value={pendingOrders}
          subtitle={totalOrdersAll > 0 ? `${Math.round((pendingOrders / totalOrdersAll) * 100)}% of all orders` : undefined}
          color="bg-yellow-500/10 text-yellow-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <ShoppingCart className="size-4 text-emerald-500" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">
                No orders yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-800 hover:bg-transparent">
                      <TableHead className="text-neutral-400">Order</TableHead>
                      <TableHead className="text-neutral-400">Customer</TableHead>
                      <TableHead className="text-neutral-400">Total</TableHead>
                      <TableHead className="text-neutral-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-neutral-800 hover:bg-neutral-800/50"
                      >
                        <TableCell className="font-mono text-xs text-white">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="text-sm text-neutral-300">
                          {order.customerName}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-white">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              statusColors[order.status] ||
                              'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <TrendingUp className="size-4 text-emerald-500" />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalOrdersAll === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">
                No orders yet
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(data.ordersByStatus || {}).map(
                  ([status, count]) => {
                    const percentage =
                      totalOrdersAll > 0
                        ? Math.round((count / totalOrdersAll) * 100)
                        : 0
                    return (
                      <div key={status}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-2.5 rounded-full ${
                                statusBarColors[status] || 'bg-neutral-500'
                              }`}
                            />
                            <span className="text-sm capitalize text-neutral-300">
                              {status}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-white">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2 bg-neutral-800"
                        />
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <Star className="size-4 text-amber-500" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">
                No products yet
              </p>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/30 p-3"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-800 text-sm font-bold text-neutral-400">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {product.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          <Star className="size-3 fill-amber-500 text-amber-500" />
                          <span className="text-xs text-neutral-400">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-500">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <AlertTriangle className="size-4 text-yellow-500" />
              Stock Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                <Package className="size-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-white">
                {data.totalProducts} Active Products
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Track product stock levels in the Products section
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
