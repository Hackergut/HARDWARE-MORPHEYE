import { create } from 'zustand'

export type Page = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'checkout-success'
  | 'wishlist'
  | 'comparison'
  | 'tracking'
  | 'contact'
  | 'admin' 
  | 'admin-products' 
  | 'admin-orders' 
  | 'admin-settings'
  | 'admin-contact'

interface NavigationState {
  currentPage: Page
  selectedProductId: string | null
  selectedCategory: string | null
  searchQuery: string | null
  selectedBrand: string | null
  navigate: (page: Page, params?: { productId?: string; category?: string; query?: string; brand?: string }) => void
  goBack: () => void
  history: Page[]
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentPage: 'home',
  selectedProductId: null,
  selectedCategory: null,
  searchQuery: null,
  selectedBrand: null,
  history: ['home'],
  navigate: (page, params) => {
    const state = get()
    const newHistory = [...state.history, page].slice(-30) // Keep last 30 entries max
    set({
      currentPage: page,
      selectedProductId: params?.productId ?? null,
      selectedCategory: params?.category ?? null,
      searchQuery: params?.query ?? null,
      selectedBrand: params?.brand ?? null,
      history: newHistory,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  goBack: () => {
    const state = get()
    if (state.history.length > 1) {
      const newHistory = [...state.history]
      newHistory.pop()
      const prevPage = newHistory[newHistory.length - 1]
      set({ currentPage: prevPage, history: newHistory })
    }
  },
}))
