'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[App Error]', error) }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
        <h1 className="font-serif text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-slate-500 text-sm mb-6">We hit an unexpected error. Please try again, or head back to the homepage.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-6 py-2.5 bg-brand text-white font-bold rounded-full text-sm hover:bg-[var(--pd)] transition-colors">Try Again</button>
          <Link href="/" className="px-6 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-full text-sm hover:bg-slate-50 transition-colors">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
