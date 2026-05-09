'use client'

import { useState, useEffect } from 'react'
import {
  Gift,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Award,
  Users,
  Star,
  Ticket,
  Truck,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useNotificationStore } from '@/store/notification-store'
import { useLoyaltyRewardsStore, type LoyaltyReward } from '@/store/loyalty-rewards-store'
import { LoyaltyService } from '@/lib/services'

interface PointTransaction {
  id: string
  userEmail: string
  points: number
  type: 'earned' | 'redeemed'
  description: string
  createdAt: string
}

const typeIcons: Record<string, React.ElementType> = {
  discount: Ticket,
  product: Package,
  shipping: Truck,
}

const typeLabels: Record<string, string> = {
  discount: 'Discount',
  product: 'Free Product',
  shipping: 'Free Shipping',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface RewardFormData {
  name: string
  description: string
  pointsCost: number
  type: 'discount' | 'product' | 'shipping'
  value: string
  image: string
}

const defaultForm: RewardFormData = {
  name: '',
  description: '',
  pointsCost: 0,
  type: 'discount',
  value: '',
  image: '',
}

export function AdminLoyalty() {
  const { rewards, addReward, updateReward, deleteReward, toggleActive } =
    useLoyaltyRewardsStore()
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<RewardFormData>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const showNotification = useNotificationStore((s) => s.show)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await LoyaltyService.getHistory()
        setTransactions(history as PointTransaction[])
      } catch (err) {
        console.error('Failed to fetch loyalty data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalPointsIssued = transactions
    .filter((t) => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0)

  const totalRedeemed = transactions
    .filter((t) => t.type === 'redeemed')
    .reduce((sum, t) => sum + Math.abs(t.points), 0)

  const activeReferrals = transactions.filter(
    (t) => t.type === 'earned' && t.description.toLowerCase().includes('referral')
  ).length

  const openAddForm = () => {
    setEditingId(null)
    setForm(defaultForm)
    setFormOpen(true)
  }

  const openEditForm = (reward: LoyaltyReward) => {
    setEditingId(reward.id)
    setForm({
      name: reward.name,
      description: reward.description,
      pointsCost: reward.pointsCost,
      type: reward.type,
      value: reward.value,
      image: reward.image || '',
    })
    setFormOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.pointsCost || !form.value) {
      showNotification('Please fill in all required fields', 'error')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        updateReward(editingId, {
          name: form.name,
          description: form.description,
          pointsCost: form.pointsCost,
          type: form.type,
          value: form.value,
          image: form.image || null,
        })
        showNotification('Reward updated', 'success')
      } else {
        addReward({
          name: form.name,
          description: form.description,
          pointsCost: form.pointsCost,
          type: form.type,
          value: form.value,
          active: true,
          image: form.image || null,
        })
        showNotification('Reward added', 'success')
      }
      setFormOpen(false)
      setForm(defaultForm)
      setEditingId(null)
    } catch {
      showNotification('Failed to save reward', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteReward(deleteTarget)
    showNotification('Reward deleted', 'success')
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  const typeColors: Record<string, string> = {
    discount: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    product: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    shipping: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-8 w-56 bg-neutral-800" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl bg-neutral-800" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 bg-neutral-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">Loyalty Program</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage rewards, points, and referrals
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Total Points Issued
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {totalPointsIssued.toLocaleString()}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Award className="size-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Active Referrals
                </p>
                <p className="mt-1 text-2xl font-bold text-cyan-400">{activeReferrals}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <Users className="size-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Rewards Redeemed
                </p>
                <p className="mt-1 text-2xl font-bold text-purple-400">{totalRedeemed}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Gift className="size-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
            <Star className="size-4 text-cyan-400" />
            Reward Catalog
          </CardTitle>
          <Button
            onClick={openAddForm}
            className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-cyan-300"
          >
            <Plus className="mr-2 size-4" />
            Add Reward
          </Button>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-800">
                <Gift className="size-5 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-500">No rewards yet</p>
              <p className="mt-1 text-xs text-neutral-600">
                Add your first loyalty reward to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => {
                const TypeIcon = typeIcons[reward.type]
                return (
                  <div
                    key={reward.id}
                    className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-800/30 p-4 transition-colors hover:bg-neutral-800/50"
                  >
                    <div
                      className={`flex size-12 items-center justify-center rounded-lg ${
                        reward.type === 'discount'
                          ? 'bg-amber-500/10'
                          : reward.type === 'product'
                          ? 'bg-cyan-500/10'
                          : 'bg-purple-500/10'
                      }`}
                    >
                      <TypeIcon
                        className={`size-5 ${
                          reward.type === 'discount'
                            ? 'text-amber-400'
                            : reward.type === 'product'
                            ? 'text-cyan-400'
                            : 'text-purple-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{reward.name}</p>
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${typeColors[reward.type]}`}
                        >
                          {typeLabels[reward.type]}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${
                            reward.active
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : 'border-neutral-600 bg-neutral-700/30 text-neutral-500'
                          }`}
                        >
                          {reward.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">
                        {reward.description}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        <span className="font-semibold text-amber-400">{reward.pointsCost.toLocaleString()} pts</span>
                        <span className="mx-1.5 text-neutral-600">|</span>
                        Value: {reward.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(reward.id)}
                        className={`text-xs ${
                          reward.active
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                            : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                        }`}
                      >
                        {reward.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(reward)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Pencil className="mr-1 size-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteTarget(reward.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="mr-1 size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
            <Award className="size-4 text-amber-400" />
            Recent Point Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-800">
                <Award className="size-5 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-500">No transactions yet</p>
              <p className="mt-1 text-xs text-neutral-600">
                Point activity will appear here as users earn and redeem
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800 hover:bg-transparent">
                    <TableHead className="text-neutral-400">User</TableHead>
                    <TableHead className="text-neutral-400">Points</TableHead>
                    <TableHead className="hidden text-neutral-400 md:table-cell">Type</TableHead>
                    <TableHead className="hidden text-neutral-400 lg:table-cell">Description</TableHead>
                    <TableHead className="text-neutral-400">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className="border-neutral-800 transition-colors hover:bg-neutral-800/50"
                    >
                      <TableCell className="text-sm text-neutral-300">
                        {tx.userEmail}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm font-semibold ${
                            tx.type === 'earned'
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}
                        >
                          {tx.type === 'earned' ? '+' : ''}{tx.points.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            tx.type === 'earned'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : 'border-red-500/20 bg-red-500/10 text-red-400'
                          }`}
                        >
                          {tx.type === 'earned' ? 'Earned' : 'Redeemed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-sm text-neutral-400 lg:table-cell">
                        {tx.description}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-400">
                        {formatDate(tx.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-neutral-800 bg-neutral-900 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingId ? 'Edit Reward' : 'Add Reward'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-sm text-neutral-300">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. $10 Off Coupon"
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-neutral-300">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what this reward offers..."
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-neutral-300">Points Cost *</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.pointsCost}
                  onChange={(e) =>
                    setForm({ ...form, pointsCost: Number(e.target.value) })
                  }
                  placeholder="500"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-neutral-300">Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(val: 'discount' | 'product' | 'shipping') =>
                    setForm({ ...form, type: val })
                  }
                >
                  <SelectTrigger className="border-neutral-700 bg-neutral-800 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-700 bg-neutral-900">
                    <SelectItem value="discount">Discount</SelectItem>
                    <SelectItem value="product">Free Product</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-neutral-300">Value *</Label>
              <Input
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === 'discount' ? '$10.00' : 'e.g. Any Standard Product'}
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-neutral-300">Image URL (optional)</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>

            <Separator className="bg-neutral-800" />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setFormOpen(false)
                  setEditingId(null)
                  setForm(defaultForm)
                }}
                className="flex-1 border-neutral-700 text-neutral-300 hover:text-white"
              >
                <X className="mr-2 size-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.name || !form.pointsCost || !form.value}
                className="flex-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-cyan-300"
              >
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                {editingId ? 'Update Reward' : 'Add Reward'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-neutral-800 bg-neutral-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Reward</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete this reward? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
