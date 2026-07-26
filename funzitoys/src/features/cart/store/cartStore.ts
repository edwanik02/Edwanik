import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) => set((s) => {
        const ex = s.items.find(i => i.product.id === product.id)
        if (ex) return { items: s.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i) }
        return { items: [...s.items, { id: product.id, product, quantity: qty }] }
      }),
      removeItem: (pid) => set((s) => ({ items: s.items.filter(i => i.product.id !== pid) })),
      updateQty: (pid, qty) => {
        if (qty <= 0) { get().removeItem(pid); return }
        set((s) => ({ items: s.items.map(i => i.product.id === pid ? { ...i, quantity: qty } : i) }))
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'ft-cart' }
  )
)
