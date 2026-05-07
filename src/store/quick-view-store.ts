import { create } from 'zustand'

interface QuickViewState {
  selectedProductId: string | null
  isOpen: boolean
  open: (productId: string) => void
  close: () => void
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
  selectedProductId: null,
  isOpen: false,
  open: (productId: string) => set({ selectedProductId: productId, isOpen: true }),
  close: () => set({ isOpen: false, selectedProductId: null }),
}))
