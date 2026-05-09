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
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'wholesale'
  | 'wholesale-apply'
  | 'loyalty'
  | 'subscriptions'
  | 'blog'
  | 'blog-post'
  | 'admin' 
  | 'admin-products' 
  | 'admin-orders' 
  | 'admin-order-detail'
  | 'admin-settings'
  | 'admin-contact'
  | 'admin-wholesale'
  | 'admin-wholesale-requests'
  | 'admin-email-campaigns'
  | 'admin-blog'
  | 'admin-loyalty'
  | 'admin-subscriptions'
  | 'admin-abandoned-carts'

const PAGE_URLS: Record<Page, string> = {
  home: '/',
  shop: '/shop',
  product: '/product',
  cart: '/cart',
  checkout: '/checkout',
  'checkout-success': '/checkout/success',
  wishlist: '/wishlist',
  comparison: '/compare',
  tracking: '/track',
  contact: '/contact',
  search: '/search',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  wholesale: '/wholesale',
  'wholesale-apply': '/wholesale/apply',
  loyalty: '/loyalty',
  subscriptions: '/subscriptions',
  blog: '/blog',
  'blog-post': '/blog/post',
  admin: '/admin',
  'admin-products': '/admin/products',
  'admin-orders': '/admin/orders',
  'admin-order-detail': '/admin/orders',
  'admin-settings': '/admin/settings',
  'admin-contact': '/admin/contact',
  'admin-wholesale': '/admin/wholesale',
  'admin-wholesale-requests': '/admin/wholesale/requests',
  'admin-email-campaigns': '/admin/email',
  'admin-blog': '/admin/blog',
  'admin-loyalty': '/admin/loyalty',
  'admin-subscriptions': '/admin/subscriptions',
  'admin-abandoned-carts': '/admin/abandoned-carts',
}

function buildUrl(page: Page, params?: { productId?: string; category?: string; query?: string; brand?: string; orderId?: string; postSlug?: string }): string {
  let url = PAGE_URLS[page]
  const search = new URLSearchParams()
  if (params?.productId) search.set('id', params.productId)
  if (params?.category) search.set('category', params.category)
  if (params?.query) search.set('q', params.query)
  if (params?.brand) search.set('brand', params.brand)
  if (params?.orderId) search.set('order', params.orderId)
  if (params?.postSlug) search.set('slug', params.postSlug)
  const qs = search.toString()
  return qs ? `${url}?${qs}` : url
}

function parseUrl(path: string, search: string): { page: Page; params?: any } {
  const params = new URLSearchParams(search)
  const map: Record<string, Page> = {
    '/': 'home',
    '/shop': 'shop',
    '/product': 'product',
    '/cart': 'cart',
    '/checkout': 'checkout',
    '/checkout/success': 'checkout-success',
    '/wishlist': 'wishlist',
    '/compare': 'comparison',
    '/track': 'tracking',
    '/contact': 'contact',
    '/search': 'search',
    '/faq': 'faq',
    '/privacy': 'privacy',
    '/terms': 'terms',
    '/wholesale': 'wholesale',
    '/wholesale/apply': 'wholesale-apply',
    '/loyalty': 'loyalty',
    '/subscriptions': 'subscriptions',
    '/blog': 'blog',
    '/blog/post': 'blog-post',
    '/admin': 'admin',
    '/admin/products': 'admin-products',
    '/admin/orders': 'admin-orders',
    '/admin/settings': 'admin-settings',
    '/admin/contact': 'admin-contact',
    '/admin/wholesale': 'admin-wholesale',
    '/admin/wholesale/requests': 'admin-wholesale-requests',
    '/admin/email': 'admin-email-campaigns',
    '/admin/blog': 'admin-blog',
    '/admin/loyalty': 'admin-loyalty',
    '/admin/subscriptions': 'admin-subscriptions',
    '/admin/abandoned-carts': 'admin-abandoned-carts',
  }

  const page = map[path] || 'home'
  const out: any = {}
  if (params.get('id')) out.productId = params.get('id')
  if (params.get('category')) out.category = params.get('category')
  if (params.get('q')) out.query = params.get('q')
  if (params.get('brand')) out.brand = params.get('brand')
  if (params.get('order')) out.orderId = params.get('order')
  if (params.get('slug')) out.postSlug = params.get('slug')
  return { page, params: Object.keys(out).length ? out : undefined }
}

interface NavigationState {
  currentPage: Page
  selectedProductId: string | null
  selectedCategory: string | null
  searchQuery: string | null
  selectedBrand: string | null
  selectedOrderId: string | null
  selectedPostSlug: string | null
  navigate: (page: Page, params?: { productId?: string; category?: string; query?: string; brand?: string; orderId?: string; postSlug?: string }) => void
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
  selectedPostSlug: null,
  history: ['home'],
  navigate: (page, params) => {
    const state = get()
    const newHistory = [...state.history, page].slice(-30)
    const url = buildUrl(page, params)
    // Push to browser history so URL changes and back button works
    window.history.pushState({ page, params }, '', url)
    set({
      currentPage: page,
      selectedProductId: params?.productId ?? null,
      selectedCategory: params?.category ?? null,
      searchQuery: params?.query ?? null,
      selectedBrand: params?.brand ?? null,
      selectedOrderId: params?.orderId ?? null,
      selectedPostSlug: params?.postSlug ?? null,
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
      window.history.back()
    }
  },
}))

/* ── Initialize from current URL on page load ── */
if (typeof window !== 'undefined') {
  const { page, params } = parseUrl(window.location.pathname, window.location.search)
  useNavigationStore.setState({
    currentPage: page,
    selectedProductId: params?.productId ?? null,
    selectedCategory: params?.category ?? null,
    searchQuery: params?.query ?? null,
    selectedBrand: params?.brand ?? null,
    selectedOrderId: params?.orderId ?? null,
    selectedPostSlug: params?.postSlug ?? null,
    history: [page],
  })

  // Listen to browser back/forward
  window.addEventListener('popstate', (e) => {
    if (e.state?.page) {
      useNavigationStore.setState({
        currentPage: e.state.page,
        selectedProductId: e.state.params?.productId ?? null,
        selectedCategory: e.state.params?.category ?? null,
        searchQuery: e.state.params?.query ?? null,
        selectedBrand: e.state.params?.brand ?? null,
        selectedOrderId: e.state.params?.orderId ?? null,
        selectedPostSlug: e.state.params?.postSlug ?? null,
      })
    }
  })
}
