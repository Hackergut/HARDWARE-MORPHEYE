/**
 * Morpheye Type Definitions
 * Centralized type definitions following Interface Segregation Principle (ISP)
 * Each interface is small and focused on a specific concern
 */

// ============ Product Types ============

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductSpec {
  key: string
  value: string
}

export interface ProductBase {
  id: string
  name: string
  slug: string
  shortDesc?: string | null
  price: number
  comparePrice?: number | null
  brand?: string | null
  featured?: boolean
  rating?: number
  reviewCount?: number
}

export interface ProductDetail extends ProductBase {
  description?: string | null
  images: string[]
  sku?: string | null
  stock: number
  active: boolean
  specs: Record<string, string>
  tags: string[]
  categoryId: string
  category?: CategoryBrief
}

export interface ProductListItem extends ProductBase {
  images: string[]
}

export interface ProductFormPayload {
  name: string
  slug: string
  shortDesc?: string | null
  description?: string | null
  price: number
  comparePrice?: number | null
  brand?: string | null
  sku?: string | null
  stock: number
  categoryId: string
  featured: boolean
  active: boolean
  images: string[]
  specs: Record<string, string>
  tags: string[]
}

// ============ Category Types ============

export interface CategoryBrief {
  id: string
  name: string
  slug: string
}

export interface CategoryWithCount extends CategoryBrief {
  description?: string | null
  image?: string | null
  featured: boolean
  productCount: number
}

// ============ Cart Types ============

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  itemCount: number
  freeShippingThreshold: number
  isEligibleForFreeShipping: boolean
}

// ============ Order Types ============

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string | null
}

export interface OrderBase {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  total: number
  createdAt: string
}

export interface OrderDetail extends OrderBase {
  customerPhone?: string | null
  shippingAddr?: string | null
  shippingCity?: string | null
  shippingCountry?: string | null
  shippingZip?: string | null
  paymentStatus: string
  paymentMethod?: string | null
  subtotal: number
  shipping: number
  tax: number
  notes?: string | null
  items: OrderItem[]
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderCreatePayload {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddr?: string
  shippingCity?: string
  shippingCountry?: string
  shippingZip?: string
  items: Array<{ productId: string; quantity: number }>
  paymentMethod?: string
}

// ============ Contact Types ============

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string | null
  message: string
  read: boolean
  createdAt: string
}

export interface ContactCreatePayload {
  name: string
  email: string
  subject?: string
  message: string
}

// ============ Settings Types ============

export interface SiteSettings {
  site_name: string
  tagline: string
  meta_description: string
  meta_pixel_id: string
  currency: string
  shipping_fee: string
  free_shipping_threshold: string
  tax_rate: string
  contact_email: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  telegram_url: string
}

// ============ Dashboard Types ============

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: OrderBase[]
  ordersByStatus: Record<string, number>
  topProducts: ProductListItem[]
}

// ============ API Response Types ============

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductListResponse {
  products: ProductListItem[]
  total: number
}

export interface CategoryListResponse {
  categories: CategoryWithCount[]
}

export interface OrderCreateResponse {
  order: OrderDetail
}

// ============ Filter/Sort Types ============

export type ProductSortOption = 'price_asc' | 'price_desc' | 'newest' | 'rating'

export interface ProductFilters {
  category?: string
  search?: string
  featured?: boolean
  brand?: string
  sort?: ProductSortOption
  page?: number
  limit?: number
}

export interface OrderFilters {
  status?: OrderStatus
  search?: string
  page?: number
  limit?: number
}
