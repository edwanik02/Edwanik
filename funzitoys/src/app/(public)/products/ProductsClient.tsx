'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product, Category } from '@/types'

interface Props { initialProducts: Product[]; categories: Category[]; total: number; page: number; limit: number; initialSearch?: string; initialCategory?: string }

export function ProductsClient({ initialProducts, categories, total, page, limit, initialSearch = '', initialCategory = '' }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isPending, startTransition] = useTransition()
  const totalPages = Math.ceil(total / limit)

  const updateUrl = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams()
    if (search) sp.set('search', search)
    if (activeCategory) sp.set('category', activeCategory)
    if (sortBy !== 'createdAt') sp.set('sortBy', sortBy)
    if (sortOrder !== 'desc') sp.set('sortOrder', sortOrder)
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); else sp.delete(k) })
    startTransition(() => router.push(`/products?${sp.toString()}`))
  }

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); updateUrl({ search: search || undefined, page: undefined }) }
  const handleCategory = (slug: string) => { setActiveCategory(slug); updateUrl({ category: slug || undefined, page: undefined }) }
  const handleSort = (val: string) => { const [by, order] = val.split('-'); setSortBy(by); setSortOrder(order); updateUrl({ sortBy: by, sortOrder: order, page: undefined }) }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3"><div><h1 className="font-serif text-2xl font-bold">🛍️ All Products</h1><p className="text-sm text-slate-500">{total} products available</p></div></div>
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 flex-1 max-w-sm focus-within:border-brand transition-all">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="bg-transparent text-sm outline-none w-full" />
        </form>
        <select onChange={e => handleSort(e.target.value)} className="border border-slate-200 rounded-full px-4 py-2 text-sm bg-white outline-none focus:border-brand transition-all cursor-pointer">
          <option value="createdAt-desc">Newest First</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name-asc">Name A–Z</option>
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button onClick={() => handleCategory('')} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${!activeCategory ? 'bg-brand text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand hover:text-brand'}`}>All</button>
        {categories.map(c => <button key={c.id} onClick={() => handleCategory(c.slug)} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === c.slug ? 'bg-brand text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand hover:text-brand'}`}><span>{c.emoji}</span>{c.name}</button>)}
      </div>
      <div className={isPending ? 'opacity-60 pointer-events-none transition-opacity' : 'transition-opacity'}><ProductGrid products={initialProducts} /></div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => updateUrl({ page: String(page - 1) })} disabled={page <= 1} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30 hover:border-brand hover:text-brand transition-all"><ChevronLeft className="w-4 h-4" /></button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => { const p = i + 1; return <button key={p} onClick={() => updateUrl({ page: String(p) })} className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${page === p ? 'bg-brand text-white' : 'border border-slate-200 hover:border-brand hover:text-brand'}`}>{p}</button> })}
          <button onClick={() => updateUrl({ page: String(page + 1) })} disabled={page >= totalPages} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30 hover:border-brand hover:text-brand transition-all"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  )
}
