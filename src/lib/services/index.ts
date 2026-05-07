/**
 * Service index - Dependency Inversion Principle (DIP)
 * All services are exported from a single module, making it easy to
 * swap implementations or add dependency injection later.
 * 
 * Usage: import { ProductService, OrderService } from '@/lib/services'
 */

export { ProductService } from './product-service'
export { OrderService } from './order-service'
export { CategoryService } from './category-service'
export { SettingsService } from './settings-service'
export { DashboardService } from './dashboard-service'
export { ContactService } from './contact-service'
