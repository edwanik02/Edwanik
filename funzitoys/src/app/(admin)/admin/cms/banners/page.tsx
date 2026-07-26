'use client'
import { useState } from 'react'
import { ImageUpload } from '@/components/common/ImageUpload'
import { Check } from 'lucide-react'

export default function AdminBannersPage() {
  const [hero, setHero] = useState({ title: 'The Happiest Toy Store Online', subtitle: 'Safe, fun & educational toys for every age.', eyebrow: 'New Arrivals 2025', ctaText: 'Shop Now' })
  const [heroImgs, setHeroImgs] = useState<string[]>([])
  const [promoImgs1, setPromoImgs1] = useState<string[]>([])
  const [promoImgs2, setPromoImgs2] = useState<string[]>([])
  const [promoImgs3, setPromoImgs3] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const h = (k: keyof typeof hero) => (e: React.ChangeEvent<HTMLInputElement>) => setHero(p => ({ ...p, [k]: e.target.value }))
  const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all"
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  return (
    <div className="max-w-4xl space-y-6">
      <div><h1 className="font-serif text-2xl font-bold">🖼️ Banner Management</h1><p className="text-sm text-slate-500">Upload and manage homepage banners</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold">Hero Banner</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Headline Text</label><input value={hero.title} onChange={h('title')} className={inp} /></div>
          <div className="col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Sub Text</label><input value={hero.subtitle} onChange={h('subtitle')} className={inp} /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Eyebrow Text</label><input value={hero.eyebrow} onChange={h('eyebrow')} className={inp} /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">CTA Button Text</label><input value={hero.ctaText} onChange={h('ctaText')} className={inp} /></div>
        </div>
        <ImageUpload value={heroImgs} onChange={setHeroImgs} maxFiles={1} label="Hero Background Image (800×400px recommended)" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold">Promotional Banners</h3>
        <p className="text-sm text-slate-500">Upload secondary banners for promotions and special offers</p>
        <div className="space-y-4">
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Promo Banner 1</p><ImageUpload value={promoImgs1} onChange={setPromoImgs1} maxFiles={1} label="Upload Promo Banner 1" /></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Promo Banner 2</p><ImageUpload value={promoImgs2} onChange={setPromoImgs2} maxFiles={1} label="Upload Promo Banner 2" /></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Promo Banner 3</p><ImageUpload value={promoImgs3} onChange={setPromoImgs3} maxFiles={1} label="Upload Promo Banner 3" /></div>
        </div>
      </div>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"><Check className="w-4 h-4" />Banner settings saved!</div>}
      <button onClick={handleSave} className="w-full py-3 rounded-full bg-brand text-white font-bold hover:bg-[var(--pd)] transition-colors">Save All Banners</button>
    </div>
  )
}
