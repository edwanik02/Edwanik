export const ROUTES = {
  HOME: '/', PRODUCTS: '/products', CATEGORIES: '/categories', ABOUT: '/about',
  CART: '/cart', CHECKOUT: '/checkout', WISHLIST: '/wishlist', ORDERS: '/orders',
  ACCOUNT: '/account', LOGIN: '/login', REGISTER: '/register', VERIFY_OTP: '/verify-otp',
  OWNER_PORTAL: '/owner-portal',
  OWNER: { LOGIN: '/owner/login', DASHBOARD: '/owner/dashboard', PRODUCTS: '/owner/products', NEW_PRODUCT: '/owner/products/new', ORDERS: '/owner/orders', CUSTOMERS: '/owner/customers', ANALYTICS: '/owner/analytics', OFFERS: '/owner/offers', BRANDING: '/owner/branding', SETTINGS: '/owner/settings' },
  ADMIN: { LOGIN: '/admin/login', DASHBOARD: '/admin/dashboard', OWNERS: '/admin/owners', REQUESTS: '/admin/owners/requests', CUSTOMERS: '/admin/users', PRODUCTS: '/admin/products', ORDERS: '/admin/orders', ANALYTICS: '/admin/analytics', SETTINGS: '/admin/settings', CMS: '/admin/cms', BANNERS: '/admin/cms/banners', CATEGORIES: '/admin/cms/categories', LANDING: '/admin/cms/landing', NOTIFICATIONS: '/admin/notifications' },
} as const
export const PERMISSIONS = { MANAGE_PRODUCTS: 'canManageProducts', MANAGE_ORDERS: 'canManageOrders', VIEW_CUSTOMERS: 'canViewCustomers', MANAGE_SETTINGS: 'canManageSettings', UPLOAD_IMAGES: 'canUploadImages', MANAGE_OFFERS: 'canManageOffers', VIEW_ANALYTICS: 'canViewAnalytics', EDIT_LANDING: 'canEditLanding' } as const
export const CAT_EMOJI: Record<string, string> = { Plushies: '🧸', Vehicles: '🚗', Games: '🎮', Creative: '🎨', Outdoor: '🏃', Educational: '📚' }
export const BADGE_COLORS: Record<string, string> = { NEW: 'bg-green-100 text-green-800', SALE: 'bg-red-100 text-red-800', HOT: 'bg-yellow-100 text-yellow-800', LIMITED: 'bg-purple-100 text-purple-800', BESTSELLER: 'bg-orange-100 text-orange-800' }
export const ORDER_STATUS_COLORS: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800', PROCESSING: 'bg-indigo-100 text-indigo-800', SHIPPED: 'bg-cyan-100 text-cyan-800', DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800', REFUNDED: 'bg-gray-100 text-gray-800' }
export const WA_DEFAULT_TEMPLATE = `Hi FunziToys! I'd like to order:
{product} x{qty} = {price}

Please confirm availability and delivery details.
Thank you!`
