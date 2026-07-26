'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'

const COLORS = ['#FF6B35', '#E91E63', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9', '#14B8A6', '#F97316']

export default function OwnerSettingsPage() {
  const [form, setForm] = useState({ storeName: 'FunziToys', tagline: 'Fun For Everyone!', about: 'Quality toys for every child.', waNum: '+91 9876543210', waTpl: "Hi! I'd like to order:\n{product} x{qty} = {price}\nPlease confirm." })
  const [color, setColor] = useState('#FF6B35')
  const [saved, setSaved] = useState(false)
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  const handleSave = () => { document.documentElement.style.setProperty('--p', color); setSaved(true); setTimeout(() => setSaved(false), 3000) }
  const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all"

  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="font-serif text-2xl font-bold">⚙️ Store Settings</h1><p className="text-sm text-slate-500">Customize your store appearance and WhatsApp integration</p></div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Store Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Store Name</label><input value={form.storeName} onChange={f('storeName')} className={inp} /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Tagline</label><input value={form.tagline} onChange={f('tagline')} className={inp} /></div>
        </div>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">About Your Store</label><textarea value={form.about} onChange={f('about')} rows={3} className={inp + ' resize-none'} /></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">💬 WhatsApp Settings</h3>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">WhatsApp Number (with country code)</label><input value={form.waNum} onChange={f('waNum')} placeholder="+91 9876543210" className={inp} /></div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Order Message Template</label>
          <textarea value={form.waTpl} onChange={f('waTpl')} rows={4} className={inp + ' resize-none font-mono text-xs'} />
          <p className="text-xs text-slate-400 mt-1">Use: <code className="bg-slate-100 px-1 rounded">{'{product}'}</code>, <code className="bg-slate-100 px-1 rounded">{'{qty}'}</code>, <code className="bg-slate-100 px-1 rounded">{'{price}'}</code></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">🎨 Theme Color</h3>
        <div className="flex gap-2 flex-wrap items-center">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-all hover:scale-110 border-[3px] ${color === c ? 'border-slate-800 scale-110 shadow-lg' : 'border-white shadow'}`}
              style={{ backgroundColor: c }} />
          ))}
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-0 p-0" title="Custom color" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm text-slate-500 font-mono">{color}</span>
          <span className="text-xs text-brand font-semibold">← Current selection</span>
        </div>
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"><Check className="w-4 h-4" />Settings saved successfully!</div>}
      <button onClick={handleSave} className="w-full py-3 rounded-full bg-brand text-white font-bold hover:bg-[var(--pd)] transition-colors">Save All Settings</button>
    </div>
  )
}
