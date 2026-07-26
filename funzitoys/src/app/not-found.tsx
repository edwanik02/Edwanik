import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-4">🧸</div>
        <h1 className="font-serif text-4xl font-bold mb-2">404</h1>
        <p className="text-slate-500 mb-6">Oops! This page wandered off. Let's get you back to the toy store.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-6 py-2.5 bg-brand text-white font-bold rounded-full text-sm hover:bg-[var(--pd)] transition-colors">Go Home</Link>
          <Link href="/products" className="px-6 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-full text-sm hover:bg-slate-50 transition-colors">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}
