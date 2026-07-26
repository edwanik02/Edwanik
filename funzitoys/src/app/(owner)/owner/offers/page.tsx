'use client'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Offer } from '@/types'

export default function OwnerOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', discountPct: '', appliesTo: 'all', startDate: '', endDate: '' })
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all"

  const handleAdd = () => {
    if (!form.title || !form.discountPct) return
    const newOffer: Offer = { id: `of${Date.now()}`, ownerId: 'me', title: form.title, discountPct: Number(form.discountPct), appliesTo: form.appliesTo, startDate: form.startDate || undefined, endDate: form.endDate || undefined, isActive: true, createdAt: new Date().toISOString() }
    setOffers(prev => [newOffer, ...prev])
    setForm({ title: '', discountPct: '', appliesTo: 'all', startDate: '', endDate: '' })
    setShowForm(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-serif text-2xl font-bold">🎁 Offers & Promotions</h1><p className="text-sm text-slate-500">Create discount offers for your customers</p></div>
        <button onClick={() => setShowForm(s => !s)} className="inline-flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[var(--pd)] transition-colors"><Plus className="w-4 h-4" /> New Offer</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold">Create New Offer</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Offer Title *</label><input value={form.title} onChange={f('title')} placeholder="Weekend Sale 20% Off" className={inp} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Discount % *</label><input value={form.discountPct} onChange={f('discountPct')} type="number" min="1" max="90" placeholder="20" className={inp} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Start Date</label><input value={form.startDate} onChange={f('startDate')} type="date" className={inp} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">End Date</label><input value={form.endDate} onChange={f('endDate')} type="date" className={inp} /></div>
            <div className="col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Applies To</label>
              <select value={form.appliesTo} onChange={f('appliesTo')} className={inp}>
                <option value="all">All Products</option><option value="category">By Category</option><option value="selected">Selected Products</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleAdd} className="flex-1 py-2.5 rounded-full bg-brand text-white text-sm font-bold hover:bg-[var(--pd)] transition-colors">Create Offer</button>
          </div>
        </div>
      )}

      {offers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="text-5xl mb-3">🎁</div>
          <p className="font-semibold">No offers yet</p>
          <p className="text-sm mt-1">Create your first promotion to attract customers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offers.map(o => (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base">{o.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{o.startDate ? `${o.startDate} → ${o.endDate || 'ongoing'}` : 'No date limit'}</p>
                </div>
                <span className="text-sm font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">{o.discountPct}% OFF</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Applies to: <strong>{o.appliesTo}</strong></p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">● Active</span>
                <button onClick={() => setOffers(prev => prev.filter(x => x.id !== o.id))} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
