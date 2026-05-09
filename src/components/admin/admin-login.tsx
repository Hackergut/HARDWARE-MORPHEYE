'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAdminAuthStore } from '@/store/admin-auth-store'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAdminAuthStore((s) => s.login)
  const navigate = useNavigationStore((s) => s.navigate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a brief loading state
    await new Promise((r) => setTimeout(r, 500))

    const success = login(email, password)
    if (success) {
      window.location.hash = 'admin'
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-4">
      {/* Animated background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #06b6d4, transparent 70%)',
            animation: 'mesh-drift-1 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #14b8a6, transparent 70%)',
            animation: 'mesh-drift-2 15s ease-in-out infinite',
          }}
        />
        <div
          className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #0891b2, transparent 70%)',
            animation: 'mesh-drift-3 10s ease-in-out infinite',
          }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 flex flex-col items-center"
        >
          {/* Logo with glow ring */}
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-xl" />
            <div className="relative flex size-18 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 p-1">
              <Image
                src="/images/logo.png"
                alt="Morpheye"
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Morpheye</h1>
          <p className="mt-1 text-sm text-neutral-400">Authorized Hardware Wallet Reseller</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-cyan-500/10">
              <Shield className="size-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
              Admin Panel
            </span>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-7 shadow-2xl shadow-cyan-500/5 backdrop-blur-sm"
        >
          {/* Gradient top border */}
          <div className="absolute left-0 right-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Sign in to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-300">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-cyan-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@morpheye.com"
                  required
                  className="border-neutral-700 bg-neutral-800/80 pl-10 text-white placeholder:text-neutral-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-neutral-300">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-cyan-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="border-neutral-700 bg-neutral-800/80 pl-10 pr-10 text-white placeholder:text-neutral-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50 transition-all duration-200 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 rounded-lg border border-neutral-800 bg-neutral-800/30 p-3">
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Demo Credentials</p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span>Email: <code className="text-neutral-300">admin@morpheye.com</code></span>
              <span>Pass: <code className="text-neutral-300">morpheye2024</code></span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-center text-xs text-neutral-600"
        >
          Morpheye Admin Panel &middot; Secure Access Only
        </motion.p>
      </motion.div>
    </div>
  )
}
