import Link from 'next/link'
import OwnerRequestFormClient from './OwnerRequestFormClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Owner Portal – FunziToys', description: 'Join FunziToys as a verified shop owner and grow your toy business online' }

export default function OwnerPortalPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)' }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-xl">🧸</div>
          <span className="font-serif text-xl font-bold text-brand">FunziToys</span>
          <span className="text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30 px-2 py-0.5 rounded-full ml-1">Owner Portal</span>
        </Link>
        <div className="flex items-center gap-3"><a href="#request" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Request Access</a><Link href="/owner/login" className="px-5 py-2 bg-brand text-white font-bold rounded-full text-sm hover:bg-[var(--pd)] transition-colors">Owner Login</Link></div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-400/25 rounded-full px-3 py-1.5 mb-5"><span className="text-sm">🏪</span><span className="text-xs font-bold text-violet-300 uppercase tracking-wider">For Shop Owners & Sellers</span></div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-4">Grow Your Toy <span className="text-violet-300">Business</span> Online</h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8">Join FunziToys as a verified shop owner. Get your own dashboard, manage products, track orders — all in one place.</p>
          <div className="flex gap-3 flex-wrap"><a href="#request" className="px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-[var(--pd)] transition-all hover:-translate-y-0.5">Request Owner Access</a><Link href="/owner/login" className="px-8 py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all">Already an Owner? Login</Link></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['📊', 'Live Dashboard', 'Real-time sales tracking'], ['🧸', 'Product Mgmt', 'Upload & manage products'], ['💬', 'WhatsApp Orders', 'Direct to your WhatsApp'], ['👥', 'Customer Insights', 'Know your buyers']].map(([ico, title, desc]) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5"><div className="text-3xl mb-2">{ico}</div><p className="font-bold text-white text-sm mb-1">{title}</p><p className="text-xs text-white/50">{desc}</p></div>
          ))}
        </div>
      </section>

      <section className="py-14 px-6 bg-white/3">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-white text-center mb-8">Why Join FunziToys?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[['🎯', 'Targeted Audience', 'Reach thousands of parents actively looking for quality toys.'], ['📱', 'Mobile Friendly', 'Manage your store from mobile. Upload photos from gallery.'], ['📈', 'Sales Analytics', 'Detailed reports on sales and customer behaviour.'], ['🔧', 'Easy Setup', 'Get live in minutes. No technical skills required.'], ['💳', 'Fast Payments', 'Multiple payment methods. Fast settlements.'], ['🛡️', 'Secure Platform', 'Enterprise-grade security. Data always protected.']].map(([ico, title, desc]) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5"><div className="text-2xl mb-2">{ico}</div><h3 className="font-bold text-white text-sm mb-1">{title}</h3><p className="text-xs text-white/50 leading-relaxed">{desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-white text-center mb-8">How to Get <span className="text-brand">Started</span></h2>
        <div className="space-y-5">
          {[['1', 'Submit Your Request', 'Fill the access form below. Takes 2 minutes.'], ['2', 'Admin Review', 'Our admin reviews within 24 hours.'], ['3', 'Receive Credentials', 'Login email & password sent by email.'], ['4', 'Start Selling!', 'Upload products & receive orders immediately.']].map(([num, title, desc]) => (
            <div key={num} className="flex gap-4 items-start"><div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">{num}</div><div className="pt-1"><h4 className="font-bold text-white mb-0.5">{title}</h4><p className="text-sm text-white/50">{desc}</p></div></div>
          ))}
        </div>
      </section>

      <section id="request" className="py-14 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-7"><p className="text-xs font-bold text-brand uppercase tracking-widest mb-2">Get Started Today</p><h2 className="font-serif text-2xl font-bold text-white">Request Owner Access</h2><p className="text-white/50 text-sm mt-2">We'll create your account within 24 hours.</p></div>
          <OwnerRequestFormClient />
        </div>
      </section>

      <div className="py-5 px-6 border-t border-white/10 text-center"><p className="text-white/30 text-xs">© 2026 EDWANIKSTUDIO. All Rights Reserved. | <Link href="/" className="text-brand hover:underline">Back to Store</Link></p></div>
    </div>
  )
}
