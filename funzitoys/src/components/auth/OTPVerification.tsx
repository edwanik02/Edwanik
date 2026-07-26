'use client'
import { useState, useRef, KeyboardEvent } from 'react'

interface Props { email: string; onVerify: (otp: string) => Promise<void>; onResend: () => Promise<void>; isLoading?: boolean }

export function OTPVerification({ email, onVerify, onResend, isLoading }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [cooldown, setCooldown] = useState(0)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const next = [...otp]; next[i] = v.slice(-1); setOtp(next)
    if (v && i < 5) inputs.current[i + 1]?.focus()
  }
  const handleKeyDown = (i: number, e: KeyboardEvent) => { if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus() }
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) { setOtp(text.split('')); inputs.current[5]?.focus() }
  }
  const handleResend = async () => {
    await onResend()
    setCooldown(60)
    const iv = setInterval(() => setCooldown(p => { if (p <= 1) { clearInterval(iv); return 0 } return p - 1 }), 1000)
  }

  return (
    <div className="space-y-6 text-center">
      <div>
        <div className="text-5xl mb-3">📧</div>
        <h3 className="text-xl font-bold font-serif">Verify Your Email</h3>
        <p className="text-sm text-slate-500 mt-1">OTP sent to <strong className="text-slate-700">{email}</strong></p>
      </div>
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {otp.map((d, i) => (
          <input key={i} ref={el => { inputs.current[i] = el }} data-testid="otp-input" type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all focus:shadow-[0_0_0_3px_rgba(255,107,53,0.15)] ${d ? 'border-brand bg-orange-50' : 'border-slate-200'}`} />
        ))}
      </div>
      <button onClick={() => onVerify(otp.join(''))} disabled={otp.join('').length !== 6 || isLoading}
        className="w-full py-3 rounded-full bg-brand text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--pd)] transition-colors">
        {isLoading ? 'Verifying…' : 'Verify & Continue →'}
      </button>
      <p className="text-sm text-slate-500">
        Didn't receive it?{' '}
        {cooldown > 0 ? <span className="text-slate-400">Resend in {cooldown}s</span> : <button onClick={handleResend} className="text-brand font-semibold hover:underline">Resend OTP</button>}
      </p>
    </div>
  )
}
