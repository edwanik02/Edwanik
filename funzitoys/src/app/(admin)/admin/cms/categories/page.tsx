'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { ImageUpload } from '@/components/common/ImageUpload'
import type { Category } from '@/types'

export default function AdminCategoriesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', emoji: '📦', description: '' })
  const [imgUrls, setImgUrls] = useState<string[]>([])
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all"

  const { data: cats = [], isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => { const r = await fetch('/api/categories'); const d = await r.json(); return d.data ?? [] },
  })

  const addMut = useMutation({
    mutationFn: async () => { const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, imageUrl: imgUrls[0] }) }); return res.json() },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setShowForm(false); setForm({ name: '', emoji: '📦', description: '' }); setImgUrls([]) },
  })
  const delMut = useMutation({
    mutationFn: async (id: string) => { await fetch(`/api/categories/${id}`, { method: 'DELETE' }) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-serif text-2xl font-bold">📂 Categories</h1><p className="text-sm text-slate-500">Manage product categories</p></div>
        <button onClick={() => setShowForm(s => !s)} className="inline-flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[var(--pd)] transition-colors"><Plus className="w-4 h-4" />Add Category</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold">Add New Category</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Name *</label><input value={form.name} onChange={f('name')} placeholder="e.g. Building Blocks" className={inp} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Emoji Icon</label><input value={form.emoji} onChange={f('emoji')} maxLength={4} placeholder="🧱" className={inp} /></div>
          </div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Description</label><textarea value={form.description} onChange={f('description')} rows={2} placeholder="Short description..." className={inp + ' resize-none'} /></div>
          <ImageUpload value={imgUrls} onChange={(urls) => setImgUrls(urls)} maxFiles={1} label="Category Image (optional)" />
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={() => addMut.mutate()} disabled={!form.name || addMut.isPending} className="flex-1 py-2.5 rounded-full bg-brand text-white text-sm font-bold hover:bg-[var(--pd)] transition-colors disabled:opacity-50">{addMut.isPending ? 'Adding…' : 'Add Category'}</button>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {cats.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-brand hover:shadow-md transition-all group relative">
              {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-2" /> : <div className="text-4xl mb-2">{c.emoji}</div>}
              <p className="font-bold text-sm">{c.name}</p>
              <button onClick={() => delMut.mutate(c.id)} className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
