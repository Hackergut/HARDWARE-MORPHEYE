'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Gift,
  Star,
  Award,
  Copy,
  Share2,
  CheckCircle2,
  ChevronRight,
  Users,
  ShoppingBag,
  MessageCircle,
  Twitter,
  Zap,
  Package,
  Percent,
  Truck,
  ExternalLink,
  Circle,
  Diamond,
  Medal,
  History,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LoyaltyTier, LoyaltyReward } from '@/lib/types'

const TIERS: { key: LoyaltyTier; label: string; minPoints: number; discount: number; color: string; icon: typeof Circle }[] = [
  { key: 'bronze', label: 'Bronze', minPoints: 0, discount: 0, color: 'text-amber-600', icon: Circle },
  { key: 'silver', label: 'Silver', minPoints: 500, discount: 5, color: 'text-slate-300', icon: Medal },
  { key: 'gold', label: 'Gold', minPoints: 2000, discount: 10, color: 'text-yellow-400', icon: Award },
  { key: 'platinum', label: 'Platinum', minPoints: 5000, discount: 15, color: 'text-cyan-300', icon: Diamond },
]

const EARNING_METHODS = [
  {
    icon: ShoppingBag,
    label: 'Make a Purchase',
    description: 'Earn points for every dollar spent',
    detail: '1 point per $1 spent',
  },
  {
    icon: Star,
    label: 'Write a Review',
    description: 'Share your experience with products',
    detail: '50 points per review',
  },
  {
    icon: Users,
    label: 'Refer Friends',
    description: 'Invite friends to join Morpheye',
    detail: '500 points per referral',
  },
  {
    icon: MessageCircle,
    label: 'Social Engagement',
    description: 'Follow and engage on social media',
    detail: '100 points per action',
  },
]

