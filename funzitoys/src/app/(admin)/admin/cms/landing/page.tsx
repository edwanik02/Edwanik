'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'

export default function AdminLandingEditorPage() {
  const [custForm, setCustForm] = useState({ headline: 'Where Joy Meets Every Childhood', subtext: 'Safe, educational and endlessly fun toys.', brandName: 'FunziToys' })
  const [ownerForm, setOwnerForm] = useState({ contactEmail: 'support@funzitoys.com', whatsapp: '+91 9876543210', benefitsText: 'Join FunziToys and grow your toy business online with powerful tools.' })
  const [saved, setSaved] = useState<'cust' | 'owner' | null>(null)
  const cf = (k: keyof typeof custForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCustForm(p => ({ ...p, [k]: e.target.value }))
  const of = (k: keyof typeof ownerForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setOwnerForm(p => ({ ...p, [k]: e.target.value }))
  const inp = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all"

  const handleSaveCust = () => { setSaved('cust'); setTimeout(() => setSaved(null), 3000) }
  const handleSaveOwner = () => { setSaved('owner'); setTimeout(() => setSaved(null), 3000) }

  return (
    <div className="max-w-4xl space-y-6">
      <div><h1 className="font-serif text-2xl font-bold">📄 Landing Page Editor</h1><p className="text-sm text-slate-500">Customize customer & owner landing pages</p></div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold">Customer Landing Page</h3>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Hero Headline</label><input value={custForm.headline} onChange={cf('headline')} className={inp} /></div>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Hero Sub Text</label><textarea value={custForm.subtext} onChange={cf('subtext')} rows={2} className={inp + ' resize-none'} /></div>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Brand Name Display</label><input value={custForm.brandName} onChange={cf('brandName')} className={inp} /></div>
        {saved === 'cust' && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"><Check className="w-4 h-4" />Customer landing page updated!</div>}
        <button onClick={handleSaveCust} className="px-6 py-2.5 bg-brand text-white font-bold rounded-full text-sm hover:bg-[var(--pd)] transition-colors">Save Changes</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold">Owner Landing Page</h3>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Contact Email (shown on owner page)</label><input value={ownerForm.contactEmail} onChange={of('contactEmail')} className={inp} /></div>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">WhatsApp (shown on owner page)</label><input value={ownerForm.whatsapp} onChange={of('whatsapp')} className={inp} /></div>
        <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Owner Benefits Text</label><textarea value={ownerForm.benefitsText} onChange={of('benefitsText')} rows={3} className={inp + ' resize-none'} /></div>
        {saved === 'owner' && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"><Check className="w-4 h-4" />Owner landing page updated!</div>}
        <button onClick={handleSaveOwner} className="px-6 py-2.5 bg-brand text-white font-bold rounded-full text-sm hover:bg-[var(--pd)] transition-colors">Save Changes</button>
      </div>
    </div>
  )
}
