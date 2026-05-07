'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useAdminAuthStore } from '@/store/admin-auth-store'
import { useNavigationStore } from '@/store/navigation-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      navigate('admin')
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
            <Shield className="size-8 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Morpheye"
              width={32}
              height={32}
              className="rounded"
            />
            <h1 className="text-2xl font-bold text-white">Morpheye</h1>
          </div>
          <p className="mt-2 text-sm text-neutral-400">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-cyan-500/5">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-white">Sign In</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@morpheye.com"
                  required
                  className="border-neutral-700 bg-neutral-800 pl-10 text-white placeholder:text-neutral-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="border-neutral-700 bg-neutral-800 pl-10 pr-10 text-white placeholder:text-neutral-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
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
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-600">
          Morpheye Admin Panel &middot; Authorized Hardware Wallet Reseller
        </p>
      </div>
    </div>
  )
}
