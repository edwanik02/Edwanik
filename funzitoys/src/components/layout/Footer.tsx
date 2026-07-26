import Link from 'next/link'
import Image from 'next/image'
import type { SiteSettings } from '@/types'

interface Props { settings?: Partial<SiteSettings> | null }

export function Footer({ settings }: Props) {
  const name = settings?.siteName ?? 'FunziToys'
  const email = settings?.supportEmail ?? 'hello@funzitoys.com'
  const wa = settings?.whatsappNum ?? '+91 9876543210'

  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand overflow-hidden flex items-center justify-center">
                {settings?.logoUrl ? <Image src={settings.logoUrl} alt={name} width={36} height={36} className="object-cover" /> : <span className="text-xl">🧸</span>}
              </div>
              <span className="font-serif text-xl font-bold text-brand">{name}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">Your one-stop destination for safe, fun & educational toys. Trusted by 10,000+ happy families.</p>
            <p className="mt-4 text-xs text-brand font-bold tracking-wider uppercase">🚀 Built by EDWANIKSTUDIO</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['🏠 Home', '/'], ['🛍️ Products', '/products'], ['📂 Categories', '/categories'], ['ℹ️ About Us', '/about'], ['🛒 Cart', '/cart']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-slate-400 hover:text-brand transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Help</h4>
            <ul className="space-y-2.5">
              {['Free Shipping', 'WhatsApp Orders', 'Easy Returns', 'Track Order', 'FAQ'].map(item => <li key={item}><span className="text-sm text-slate-400 hover:text-brand transition-colors cursor-pointer">{item}</span></li>)}
              <li><Link href="/owner-portal" className="text-sm text-slate-400 hover:text-brand transition-colors">Owner Portal →</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <p className="flex gap-2"><span>💬</span><span>WhatsApp: {wa}</span></p>
              <p className="flex gap-2"><span>📧</span><span>{email}</span></p>
              <p className="flex gap-2"><span>📍</span><span>India · Worldwide Shipping</span></p>
              <p className="flex gap-2"><span>⏰</span><span>Mon–Sat 9AM–8PM IST</span></p>
            </div>
            <div className="flex gap-2 mt-4">
              {['📸', '👍', '▶️', '💬'].map((icon, i) => <a key={i} href="#" className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm hover:bg-brand hover:border-brand transition-all">{icon}</a>)}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs text-slate-500">© 2026 <strong className="text-slate-400">EDWANIKSTUDIO</strong>. All Rights Reserved. | Powered by {name}</p>
          <div className="flex gap-2">{['🔒 Secure', '💬 WhatsApp', '📱 Mobile Ready'].map(b => <span key={b} className="text-[10px] text-slate-500 bg-slate-800 border border-slate-700 rounded px-2 py-1">{b}</span>)}</div>
        </div>
      </div>
    </footer>
  )
}
