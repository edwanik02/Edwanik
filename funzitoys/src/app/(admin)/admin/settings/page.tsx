'use client'
import { useState } from 'react'
import { ImageUpload } from '@/components/common/ImageUpload'

const COLORS = ['#FF6B35','#E91E63','#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#0EA5E9']

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ siteName: 'FunziToys', tagline: 'Fun For Everyone!', whatsappNum: '+91 9876543210', supportEmail: 'hello@funzitoys.com', primaryColor: '#FF6B35' })
  const [logoUrls, setLogoUrls] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="font-serif text-2xl font-bold">🎨 Site Settings</h1><p className="text-sm text-slate-500">Full website customization</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Branding & Identity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Site Name</label><input value={form.siteName} onChange={f('siteName')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Tagline</label><input value={form.tagline} onChange={f('tagline')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">WhatsApp Number</label><input value={form.whatsappNum} onChange={f('whatsappNum')} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Support Email</label><input value={form.supportEmail} onChange={f('supportEmail')} type="email" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Theme Color</label>
          <div className="flex gap-2 flex-wrap items-center">
            {COLORS.map(c => <button key={c} onClick={() => { setForm(p => ({ ...p, primaryColor: c })); document.documentElement.style.setProperty('--p', c) }} className={`w-8 h-8 rounded-full border-[3px] transition-all hover:scale-110 ${form.primaryColor === c ? 'border-slate-800 scale-110' : 'border-white shadow'}`} style={{ backgroundColor: c }} />)}
            <input type="color" value={form.primaryColor} onChange={e => { setForm(p => ({ ...p, primaryColor: e.target.value })); document.documentElement.style.setProperty('--p', e.target.value) }} className="w-8 h-8 rounded-full cursor-pointer border-0 p-0" title="Custom color" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-4">Brand Logo</h3>
        <ImageUpload value={logoUrls} onChange={(urls) => setLogoUrls(urls)} maxFiles={1} label="Upload Brand Logo (PNG/JPG · Square format)" />
      </div>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold">✅ Settings saved successfully!</div>}
      <button onClick={handleSave} className="w-full py-3 rounded-full bg-brand text-white font-bold hover:bg-[var(--pd)] transition-colors">Save All Settings</button>
    </div>
  )
}
