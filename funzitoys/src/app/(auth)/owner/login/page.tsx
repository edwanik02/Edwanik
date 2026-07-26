'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ROUTES } from '@/constants'

export default function OwnerLoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, role: 'OWNER' }) })
      const data = await res.json()
      if (!data.success) { setError(data.error ?? 'Login failed'); return }
      setUser(data.data.user); router.push(ROUTES.OWNER.DASHBOARD)
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)' }}>
      <div className="w-full max-w-sm">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-7"><div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1.5 mb-4"><span className="text-xs font-bold text-violet-300 uppercase tracking-wider">🔒 Owner Access</span></div><h1 className="font-serif text-2xl font-bold text-white">Owner Login</h1><p className="text-sm text-white/50 mt-1">Credentials provided by Admin only</p></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Owner Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="owner@store.com" required className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 transition-all" /></div>
            <div><label className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1.5">Password</label><input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" placeholder="••••••••" required className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 transition-all" /></div>
            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-brand text-white font-bold py-3 rounded-full hover:bg-[var(--pd)] transition-colors disabled:opacity-50">{loading ? 'Signing in…' : 'Login to Dashboard →'}</button>
          </form>
          <div className="mt-5 text-center space-y-2">
            <p className="text-xs text-white/40">Demo: <strong className="text-white/60">ravi@store.com</strong> / owner123</p>
            <div className="flex justify-center gap-4 text-xs"><Link href="/owner-portal" className="text-violet-400 hover:underline">← Owner Portal</Link><Link href="/owner-portal#request" className="text-white/40 hover:text-white/60">Request Access</Link></div>
          </div>
        </div>
      </div>
    </div>
  )
}
