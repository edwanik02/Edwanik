'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ROUTES } from '@/constants'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, role: 'CUSTOMER' }) })
      const data = await res.json()
      if (!data.success) { setError(data.error ?? 'Login failed'); return }
      setUser(data.data.user); router.push('/')
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-7"><div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🧸</div><h1 className="font-serif text-2xl font-bold">Welcome Back</h1><p className="text-sm text-slate-500 mt-1">Sign in to your FunziToys account</p></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Email or Mobile</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="text" placeholder="you@example.com" required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" /></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Password</label><input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" placeholder="••••••••" required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" /></div>
          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-brand text-white font-bold py-3 rounded-full hover:bg-[var(--pd)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1">{loading ? 'Signing in…' : 'Login →'}</button>
        </form>
        <div className="mt-5 text-center space-y-2">
          <p className="text-sm text-slate-500">Don't have an account? <Link href={ROUTES.REGISTER} className="text-brand font-bold hover:underline">Register free</Link></p>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400"><Link href="/owner/login" className="hover:text-brand">Owner Login</Link><span>·</span><Link href="/admin/login" className="hover:text-brand">Admin</Link></div>
          <p className="text-xs text-slate-400 border-t border-slate-100 pt-3 mt-3">Demo: <strong>arjun@example.com</strong> / cust123</p>
        </div>
      </div>
    </div>
  )
}
