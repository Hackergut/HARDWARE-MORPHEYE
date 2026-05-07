import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_ITEMS = 8

interface RecentlyViewedState {
  productIds: string[]
  addProduct: (id: string) => void
  getProducts: () => string[]
  clearAll: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addProduct: (id) => {
        const current = get().productIds.filter((pid) => pid !== id)
        set({ productIds: [id, ...current].slice(0, MAX_ITEMS) })
      },
      getProducts: () => {
        return get().productIds
      },
      clearAll: () => {
        set({ productIds: [] })
      },
    }),
    {
      name: 'morpheye-recently-viewed',
    }
  )
)
