'use client'
import { useState } from 'react'

export default function OwnerRequestFormClient() {
  const [form, setForm] = useState({ name: '', shopName: '', email: '', phone: '', businessType: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/admin/owner-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!data.success) { setError(data.error ?? 'Failed to submit'); return }
      setSubmitted(true)
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  const inputCls = "w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-all"

  if (submitted) return <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"><div className="text-5xl mb-4">🎉</div><h3 className="font-serif text-xl font-bold text-white mb-2">Request Submitted!</h3><p className="text-white/60 text-sm">Thank you! Our admin will review your application and respond within 24 hours by email.</p></div>

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-7 space-y-4 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Your Name *</label><input value={form.name} onChange={f('name')} placeholder="Full name" required className={inputCls} /></div>
        <div><label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Shop Name *</label><input value={form.shopName} onChange={f('shopName')} placeholder="My Toy Shop" required className={inputCls} /></div>
      </div>
      <div><label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Email Address *</label><input value={form.email} onChange={f('email')} type="email" placeholder="you@business.com" required className={inputCls} /></div>
      <div><label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Phone Number *</label><input value={form.phone} onChange={f('phone')} type="tel" placeholder="+91 9876543210" required className={inputCls} /></div>
      <div>
        <label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Business Type *</label>
        <select value={form.businessType} onChange={f('businessType')} required className={inputCls}>
          <option value="" className="bg-slate-900">Select business type…</option>
          {['Toy Manufacturer', 'Toy Retailer', 'Online Seller', 'Wholesale Dealer', 'Home Business', 'Other'].map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
        </select>
      </div>
      <div><label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Message (optional)</label><textarea value={form.message} onChange={f('message')} rows={3} placeholder="Tell us about your business…" className={inputCls + ' resize-none'} /></div>
      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-400/20 px-4 py-2.5 rounded-xl">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-3.5 bg-brand text-white font-bold rounded-full hover:bg-[var(--pd)] transition-colors disabled:opacity-50">{loading ? 'Submitting…' : 'Submit Request →'}</button>
      <p className="text-center text-xs text-white/30">We'll review and respond within 24 hours by email</p>
    </form>
  )
}
