'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import { BADGE_COLORS, CAT_EMOJI } from '@/constants'
import { formatCurrency } from '@/utils'
import type { Product } from '@/types'

interface Props { product: Product; className?: string }

export function ProductCard({ product, className = '' }: Props) {
  const { addItem } = useCartStore()
  const { toggle, isIn } = useWishlistStore()
  const inWish = isIn(product.id)
  const primary = product.images.find(i => i.isPrimary) ?? product.images[0]
  const disc = product.mrpPrice ? Math.round((1 - product.price / product.mrpPrice) * 100) : 0

  return (
    <div data-testid="product-card" className={`group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-brand hover:shadow-lg transition-all duration-200 ${className}`}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          {primary ? (
            <Image src={primary.url} alt={primary.alt ?? product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width:640px) 50vw, 25vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col gap-2 bg-gradient-to-br from-orange-50 to-orange-100">
              <span className="text-6xl opacity-30">{CAT_EMOJI[product.category.name] ?? '📦'}</span>
              <span className="text-xs text-slate-400 font-medium">No image yet</span>
            </div>
          )}
          {product.badge && <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${BADGE_COLORS[product.badge] ?? ''}`}>{product.badge}</span>}
          {disc > 0 && <span className="absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{disc}% OFF</span>}
          <button onClick={e => { e.preventDefault(); toggle(product) }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform">
            <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>
        </div>
      </Link>
      <div className="p-3">
        <p className="text-xs font-bold text-brand uppercase tracking-wide mb-0.5">{product.category.name}</p>
        <Link href={`/products/${product.slug}`}><h3 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-brand transition-colors mb-1">{product.name}</h3></Link>
        {product.averageRating && <p className="text-xs text-slate-400 mb-1.5">{'⭐'.repeat(Math.round(product.averageRating))} <span>({product.reviewCount})</span></p>}
        <div className="flex items-center justify-between gap-1">
          <div>
            <span className="font-bold text-brand font-serif text-base">{formatCurrency(product.price)}</span>
            {product.mrpPrice && <span className="text-xs text-slate-400 line-through ml-1">{formatCurrency(product.mrpPrice)}</span>}
          </div>
          <button data-testid="add-to-cart" onClick={() => addItem(product)} className="text-xs bg-brand text-white font-bold px-2.5 py-1.5 rounded-lg hover:bg-[var(--pd)] transition-colors active:scale-95">🛒 Add</button>
        </div>
      </div>
    </div>
  )
}
