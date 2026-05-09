'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Package,
  Truck,
  HeadphonesIcon,
  ShoppingBag,
  ArrowRight,
  Loader2,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useNotificationStore } from '@/store/notification-store'
import { WholesaleService } from '@/lib/services'
import type { WholesaleTier, WholesaleRequest, WholesaleRequestPayload } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const benefits = [
  {
    icon: Percent,
    title: 'Exclusive Discounts',
    description: 'Volume-based pricing from 5% to 25% off retail. The more you buy, the more you save.',
    color: 'from-cyan-500/20 to-cyan-600/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: DollarSign,
    title: 'Net Payment Terms',
    description: 'Qualified businesses get Net 15, Net 30, or Net 60 payment terms on approved orders.',
    color: 'from-teal-500/20 to-teal-600/10',
    iconColor: 'text-teal-400',
  },
  {
    icon: Package,
    title: 'Bulk Pricing Tiers',
    description: 'Automatic volume discounts at every tier. No minimums to start — scale at your pace.',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Truck,
    title: 'Priority Shipping',
    description: 'Expedited processing and discounted shipping rates for all wholesale orders.',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'Personal account manager and priority support channel for wholesale partners.',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: ShieldCheck,
    title: 'Authorized Reseller',
    description: 'Join our network of authorized resellers with genuine factory-sealed products.',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-400',
  },
]

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function WholesalePage() {
  const { navigate } = useNavigationStore()
  const showNotification = useNotificationStore((s) => s.show)
  const [tiers, setTiers] = useState<WholesaleTier[]>([])
  const [tiersLoading, setTiersLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [myRequest, setMyRequest] = useState<WholesaleRequest | null>(null)
  const [form, setForm] = useState<WholesaleRequestPayload>({
    businessName: '',
    vatNumber: '',
    companyReg: '',
    phone: '',
    notes: '',
  })

  useEffect(() => {
    WholesaleService.getTiers()
      .then(setTiers)
      .catch(() => {})
      .finally(() => setTiersLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.businessName.trim() || !form.phone.trim()) {
      showNotification('Please fill in all required fields', 'error')
      return
    }
    setSubmitting(true)
    try {
      const request = await WholesaleService.requestAccess(form)
      setMyRequest(request)
      setShowForm(false)
      showNotification('Wholesale application submitted successfully!', 'success')
    } catch {
      showNotification('Failed to submit application. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/5" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="size-5 text-cyan-400" />
            <nav className="flex items-center gap-1.5 text-sm">
              <button
                onClick={() => navigate('home')}
                className="text-muted-foreground transition-colors hover:text-cyan-400"
              >
                Home
              </button>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">Wholesale</span>
            </nav>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                <Sparkles className="mr-1 size-3" />
                B2B Partnership Program
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                Wholesale Hardware{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Security Solutions
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Partner with Morpheye to offer your customers certified hardware wallets,
                security devices, and accessories at competitive wholesale prices.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {myRequest ? (
                  <div className="flex items-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-4 py-2.5">
                    {myRequest.status === 'approved' ? (
                      <CheckCircle2 className="size-5 text-cyan-400" />
                    ) : myRequest.status === 'rejected' ? (
                      <XCircle className="size-5 text-red-400" />
                    ) : (
                      <Clock className="size-5 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      Application {myRequest.status}
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-cyan-500 text-black hover:bg-cyan-400 px-6 py-5 text-base"
                  >
                    <ShoppingBag className="mr-2 size-4" />
                    Apply for Wholesale
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                )}
                <Button
                  onClick={() => navigate('shop')}
                  variant="outline"
                  className="border-border text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/30 px-6 py-5 text-base"
                >
                  Browse Products
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="size-64 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Building2 className="size-24 text-cyan-400/60" />
                </div>
                <div className="absolute -top-4 -right-4 size-8 rounded-full bg-cyan-500 animate-pulse" />
                <div className="absolute -bottom-2 -left-2 size-6 rounded-full bg-teal-500 animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-16">
        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why Partner With Us?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to grow your business with hardware wallet solutions
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group rounded-xl border border-border bg-card/50 p-5 hover:bg-card/80 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-500/5"
                >
                  <div className={`mb-3 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.color}`}>
                    <Icon className={`size-5 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Tier Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Wholesale Pricing Tiers
            </h2>
            <p className="mt-2 text-muted-foreground">
              Choose the tier that fits your business volume
            </p>
          </div>

          {tiersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-cyan-400" />
            </div>
          ) : tiers.length === 0 ? (
            <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
              <Package className="mx-auto mb-3 size-8 text-muted-foreground/50" />
              <p className="text-muted-foreground">No pricing tiers configured yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-4 text-left font-semibold text-foreground">Tier</th>
                    <th className="px-5 py-4 text-left font-semibold text-foreground">Min. Points</th>
                    <th className="px-5 py-4 text-left font-semibold text-foreground">Discount</th>
                    <th className="px-5 py-4 text-left font-semibold text-foreground">Min. Order</th>
                    <th className="px-5 py-4 text-left font-semibold text-foreground">Net Terms</th>
                    <th className="px-5 py-4 text-left font-semibold text-foreground hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier, i) => (
                    <motion.tr
                      key={tier.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-4 font-semibold text-foreground">{tier.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{tier.minPoints.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                          {tier.discountPct}% OFF
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {tier.minOrder > 0 ? `$${tier.minOrder.toFixed(2)}` : 'None'}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {tier.netTermDays > 0 ? `Net ${tier.netTermDays}` : 'N/A'}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">
                        {tier.description || '—'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Application Status or Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto w-full"
        >
          {myRequest ? (
            <div className="rounded-xl border border-border bg-card/50 p-6 sm:p-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cyan-500/10">
                {myRequest.status === 'approved' ? (
                  <CheckCircle2 className="size-8 text-cyan-400" />
                ) : myRequest.status === 'rejected' ? (
                  <XCircle className="size-8 text-red-400" />
                ) : (
                  <Clock className="size-8 text-yellow-500" />
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Application {myRequest.status.charAt(0).toUpperCase() + myRequest.status.slice(1)}
              </h3>
              <p className="text-muted-foreground mb-4">
                {myRequest.status === 'approved'
                  ? 'Congratulations! Your wholesale account is active. You can now place orders at wholesale prices.'
                  : myRequest.status === 'rejected'
                    ? 'Unfortunately, your application was not approved at this time. Please contact us for more details.'
                    : 'Your application is being reviewed. We typically respond within 1-2 business days.'}
              </p>
              <Badge variant="outline" className={statusColors[myRequest.status] || ''}>
                {myRequest.status}
              </Badge>
            </div>
          ) : showForm ? (
            <div className="rounded-xl border border-border bg-card/50 p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">Apply for Wholesale Access</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill out the form below and our team will review your application
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Business Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Your business name"
                    required
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      VAT Number
                    </label>
                    <Input
                      value={form.vatNumber || ''}
                      onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
                      placeholder="VAT-XXXXXXXXX"
                      className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Company Registration
                    </label>
                    <Input
                      value={form.companyReg || ''}
                      onChange={(e) => setForm({ ...form, companyReg: e.target.value })}
                      placeholder="CRN or EIN"
                      className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Notes
                  </label>
                  <Textarea
                    value={form.notes || ''}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Tell us about your business, how you plan to use our products, etc."
                    rows={3}
                    className="border-border bg-card text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-cyan-500 text-black hover:bg-cyan-400 px-6"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-border text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 p-6 sm:p-8 text-center">
              <Building2 className="mx-auto mb-4 size-10 text-cyan-400" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Apply for wholesale access and start ordering hardware security solutions at exclusive B2B prices.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-cyan-500 text-black hover:bg-cyan-400 px-8 py-5 text-base"
              >
                <ShoppingBag className="mr-2 size-4" />
                Apply for Wholesale Access
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
