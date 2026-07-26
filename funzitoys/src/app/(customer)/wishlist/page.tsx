'use client'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  const { items } = useWishlistStore()
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6"><Heart className="w-6 h-6 text-brand fill-brand" /><h1 className="font-serif text-2xl font-bold">My Wishlist</h1><span className="text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{items.length} item{items.length !== 1 ? 's' : ''}</span></div>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Click ❤️ on any product to save it here</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-brand text-white font-bold px-7 py-3 rounded-full hover:bg-[var(--pd)] transition-colors">Browse Products</Link>
        </div>
      ) : <ProductGrid products={items} />}
    </div>
  )
}
