import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  toggleItem: (item: WishlistItem) => void
  isInWishlist: (id: string) => boolean
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id)
        if (!exists) {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      toggleItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id)
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== item.id) })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id)
      },
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'morpheye-wishlist',
    }
  )
)