export function LoyaltyPage() {
  const [points, setPoints] = useState(0)
  const [tier, setTier] = useState<LoyaltyTier>('bronze')
  const [referralCode, setReferralCode] = useState('')
  const [rewards, setRewards] = useState<LoyaltyReward[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [redeemingId, setRedeemingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/loyalty')
      .then((r) => r.json())
      .then((data) => {
        setPoints(data.points ?? 0)
        setTier(data.tier ?? 'bronze')
        setRewards(data.rewards ?? [])
        setHistory(data.history ?? [])
      })
      .catch(() => {})

    fetch('/api/loyalty/referral')
      .then((r) => r.json())
      .then((data) => {
        setReferralCode(data.referralCode ?? '')
      })
      .catch(() => {})
  }, [])

  const handleCopyReferral = () => {
    if (!referralCode) return
    navigator.clipboard.writeText(`${window.location.origin}?ref=${referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleRedeem = async (rewardId: string) => {
    setRedeemingId(rewardId)
    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'redeem', rewardId }),
      })
      if (res.ok) {
        const data = await res.json()
        setPoints(data.pointsRemaining ?? 0)
        setRewards((prev) => prev.filter((r) => r.id !== rewardId))
      }
    } catch {
      // ignore
    } finally {
      setRedeemingId(null)
    }
  }

  const currentTierIndex = TIERS.findIndex((t) => t.key === tier)
  const nextTier = TIERS[currentTierIndex + 1]
  const tierProgress = nextTier ? points / nextTier.minPoints : 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Loyalty Program</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Earn points, unlock tiers, and get exclusive rewards
          </p>
        </div>
      </div>

      {/* Points & Tier Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-cyan-500/5"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
                <Award className="size-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="text-4xl font-bold text-foreground">
                  {points.toLocaleString()}{' '}
                  <span className="text-lg font-normal text-muted-foreground">points</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    className={cn(
                      'text-xs font-semibold capitalize',
                      tier === 'bronze' && 'border-amber-600/30 bg-amber-500/15 text-amber-500',
                      tier === 'silver' && 'border-slate-300/30 bg-slate-300/15 text-slate-300',
                      tier === 'gold' && 'border-yellow-400/30 bg-yellow-400/15 text-yellow-400',
                      tier === 'platinum' && 'border-cyan-300/30 bg-cyan-300/15 text-cyan-300'
                    )}
                  >
                    {tier} tier
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {nextTier
                      ? `${nextTier.minPoints - points} points to ${nextTier.label}`
                      : 'Max tier reached'}
                  </span>
                </div>
              </div>
            </div>

            {nextTier && (
              <div className="w-full sm:w-48">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress to {nextTier.label}</span>
                  <span>{Math.min(100, Math.round(tierProgress * 100))}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, tierProgress * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tier Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="mb-4 text-lg font-bold text-foreground">Tier Benefits</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t, idx) => {
            const unlocked = currentTierIndex >= idx
            const TierIcon = t.icon
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={cn(
                  'relative overflow-hidden rounded-xl border p-4 transition-all',
                  unlocked
                    ? 'border-cyan-500/20 bg-cyan-500/5'
                    : 'border-border bg-card/30 opacity-50'
                )}
              >
                {unlocked && (
                  <div className="absolute right-2 top-2">
                    <CheckCircle2 className="size-4 text-cyan-400" />
                  </div>
                )}
                <TierIcon className={cn('size-6 mb-2', t.color)} />
                <p className="text-sm font-bold text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">
                  {t.discount}% discount • {t.minPoints.toLocaleString()} pts
                </p>
                {t.discount > 0 && (
                  <Badge
                    className={cn(
                      'mt-2 text-[10px] font-bold',
                      t.key === 'silver' && 'border-slate-300/30 bg-slate-300/10 text-slate-300',
                      t.key === 'gold' && 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400',
                      t.key === 'platinum' && 'border-cyan-300/30 bg-cyan-300/10 text-cyan-300'
                    )}
                  >
                    {t.discount}% OFF
                  </Badge>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* How to Earn */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <Zap className="size-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-foreground">How to Earn Points</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EARNING_METHODS.map((method, i) => (
            <motion.div
              key={method.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-cyan-500/20 hover:bg-cyan-500/5"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <method.icon className="size-5 text-cyan-400" />
              </div>
              <p className="mb-1 text-sm font-semibold text-foreground">{method.label}</p>
              <p className="mb-2 text-xs text-muted-foreground">{method.description}</p>
              <Badge className="border-cyan-500/20 bg-cyan-500/10 text-[10px] text-cyan-400">
                {method.detail}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Referral Program */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-cyan-500/10 via-card to-teal-500/5"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-cyan-500/10">
                <Users className="size-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Refer Friends, Earn Points</h3>
                <p className="text-sm text-muted-foreground">
                  Share your referral link and earn 500 points for each friend who joins
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="flex h-11 items-center rounded-lg border border-border bg-muted px-3 font-mono text-sm text-muted-foreground">
                {referralCode
                  ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${referralCode}`
                  : 'Loading...'}
              </div>
            </div>
            <Button
              onClick={handleCopyReferral}
              className="bg-cyan-500 text-black hover:bg-cyan-400"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-4" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
              onClick={() => {
                const text = `Join Morpheye and get secure hardware wallets! Use my referral code: ${referralCode}`
                if (navigator.share) {
                  navigator.share({ title: 'Morpheye Referral', text }).catch(() => {})
                } else {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
                }
              }}
            >
              <Share2 className="mr-2 size-4" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Rewards Catalog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <Gift className="size-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-foreground">Rewards Catalog</h2>
        </div>

        {rewards.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-12">
            <Gift className="mb-3 size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No rewards available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward, i) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex flex-col rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-cyan-500/20"
              >
                {reward.image && (
                  <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-muted">
                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <div className="mb-1 flex items-center gap-2">
                  <Badge
                    className={cn(
                      'text-[10px] font-bold',
                      reward.type === 'discount' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
                      reward.type === 'product' && 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
                      reward.type === 'shipping' && 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    )}
                  >
                    {reward.type === 'discount' && <Percent className="mr-1 size-3" />}
                    {reward.type === 'product' && <Package className="mr-1 size-3" />}
                    {reward.type === 'shipping' && <Truck className="mr-1 size-3" />}
                    {reward.type}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-foreground">{reward.name}</p>
                {reward.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{reward.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-1">
                    <Award className="size-4 text-cyan-400" />
                    <span className="text-sm font-bold text-foreground">
                      {reward.pointsCost.toLocaleString()} pts
                    </span>
                  </div>
                  <Button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={points < reward.pointsCost || redeemingId === reward.id}
                    size="sm"
                    className={cn(
                      'text-xs font-semibold',
                      points >= reward.pointsCost
                        ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {redeemingId === reward.id ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      'Redeem'
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Points History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <History className="size-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-foreground">Points History</h2>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-12">
            <History className="mb-3 size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No points activity yet</p>
            <p className="text-xs text-muted-foreground/60">Start earning points with your next purchase</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 transition-colors hover:bg-muted/20 last:border-0"
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {entry.date ? new Date(entry.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-foreground">{entry.description || '-'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-cyan-400">
                        {entry.points > 0 ? '+' : ''}{entry.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
