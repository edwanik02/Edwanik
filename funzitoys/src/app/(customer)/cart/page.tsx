'use client'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { formatCurrency, buildOrderWhatsAppMessage, buildWhatsAppURL } from '@/utils'
import { CAT_EMOJI } from '@/constants'

export default function CartPage() {
  const { items, updateQty, removeItem, total, itemCount } = useCartStore()
  const { user } = useAuthStore()
  const count = itemCount()
  const subtotal = total()

  const handleWACheckout = () => {
    const waItems = items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price }))
    const msg = buildOrderWhatsAppMessage(waItems, subtotal, user?.name)
    window.open(buildWhatsAppURL('+919876543210', msg), '_blank')
  }

  if (count === 0) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <h2 className="font-serif text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-slate-500 mb-6">Add some amazing toys to get started!</p>
      <Link href="/products" className="inline-flex items-center gap-2 bg-brand text-white font-bold px-7 py-3 rounded-full hover:bg-[var(--pd)] transition-colors">Browse Products</Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold mb-2">🛒 Shopping Cart</h1>
      <p className="text-sm text-slate-500 mb-6">{count} item{count !== 1 ? 's' : ''} in your cart</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            const img = item.product.images.find(i => i.isPrimary) ?? item.product.images[0]
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-3xl">{img ? <Image src={img.url} alt={item.product.name} width={80} height={80} className="object-cover" /> : CAT_EMOJI[item.product.category.name] ?? '📦'}</div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="text-sm font-bold text-slate-800 hover:text-brand transition-colors line-clamp-1">{item.product.name}</Link>
                  <p className="text-xs text-brand font-semibold mt-0.5">{item.product.category.name}</p>
                  <p className="text-sm font-bold text-brand font-serif mt-1">{formatCurrency(item.product.price * item.quantity)}</p>
                  <p className="text-xs text-slate-400">{formatCurrency(item.product.price)} each</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="w-9 text-center text-sm font-bold border-x border-slate-200 py-1">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-20">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2.5 text-sm mb-4">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal ({count} items)</span><span className="font-semibold">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="text-green-600 font-bold">FREE 🎉</span></div>
            <div className="flex justify-between text-lg font-bold text-brand border-t border-slate-100 pt-3 font-serif"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
          </div>
          <button onClick={handleWACheckout} className="w-full py-3 rounded-full font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ background: '#25D366' }}>💬 Order via WhatsApp</button>
          <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">You'll be redirected to WhatsApp with your full order details</p>
          <div className="mt-3 pt-3 border-t border-slate-100"><Link href="/products" className="text-sm text-brand font-semibold hover:underline flex items-center justify-center gap-1">← Continue Shopping</Link></div>
        </div>
      </div>
    </div>
  )
}
