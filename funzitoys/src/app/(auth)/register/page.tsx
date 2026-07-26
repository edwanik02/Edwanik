'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OTPVerification } from '@/components/auth/OTPVerification'
import { ROUTES } from '@/constants'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!data.success) { setError(data.error ?? 'Registration failed'); return }
      setStep('otp')
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  const handleVerify = async (otp: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, code: otp }) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      router.push(ROUTES.LOGIN + '?verified=1')
    } finally { setLoading(false) }
  }

  const handleResend = async () => { await fetch('/api/auth/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email }) }) }
  const f = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        {step === 'form' ? (
          <>
            <div className="text-center mb-7"><div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🧸</div><h1 className="font-serif text-2xl font-bold">Create Account</h1><p className="text-sm text-slate-500 mt-1">Join thousands of happy families</p></div>
            <form onSubmit={handleRegister} className="space-y-3" data-testid="register-form">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">First Name *</label><input id="firstName" value={form.firstName} onChange={f('firstName')} placeholder="John" required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Last Name</label><input id="lastName" value={form.lastName} onChange={f('lastName')} placeholder="Doe" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
              </div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Email *</label><input id="email" value={form.email} onChange={f('email')} type="email" placeholder="you@example.com" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Mobile</label><input id="mobile" value={form.mobile} onChange={f('mobile')} type="tel" placeholder="+91 9876543210" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Password *</label><input id="password" value={form.password} onChange={f('password')} type="password" placeholder="Min 8 characters" required minLength={8} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" /></div>
              {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-brand text-white font-bold py-3 rounded-full hover:bg-[var(--pd)] transition-colors disabled:opacity-50 mt-1">{loading ? 'Sending OTP…' : 'Send OTP to Email →'}</button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-5">Already have an account? <Link href={ROUTES.LOGIN} className="text-brand font-bold hover:underline">Login</Link></p>
          </>
        ) : <OTPVerification email={form.email} onVerify={handleVerify} onResend={handleResend} isLoading={loading} />}
      </div>
    </div>
  )
}
