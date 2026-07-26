'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ImageUpload } from '@/components/common/ImageUpload'
import { ROUTES } from '@/constants'
import type { Category } from '@/types'

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', description: '', price: '', mrpPrice: '', categoryId: '', badge: '', stock: '0' })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imagePublicIds, setImagePublicIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: cats = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => { const r = await fetch('/api/categories'); const d = await r.json(); return d.data ?? [] },
  })

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), mrpPrice: form.mrpPrice ? Number(form.mrpPrice) : undefined, stock: Number(form.stock), imageUrls, imagePublicIds }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error ?? 'Failed to create product'); return }
      router.push(ROUTES.OWNER.PRODUCTS)
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">🧸 Add New Product</h1>
        <p className="text-sm text-slate-500">Fill in the details to list a new product</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Basic Information</h3>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Product Name *</label>
            <input value={form.name} onChange={f('name')} placeholder="e.g. Teddy Bear Deluxe" required className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={3} placeholder="Describe your product…" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Price (₹) *</label>
              <input value={form.price} onChange={f('price')} type="number" min="1" placeholder="499" required className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">MRP / Old Price (₹)</label>
              <input value={form.mrpPrice} onChange={f('mrpPrice')} type="number" min="1" placeholder="699" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Category *</label>
              <select value={form.categoryId} onChange={f('categoryId')} required className={inputCls}>
                <option value="">Select category…</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Badge</label>
              <select value={form.badge} onChange={f('badge')} className={inputCls}>
                <option value="">None</option>
                {['NEW', 'SALE', 'HOT', 'LIMITED', 'BESTSELLER'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Stock Quantity</label>
            <input value={form.stock} onChange={f('stock')} type="number" min="0" placeholder="100" className={inputCls} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <ImageUpload value={imageUrls} onChange={(urls, pids) => { setImageUrls(urls); setImagePublicIds(pids) }} maxFiles={4} label="Product Images (up to 4) — Upload from gallery or desktop" />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-full bg-brand text-white font-bold text-sm hover:bg-[var(--pd)] transition-colors disabled:opacity-50">
            {loading ? 'Saving…' : 'Add Product 🧸'}
          </button>
        </div>
      </form>
    </div>
  )
}
