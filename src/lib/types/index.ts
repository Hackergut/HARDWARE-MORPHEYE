/**
 * Morpheye Type Definitions
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
  wholesalePrice?: number | null
  wholesaleOnly?: boolean
  minWholesaleQty?: number
  lowStockThreshold?: number
  bundleIds?: string[]
  bundleDiscount?: number | null
  isSubscription?: boolean
  subscriptionInterval?: string | null
  subscriptionPrice?: number | null
  isReward?: boolean
  rewardCost?: number | null
}

export interface ProductListItem extends ProductBase {
  images: string[]
  wholesalePrice?: number | null
  lowStockThreshold?: number
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
  wholesalePrice?: number | null
  wholesaleOnly?: boolean
  minWholesaleQty?: number
  lowStockThreshold?: number
  bundleIds?: string[]
  bundleDiscount?: number | null
  isSubscription?: boolean
  subscriptionInterval?: string | null
  subscriptionPrice?: number | null
  isReward?: boolean
  rewardCost?: number | null
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
  giftMessage?: string | null
  isWholesale?: boolean
  netTermDays?: number | null
  netTermDueDate?: string | null
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
  giftMessage?: string
  isWholesale?: boolean
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
  loyalty_points_per_dollar: string
  referral_points: string
  wholesale_min_order: string
}

// ============ Wholesale Types ============

export interface WholesaleTier {
  id: string
  name: string
  minPoints: number
  discountPct: number
  minOrder: number
  netTermDays: number
  description?: string | null
  active: boolean
}

export interface WholesaleRequest {
  id: string
  userId: string
  businessName: string
  vatNumber?: string | null
  companyReg?: string | null
  phone: string
  notes?: string | null
  status: WholesaleRequestStatus
  createdAt: string
}

export type WholesaleRequestStatus = 'pending' | 'approved' | 'rejected'

export interface WholesaleRequestPayload {
  businessName: string
  vatNumber?: string
  companyReg?: string
  phone: string
  notes?: string
}

// ============ Loyalty Types ============

export interface LoyaltyReward {
  id: string
  name: string
  description?: string | null
  pointsCost: number
  type: 'discount' | 'product' | 'shipping'
  value: string
  active: boolean
  image?: string | null
}

export interface UserLoyalty {
  points: number
  tier: LoyaltyTier
  referralCode: string
  nextTierPoints: number
  tierProgress: number
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export const LOYALTY_TIERS: Record<LoyaltyTier, { minPoints: number; discount: number; label: string }> = {
  bronze: { minPoints: 0, discount: 0, label: 'Bronze' },
  silver: { minPoints: 500, discount: 5, label: 'Silver' },
  gold: { minPoints: 2000, discount: 10, label: 'Gold' },
  platinum: { minPoints: 5000, discount: 15, label: 'Platinum' },
}

// ============ Subscription Types ============

export interface Subscription {
  id: string
  userId: string
  productId: string
  productName?: string
  productImage?: string
  interval: SubscriptionInterval
  price: number
  status: SubscriptionStatus
  nextDelivery?: string | null
  lastOrderId?: string | null
  createdAt: string
}

export type SubscriptionInterval = 'weekly' | 'monthly' | 'quarterly' | 'yearly'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

// ============ Email / Abandoned Cart Types ============

export interface EmailLog {
  id: string
  type: EmailType
  recipient: string
  subject?: string | null
  sent: boolean
  error?: string | null
  createdAt: string
}

export type EmailType = 'welcome' | 'abandoned_cart' | 'post_purchase' | 'win_back' | 'order_confirmation' | 'shipping_update' | 'review_request'

export interface AbandonedCartEntry {
  id: string
  email: string
  name?: string | null
  items: string
  subtotal: number
  couponCode?: string | null
  recovered: boolean
  sentAt?: string | null
  createdAt: string
}

// ============ Blog Types ============

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  image?: string | null
  category?: string | null
  author: string
  published: boolean
  featured: boolean
  tags: string[]
  readTime?: number | null
  createdAt: string
  updatedAt: string
}

// ============ Dashboard Types ============

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: OrderBase[]
  ordersByStatus: Record<string, number>
  topProducts: ProductListItem[]
  totalWholesaleRequests: number
  pendingWholesaleRequests: number
  totalSubscriptions: number
  abandonedCartsCount: number
  loyaltyPointsIssued: number
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
  wholesale?: boolean
}

export interface OrderFilters {
  status?: OrderStatus
  search?: string
  page?: number
  limit?: number
}
