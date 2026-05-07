import { create } from 'zustand'

export type Page = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'checkout-success'
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
  navigate: (page: Page, params?: { productId?: string; category?: string; query?: string }) => void
  goBack: () => void
  history: Page[]
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentPage: 'home',
  selectedProductId: null,
  selectedCategory: null,
  searchQuery: null,
  history: ['home'],
  navigate: (page, params) => {
    const state = get()
    set({
      currentPage: page,
      selectedProductId: params?.productId ?? null,
      selectedCategory: params?.category ?? null,
      searchQuery: params?.query ?? null,
      history: [...state.history, page],
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
