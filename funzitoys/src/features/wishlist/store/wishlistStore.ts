import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistState { items: Product[]; toggle: (product: Product) => void; isIn: (productId: string) => boolean; clear: () => void }

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => set((s) => ({
        items: s.items.some(i => i.id === product.id) ? s.items.filter(i => i.id !== product.id) : [...s.items, product],
      })),
      isIn: (pid) => get().items.some(i => i.id === pid),
      clear: () => set({ items: [] }),
    }),
    { name: 'ft-wishlist' }
  )
)
