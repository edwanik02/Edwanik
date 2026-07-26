'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { BADGE_COLORS } from '@/constants'
import type { Product } from '@/types'

async function fetchMyProducts(search: string): Promise<Product[]> {
  const res = await fetch(`/api/products?ownerId=me&search=${search}`)
  const data = await res.json()
  return data.data ?? []
}

export default function OwnerProductsPage() {
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['owner-products', search],
    queryFn: () => fetchMyProducts(search),
  })

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['owner-products'] }),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold">🧸 My Products</h1>
          <p className="text-sm text-slate-500">Manage your product listings</p>
        </div>
        <Link href="/owner/products/new" className="inline-flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-full hover:bg-[var(--pd)] transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-2 flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="bg-transparent text-sm outline-none w-full" />
          </div>
          <span className="text-sm text-slate-500">{products.length} products</span>
        </div>

        {isLoading ? (
          <div className="animate-pulse p-4 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-3">🧸</div>
            <p className="font-semibold">No products yet</p>
            <p className="text-sm mt-1">Add your first product to get started</p>
            <Link href="/owner/products/new" className="inline-block mt-4 bg-brand text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[var(--pd)] transition-colors">+ Add Product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {products.map(p => {
                  const img = p.images.find(i => i.isPrimary) ?? p.images[0]
                  return (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-xl">
                            {img ? <Image src={img.url} alt={p.name} width={40} height={40} className="object-cover" /> : '📦'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                            {p.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_COLORS[p.badge] ?? ''}`}>{p.badge}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className="text-xs font-bold text-brand bg-orange-50 px-2 py-1 rounded-full">{p.category.name}</span></td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-bold text-brand">{formatCurrency(p.price)}</p>
                        {p.mrpPrice && <p className="text-xs text-slate-400 line-through">{formatCurrency(p.mrpPrice)}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-bold ${(p.inventory?.quantity ?? 0) < 10 ? 'text-red-600' : 'text-slate-700'}`}>{p.inventory?.quantity ?? 0}</span>
                      </td>
                      <td className="py-3 px-4"><span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/owner/products/${p.id}/edit`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => { if (confirm('Delete this product?')) deleteMut.mutate(p.id) }} disabled={deleteMut.isPending}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
