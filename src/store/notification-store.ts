import { create } from 'zustand'

interface NotificationState {
  message: string | null
  type: 'success' | 'error' | 'info' | null
  show: (message: string, type?: 'success' | 'error' | 'info') => void
  hide: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: null,
  show: (message, type = 'success') => {
    set({ message, type })
    setTimeout(() => set({ message: null, type: null }), 3500)
  },
  hide: () => set({ message: null, type: null }),
}))
