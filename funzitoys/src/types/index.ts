export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'OWNER' | 'CUSTOMER'
export interface AuthUser { id: string; email: string; name: string; role: Role; avatarUrl?: string; isVerified: boolean }
export interface ApiResponse<T = unknown> { success: boolean; data?: T; message?: string; error?: string; pagination?: Pagination }
export interface Pagination { page: number; limit: number; total: number; totalPages: number }
export interface PaginationParams { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }
export type BadgeType = 'NEW' | 'SALE' | 'HOT' | 'LIMITED' | 'BESTSELLER'
export interface ProductImage { id: string; url: string; publicId: string; alt?: string; isPrimary: boolean; sortOrder: number }
export interface Category { id: string; name: string; slug: string; emoji: string; imageUrl?: string; description?: string; isActive: boolean; sortOrder: number }
export interface Inventory { quantity: number; reserved: number; lowStockAt: number }
export interface OwnerBasic { id: string; storeName: string; logoUrl?: string }
export interface Product { id: string; name: string; slug: string; description?: string; price: number; mrpPrice?: number; badge?: BadgeType; isNew: boolean; isActive: boolean; category: Category; owner: OwnerBasic; images: ProductImage[]; inventory?: Inventory; averageRating?: number; reviewCount?: number; createdAt: string; updatedAt: string }
export interface CreateProductDTO { name: string; description?: string; price: number; mrpPrice?: number; categoryId: string; badge?: BadgeType; stock?: number; imageUrls?: string[]; imagePublicIds?: string[] }
export interface CartItem { id: string; product: Product; quantity: number }
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export interface OrderItem { id: string; productId: string; productName: string; price: number; quantity: number; total: number; product?: Product }
export interface Address { id: string; label: string; line1: string; line2?: string; city: string; state: string; pincode: string; country: string; isDefault: boolean }
export interface CustomerBasic { id: string; name: string; email: string; mobile?: string; avatarUrl?: string }
export interface Order { id: string; orderNumber: string; customer?: CustomerBasic; customerId: string; items: OrderItem[]; subtotal: number; shippingFee: number; discount: number; total: number; status: OrderStatus; paymentStatus: PaymentStatus; paymentMethod: string; address?: Address; createdAt: string; updatedAt: string }
export interface OwnerPermissions { canManageProducts: boolean; canManageOrders: boolean; canViewCustomers: boolean; canManageSettings: boolean; canUploadImages: boolean; canManageOffers: boolean; canViewAnalytics: boolean; canEditLanding: boolean }
export interface Owner { id: string; userId: string; storeName: string; storeSlug: string; logoUrl?: string; bannerUrl?: string; whatsappNum?: string; isApproved: boolean; permissions?: OwnerPermissions }
export interface OwnerRequest { id: string; name: string; shopName: string; email: string; phone: string; businessType: string; message?: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; createdAt: string }
export type NotificationType = 'ORDER' | 'PRODUCT' | 'CUSTOMER' | 'SYSTEM' | 'PAYMENT' | 'ALERT'
export interface Notification { id: string; title: string; body: string; type: NotificationType; isRead: boolean; link?: string; createdAt: string }
export interface MonthlyStat { month: string; revenue: number; orders: number }
export interface AnalyticsSummary { totalRevenue: number; totalOrders: number; totalProducts: number; totalCustomers: number; monthlySales: MonthlyStat[]; topProducts: Product[]; recentOrders: Order[] }
export interface HeroBanner { id: string; title: string; subtitle?: string; eyebrow?: string; imageUrl?: string; ctaText?: string; ctaLink?: string; isActive: boolean; sortOrder: number }
export interface SiteSettings { id: string; siteName: string; tagline?: string; logoUrl?: string; primaryColor: string; whatsappNum?: string; supportEmail?: string }
export interface Offer { id: string; ownerId: string; title: string; discountPct: number; appliesTo: string; startDate?: string; endDate?: string; isActive: boolean; createdAt: string }
