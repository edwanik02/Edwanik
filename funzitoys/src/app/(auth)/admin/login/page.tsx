'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ROUTES } from '@/constants'

export default function AdminLoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, role: 'SUPER_ADMIN' }) })
      const data = await res.json()
      if (!data.success) { setError(data.error ?? 'Access denied'); return }
      setUser(data.data.user); router.push(ROUTES.ADMIN.DASHBOARD)
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0F0F23, #1a1a3e, #0F1629)' }}>
      <div className="w-full max-w-sm">
        <div className="bg-white/3 backdrop-blur-xl border border-white/8 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-7"><div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }}>⚙️</div><h1 className="font-serif text-2xl font-bold text-white">Admin Access</h1><p className="text-xs text-white/30 mt-1 uppercase tracking-widest">Restricted · Authorized Only</p></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1.5">Admin Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="admin@funzitoys.com" required className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all" /></div>
            <div><label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1.5">Password</label><input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" placeholder="••••••••" required className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all" /></div>
            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="w-full text-white font-bold py-3 rounded-full transition-colors disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }}>{loading ? 'Verifying…' : 'Access Admin Panel →'}</button>
          </form>
          <p className="text-center text-xs text-white/25 mt-5">Demo: admin@funzitoys.com / admin123</p>
          <div className="text-center mt-2"><Link href="/" className="text-xs text-white/30 hover:text-white/50">← Back to Store</Link></div>
        </div>
      </div>
    </div>
  )
}
