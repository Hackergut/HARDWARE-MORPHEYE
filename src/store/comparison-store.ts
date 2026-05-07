import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_ITEMS = 3

interface ComparisonState {
  items: string[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
  isInComparison: (id: string) => boolean
  clearAll: () => void
  getItemCount: () => number
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => {
        const current = get().items
        if (current.includes(id)) return
        if (current.length >= MAX_ITEMS) return
        set({ items: [...current, id] })
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i !== id) })
      },
      isInComparison: (id) => {
        return get().items.includes(id)
      },
      clearAll: () => {
        set({ items: [] })
      },
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'morpheye-comparison',
    }
  )
)
