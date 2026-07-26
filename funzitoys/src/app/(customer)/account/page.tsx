'use client'
import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import Image from 'next/image'
import { User, MapPin, Package, Heart, Camera } from 'lucide-react'
import { formatCurrency } from '@/utils'

const TABS = [
  { id: 'info', label: 'Personal Info', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
]

export default function AccountPage() {
  const { user } = useAuthStore()
  const { items: wishItems } = useWishlistStore()
  const [tab, setTab] = useState('info')
  const [form, setForm] = useState({ firstName: user?.name.split(' ')[0] ?? '', lastName: user?.name.split(' ').slice(1).join(' ') ?? '', email: user?.email ?? '', mobile: '' })
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '')
  const [saved, setSaved] = useState(false)
  const [addr, setAddr] = useState({ line1: '', city: '', state: '', pincode: '' })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) setAvatarUrl(data.data.url)
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  const a = (k: keyof typeof addr) => (e: React.ChangeEvent<HTMLInputElement>) => setAddr(p => ({ ...p, [k]: e.target.value }))
  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all"

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold mb-6">👤 My Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-center mb-5">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-brand border-4 border-orange-100 flex items-center justify-center text-3xl font-bold text-white">{avatarUrl ? <Image src={avatarUrl} alt="avatar" fill className="object-cover rounded-full" /> : user?.name[0] ?? '?'}</div>
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-brand text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--pd)] transition-colors shadow"><Camera className="w-3.5 h-3.5" /><input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" /></label>
            </div>
            <p className="font-bold text-base">{user?.name}</p><p className="text-xs text-brand font-semibold mt-0.5">Customer</p><p className="text-xs text-slate-400 mt-1">Tap photo to update</p>
          </div>
          <div className="space-y-1">
            {TABS.map(t => { const Icon = t.icon; return <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-orange-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Icon className="w-4 h-4" />{t.label}{t.id === 'wishlist' && wishItems.length > 0 && <span className="ml-auto bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{wishItems.length}</span>}</button> })}
          </div>
        </div>
        <div className="lg:col-span-3">
          {tab === 'info' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-base mb-5">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 mb-4"><div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">First Name</label><input value={form.firstName} onChange={f('firstName')} className={inputCls} /></div><div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Last Name</label><input value={form.lastName} onChange={f('lastName')} className={inputCls} /></div></div>
              <div className="mb-4"><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Email</label><input value={form.email} onChange={f('email')} type="email" className={inputCls} /></div>
              <div className="mb-5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Mobile / WhatsApp</label><input value={form.mobile} onChange={f('mobile')} type="tel" placeholder="+91 9876543210" className={inputCls} /></div>
              {saved && <div className="mb-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold">✅ Profile saved!</div>}
              <button onClick={handleSave} className="px-6 py-2.5 bg-brand text-white font-bold rounded-full text-sm hover:bg-[var(--pd)] transition-colors">Save Changes</button>
            </div>
          )}
          {tab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-base mb-5">Delivery Addresses</h3>
              <div className="space-y-3 mb-5">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Street Address</label><input value={addr.line1} onChange={a('line1')} placeholder="House no, Street, Area..." className={inputCls} /></div>
                <div className="grid grid-cols-3 gap-3"><div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">City</label><input value={addr.city} onChange={a('city')} placeholder="Chennai" className={inputCls} /></div><div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">State</label><input value={addr.state} onChange={a('state')} placeholder="Tamil Nadu" className={inputCls} /></div><div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Pincode</label><input value={addr.pincode} onChange={a('pincode')} placeholder="600001" className={inputCls} /></div></div>
              </div>
              <button onClick={() => alert('Address saved!')} className="px-6 py-2.5 bg-brand text-white font-bold rounded-full text-sm hover:bg-[var(--pd)] transition-colors">Save Address</button>
            </div>
          )}
          {tab === 'orders' && <div className="bg-white rounded-2xl border border-slate-200 p-6"><h3 className="font-bold text-base mb-4">My Orders</h3><div className="text-center py-10 text-slate-400"><Package className="w-12 h-12 mx-auto mb-3 text-slate-200" /><p className="font-semibold">No orders yet</p><p className="text-sm mt-1">Your WhatsApp orders will appear here after delivery confirmation</p></div></div>}
          {tab === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-base mb-4">My Wishlist ({wishItems.length})</h3>
              {wishItems.length === 0 ? <div className="text-center py-8 text-slate-400"><Heart className="w-10 h-10 mx-auto mb-2 text-slate-200" /><p>No wishlist items yet</p></div> : (
                <div className="space-y-3">{wishItems.map(p => { const img = p.images.find(i => i.isPrimary); return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand transition-all">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-2xl">{img ? <Image src={img.url} alt={p.name} width={48} height={48} className="object-cover" /> : '📦'}</div>
                    <div className="flex-1"><p className="text-sm font-semibold">{p.name}</p><p className="text-sm font-bold text-brand">{formatCurrency(p.price)}</p></div>
                    <button onClick={() => window.location.href = `/products/${p.slug}`} className="text-xs bg-brand text-white font-bold px-3 py-1.5 rounded-full hover:bg-[var(--pd)] transition-colors">View</button>
                  </div>
                )})}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
