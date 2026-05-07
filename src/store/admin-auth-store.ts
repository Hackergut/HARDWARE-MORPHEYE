import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminAuthState {
  isAuthenticated: boolean
  adminEmail: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminEmail: null,
      login: (email: string, password: string) => {
        if (email === 'admin@morpheye.com' && password === 'morpheye2024') {
          set({ isAuthenticated: true, adminEmail: email })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false, adminEmail: null }),
    }),
    {
      name: 'morpheye-admin-auth',
    }
  )
)
