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
  | 'search'
  | 'admin' 
  | 'admin-products' 
  | 'admin-orders' 
  | 'admin-order-detail'
  | 'admin-settings'
  | 'admin-contact'

interface NavigationState {
  currentPage: Page
  selectedProductId: string | null
  selectedCategory: string | null
  searchQuery: string | null
  selectedBrand: string | null
  selectedOrderId: string | null
  navigate: (page: Page, params?: { productId?: string; category?: string; query?: string; brand?: string; orderId?: string }) => void
  goBack: () => void
  history: Page[]
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentPage: 'home',
  selectedProductId: null,
  selectedCategory: null,
  searchQuery: null,
  selectedBrand: null,
  selectedOrderId: null,
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
      selectedOrderId: params?.orderId ?? null,
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
