import type { Product } from '../../src/types'

export const mockProduct: Product = {
  id: 'test-prod-1', name: 'Teddy Bear Deluxe', slug: 'teddy-bear-deluxe',
  description: 'Super soft premium teddy bear', price: 499, mrpPrice: 699, badge: 'BESTSELLER',
  isNew: false, isActive: true,
  category: { id: 'c1', name: 'Plushies', slug: 'plushies', emoji: '🧸', isActive: true, sortOrder: 1 },
  owner: { id: 'ow1', storeName: 'FunziToys' },
  images: [{ id: 'img1', url: 'https://res.cloudinary.com/test/teddy.jpg', publicId: 'funzitoys/test/teddy', isPrimary: true, sortOrder: 0 }],
  inventory: { quantity: 50, reserved: 0, lowStockAt: 5 },
  averageRating: 4.9, reviewCount: 128,
  createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
}

export const mockProductNoImage: Product = {
  ...mockProduct, id: 'test-prod-2', name: 'RC Racing Car', slug: 'rc-racing-car', price: 1299,
  images: [], category: { id: 'c2', name: 'Vehicles', slug: 'vehicles', emoji: '🚗', isActive: true, sortOrder: 2 },
}
