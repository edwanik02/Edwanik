import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us – FunziToys' }
export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  let settings = null
  try {
    settings = await prisma.siteSettings.findFirst()
  } catch (err) {
    console.error('Failed to fetch site settings:', err)
  }
  return (
    <>
      <Navbar siteName={settings?.siteName ?? 'FunziToys'} logoUrl={settings?.logoUrl ?? undefined} />
      <main className="pt-16 max-w-5xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white text-center mb-10">
          <h1 className="font-serif text-4xl font-bold mb-4">About FunziToys 🧸</h1>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">We believe every child deserves the joy of play. Quality toys, safe materials, endless smiles since 2020.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6 text-center"><p className="font-serif text-3xl font-bold text-brand">{val}</p><p className="text-sm text-slate-500 mt-1">{label}</p></div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[['🛡️', 'Safety First', 'All toys meet strict safety standards'], ['💰', 'Best Prices', 'Direct from manufacturers'], ['🚀', 'Fast Delivery', 'Quick dispatch nationwide'], ['💬', 'WA Support', 'Personal order assistance']].map(([icon, title, desc]) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand hover:shadow-md transition-all"><div className="text-3xl mb-2">{icon}</div><h4 className="font-bold text-sm mb-1">{title}</h4><p className="text-xs text-slate-500">{desc}</p></div>
          ))}
        </div>
      </main>
      <Footer settings={settings ? { id: settings.id, siteName: settings.siteName, primaryColor: settings.primaryColor } : null} />
    </>
  )
}
