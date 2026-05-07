'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  Star,
  Plus,
  Settings,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
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
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { useNavigationStore } from '@/store/navigation-store'

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

interface LowStockProduct {
  id: string
  name: string
  stock: number
  price: number
  images: string[]
  category?: { name: string }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const chartStatusColors: Record<string, string> = {
  pending: '#eab308',
  processing: '#3b82f6',
  shipped: '#a855f7',
  delivered: '#06b6d4',
  cancelled: '#ef4444',
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend,
  trendUp,
}: {
  icon: React.ElementType
  title: string
  value: string | number
  subtitle?: string
  color: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <Card className="border-neutral-800 bg-neutral-900 admin-stat-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
            <div className="mt-1.5 flex items-center gap-2">
              {trend && (
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    trendUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {trendUp ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {trend}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-neutral-500">{subtitle}</span>
              )}
            </div>
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

// Custom tooltip for recharts
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium capitalize text-neutral-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { navigate } = useNavigationStore()

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

    const fetchLowStock = async () => {
      try {
        const res = await fetch('/api/products?lowStock=true&sort=stock_asc&limit=5')
        if (res.ok) {
          const json = await res.json()
          const products = (json.products || []).map(
            (p: Record<string, unknown>) => ({
              id: p.id as string,
              name: p.name as string,
              stock: p.stock as number,
              price: p.price as number,
              images: JSON.parse((p.images as string) || '[]') as string[],
              category: p.category as { name: string } | undefined,
            })
          ) as LowStockProduct[]
          setLowStockProducts(products)
        }
      } catch {
        // ignore
      }
    }

    Promise.all([fetchDashboard(), fetchLowStock()])
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <Skeleton className="h-3 w-20 bg-neutral-800" />
              <Skeleton className="h-8 w-24 bg-neutral-800" />
              <Skeleton className="h-3 w-16 bg-neutral-800" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <Skeleton className="h-5 w-32 bg-neutral-800" />
            <Skeleton className="h-[240px] bg-neutral-800" />
          </div>
          <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <Skeleton className="h-5 w-32 bg-neutral-800" />
            <Skeleton className="h-[240px] bg-neutral-800" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[200px] rounded-xl bg-neutral-800" />
          <Skeleton className="h-[200px] rounded-xl bg-neutral-800" />
          <Skeleton className="h-[200px] rounded-xl bg-neutral-800" />
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

  // Prepare bar chart data
  const barChartData = Object.entries(data.ordersByStatus || {}).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      fill: chartStatusColors[status] || '#737373',
    })
  )

  // Prepare revenue area chart data (simulated from recent orders)
  const revenueData = data.recentOrders
    .slice()
    .reverse()
    .map((order, i) => ({
      name: `Order ${i + 1}`,
      revenue: order.total,
    }))

  // Calculate trend indicators (simulated based on data)
  const revenueTrend = data.totalRevenue > 0 ? '+12.5%' : '0%'
  const ordersTrend = data.totalOrders > 0 ? '+8.3%' : '0%'

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
          color="bg-cyan-500/10 text-cyan-400"
          trend="+2 this week"
          trendUp={true}
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={data.totalOrders}
          color="bg-teal-500/10 text-teal-400"
          trend={ordersTrend}
          trendUp={true}
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${(data.totalRevenue || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="bg-amber-500/10 text-amber-500"
          trend={revenueTrend}
          trendUp={true}
        />
        <StatCard
          icon={Clock}
          title="Pending Orders"
          value={pendingOrders}
          subtitle={totalOrdersAll > 0 ? `${Math.round((pendingOrders / totalOrdersAll) * 100)}% of all orders` : undefined}
          color="bg-yellow-500/10 text-yellow-500"
          trend={pendingOrders > 0 ? 'Needs attention' : undefined}
          trendUp={false}
        />
      </div>

      {/* Quick Actions */}
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
              onClick={() => navigate('admin-products')}
              className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-cyan-300"
            >
              <Plus className="mr-2 size-4" />
              Add Product
            </Button>
            <Button
              onClick={() => navigate('admin-orders')}
              className="bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 hover:text-teal-300"
            >
              <Eye className="mr-2 size-4" />
              View Orders
            </Button>
            <Button
              onClick={() => navigate('admin-settings')}
              className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:text-amber-300"
            >
              <Settings className="mr-2 size-4" />
              Update Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by Status - Bar Chart */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <TrendingUp className="size-4 text-cyan-400" />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalOrdersAll === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-800">
                  <ShoppingCart className="size-5 text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-500">No orders yet</p>
                <p className="mt-1 text-xs text-neutral-600">Orders will appear here once placed</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barChartData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#737373', fontSize: 12 }}
                    axisLine={{ stroke: '#262626' }}
                    tickLine={{ stroke: '#262626' }}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 12 }}
                    axisLine={{ stroke: '#262626' }}
                    tickLine={{ stroke: '#262626' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue Overview - Area Chart */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <DollarSign className="size-4 text-amber-500" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.totalRevenue === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-800">
                  <DollarSign className="size-5 text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-500">No revenue data yet</p>
                <p className="mt-1 text-xs text-neutral-600">Revenue will be tracked as orders come in</p>
              </div>
            ) : revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#737373', fontSize: 12 }}
                    axisLine={{ stroke: '#262626' }}
                    tickLine={{ stroke: '#262626' }}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 12 }}
                    axisLine={{ stroke: '#262626' }}
                    tickLine={{ stroke: '#262626' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-800">
                  <DollarSign className="size-5 text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-500">No revenue data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <ShoppingCart className="size-4 text-cyan-400" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-800">
                  <ShoppingCart className="size-5 text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-500">No orders yet</p>
              </div>
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

        {/* Low Stock Alert */}
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <AlertTriangle className="size-4 text-yellow-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <Package className="size-5 text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-white">All Stocked Up</p>
                <p className="mt-1 text-xs text-neutral-400">
                  No products with low inventory (≤10 units)
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/30 p-3 transition-colors hover:bg-neutral-800/50"
                  >
                    <div className="relative size-10 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="size-4 text-neutral-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          product.stock <= 3
                            ? 'border-red-500/30 bg-red-500/10 text-red-400'
                            : product.stock <= 7
                            ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {product.stock} left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      {data.topProducts.length > 0 && (
        <Card className="border-neutral-800 bg-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <Star className="size-4 text-amber-500" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {data.topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex flex-col items-center rounded-lg border border-neutral-800 bg-neutral-800/30 p-4 text-center transition-colors hover:bg-neutral-800/50"
                >
                  <div className="mb-2 flex size-6 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">
                    {index + 1}
                  </div>
                  <div className="relative mb-2 size-16 overflow-hidden rounded-lg bg-neutral-800">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0] as string}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="size-5 text-neutral-600" />
                      </div>
                    )}
                  </div>
                  <p className="mb-1 line-clamp-1 text-xs font-medium text-white">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] text-neutral-400">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-cyan-400">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
