'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Send,
} from 'lucide-react'
import { useNavigationStore } from '@/store/navigation-store'
import { useNotificationStore } from '@/store/notification-store'
import { WholesaleService } from '@/lib/services'
import type { WholesaleRequest, WholesaleRequestPayload } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function WholesaleApplyPage() {
  const { navigate } = useNavigationStore()
  const showNotification = useNotificationStore((s) => s.show)
  const [submitting, setSubmitting] = useState(false)
  const [myRequest, setMyRequest] = useState<WholesaleRequest | null>(null)
  const [form, setForm] = useState<WholesaleRequestPayload>({
    businessName: '',
    vatNumber: '',
    companyReg: '',
    phone: '',
    notes: '',
  })

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
      showNotification('Wholesale application submitted!', 'success')
    } catch {
      showNotification('Failed to submit application', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (myRequest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg px-4 py-16 sm:px-6"
      >
        <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cyan-500/10">
            {myRequest.status === 'approved' ? (
              <CheckCircle2 className="size-8 text-cyan-400" />
            ) : myRequest.status === 'rejected' ? (
              <XCircle className="size-8 text-red-400" />
            ) : (
              <Clock className="size-8 text-yellow-500" />
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Application {myRequest.status.charAt(0).toUpperCase() + myRequest.status.slice(1)}
          </h2>
          <p className="text-muted-foreground mb-6">
            {myRequest.status === 'approved'
              ? 'Your wholesale account is active. Start shopping at wholesale prices!'
              : myRequest.status === 'rejected'
                ? 'Your application was not approved. Contact us for more details.'
                : 'We are reviewing your application and will respond within 1-2 business days.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => navigate('shop')}
              className="bg-cyan-500 text-black hover:bg-cyan-400"
            >
              Browse Products
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('home')}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="border-b border-border bg-gradient-to-br from-cyan-500/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
              <button
                onClick={() => navigate('wholesale')}
                className="text-muted-foreground transition-colors hover:text-cyan-400"
              >
                Wholesale
              </button>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">Apply</span>
            </nav>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Wholesale Application
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete the form below to apply for B2B wholesale access
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-border bg-card/50 p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Business Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                placeholder="Your registered business name"
                required
                className="border-border bg-card text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                placeholder="Tell us about your business, target market, expected order volume, etc."
                rows={4}
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
                  <>
                    <Send className="mr-2 size-4" />
                    Submit Application
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('wholesale')}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
