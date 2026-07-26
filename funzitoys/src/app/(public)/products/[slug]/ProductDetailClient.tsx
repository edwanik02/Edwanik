'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Heart, Minus, Plus, Star, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import { formatCurrency, buildWhatsAppURL } from '@/utils'
import { BADGE_COLORS, CAT_EMOJI } from '@/constants'
import type { Product } from '@/types'

export function ProductDetailClient({ product, waNumber }: { product: Product; waNumber: string }) {
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()
  const { toggle, isIn } = useWishlistStore()
  const inWish = isIn(product.id)
  const disc = product.mrpPrice ? Math.round((1 - product.price / product.mrpPrice) * 100) : 0

  const handleAddToCart = () => { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2000) }
  const handleWAOrder = () => {
    const msg = `Hi FunziToys! I'd like to order:\n${product.name} ×${qty} = ${formatCurrency(product.price * qty)}\nPlease confirm availability & delivery details. Thank you!`
    window.open(buildWhatsAppURL(waNumber, msg), '_blank')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      <div>
        <div className="rounded-2xl overflow-hidden aspect-square bg-slate-50 mb-3 relative">
          {product.images.length > 0 ? <Image src={product.images[activeImg].url} alt={product.images[activeImg].alt ?? product.name} fill className="object-cover" />
            : <div className="w-full h-full flex flex-col items-center justify-center gap-2"><span className="text-9xl opacity-20">{CAT_EMOJI[product.category.name] ?? '📦'}</span><p className="text-sm text-slate-400">No image uploaded yet</p></div>}
          {product.badge && <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${BADGE_COLORS[product.badge] ?? ''}`}>{product.badge}</span>}
        </div>
        {product.images.length > 1 && <div className="flex gap-2">{product.images.map((img, i) => <button key={img.id} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand' : 'border-slate-200 hover:border-brand'}`}><Image src={img.url} alt="" width={64} height={64} className="object-cover" /></button>)}</div>}
      </div>
      <div>
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-2">{product.category.name}</p>
        <h1 className="font-serif text-3xl font-bold text-slate-900 mb-3 leading-tight">{product.name}</h1>
        {product.averageRating && <div className="flex items-center gap-2 mb-4"><div className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating!) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}</div><span className="text-sm font-bold">{product.averageRating}</span><span className="text-sm text-slate-400">({product.reviewCount} reviews)</span></div>}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif text-4xl font-bold text-brand">{formatCurrency(product.price)}</span>
          {product.mrpPrice && <span className="text-xl text-slate-400 line-through">{formatCurrency(product.mrpPrice)}</span>}
          {disc > 0 && <span className="text-sm font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">{disc}% OFF</span>}
        </div>
        {product.description && <p className="text-slate-600 text-sm leading-relaxed mb-5">{product.description}</p>}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm font-bold text-slate-700">Qty:</span>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
            <span className="w-12 text-center text-sm font-bold border-x border-slate-200 py-2">{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.inventory?.quantity ?? 99, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
          </div>
          <span className="text-xs text-slate-400">{product.inventory?.quantity ?? 0} in stock</span>
        </div>
        <div className="space-y-3 mb-5">
          <button onClick={handleAddToCart} className={`w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-600' : 'bg-brand hover:bg-[var(--pd)]'} text-white`}><ShoppingCart className="w-4 h-4" />{added ? '✅ Added to Cart!' : 'Add to Cart'}</button>
          <button onClick={handleWAOrder} className="w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 text-white transition-all" style={{ background: '#25D366' }}>💬 Order via WhatsApp</button>
          <button onClick={() => toggle(product)} className={`w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 border transition-all ${inWish ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 text-slate-600 hover:border-brand hover:text-brand'}`}><Heart className={`w-4 h-4 ${inWish ? 'fill-red-500' : ''}`} />{inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}</button>
        </div>
        <div className="grid grid-cols-2 gap-2">{[['🛡️', 'Safety Certified'], ['🚀', 'Fast Delivery'], ['↩️', '7-Day Returns'], ['💬', 'WA Support']].map(([icon, label]) => <div key={label} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5"><span>{icon}</span><span className="text-xs font-semibold text-slate-600">{label}</span></div>)}</div>
      </div>
    </div>
  )
}
