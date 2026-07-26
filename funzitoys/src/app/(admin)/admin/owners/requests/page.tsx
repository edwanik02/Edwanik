'use client'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/utils'
import type { OwnerRequest } from '@/types'

export default function OwnerRequestsPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<OwnerRequest | null>(null)
  const [password, setPassword] = useState('')
  const [note, setNote] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [processing, setProcessing] = useState(false)

  const { data: requests = [], isLoading } = useQuery<OwnerRequest[]>({
    queryKey: ['owner-requests'],
    queryFn: async () => { const r = await fetch('/api/admin/owner-requests'); const d = await r.json(); return d.data ?? [] },
  })

  const handleAction = async () => {
    if (!selected || !action) return
    if (action === 'approve' && !password) { alert('Please set a password for the owner'); return }
    setProcessing(true)
    try {
      const res = await fetch(`/api/admin/owner-requests/${selected.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, password, note }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      qc.invalidateQueries({ queryKey: ['owner-requests'] })
      setSelected(null); setAction(null); setPassword(''); setNote('')
    } catch (e) { alert((e as Error).message) } finally { setProcessing(false) }
  }

  const pending = requests.filter(r => r.status === 'PENDING')
  const processed = requests.filter(r => r.status !== 'PENDING')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">📋 Owner Access Requests</h1>
        <p className="text-sm text-slate-500">Review and approve or reject owner applications</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold">Pending Requests</h3>
          <span className="bg-orange-100 text-brand text-xs font-bold px-2.5 py-1 rounded-full">{pending.length} pending</span>
        </div>
        {isLoading ? (
          <div className="p-4 space-y-3 animate-pulse">{[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}</div>
        ) : pending.length === 0 ? (
          <div className="text-center py-10 text-slate-400"><div className="text-4xl mb-2">✅</div><p>No pending requests</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['Name', 'Shop', 'Email', 'Phone', 'Business Type', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {pending.map(r => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-semibold">{r.name}</td>
                    <td className="py-3 px-4 text-sm">{r.shopName}</td>
                    <td className="py-3 px-4 text-sm">{r.email}</td>
                    <td className="py-3 px-4 text-sm">{r.phone}</td>
                    <td className="py-3 px-4"><span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{r.businessType}</span></td>
                    <td className="py-3 px-4 text-xs text-slate-400">{formatDate(r.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => { setSelected(r); setAction('approve') }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => { setSelected(r); setAction('reject') }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {processed.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100"><h3 className="font-bold">Processed Requests</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['Name', 'Shop', 'Email', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {processed.map(r => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm font-semibold">{r.name}</td>
                    <td className="py-3 px-4 text-sm">{r.shopName}</td>
                    <td className="py-3 px-4 text-sm">{r.email}</td>
                    <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${r.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span></td>
                    <td className="py-3 px-4 text-xs text-slate-400">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && action && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold">{action === 'approve' ? '✅ Approve Owner' : '❌ Reject Request'}</h3>
              <button onClick={() => { setSelected(null); setAction(null) }} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
                <p className="text-sm"><strong>Name:</strong> {selected.name}</p>
                <p className="text-sm"><strong>Shop:</strong> {selected.shopName}</p>
                <p className="text-sm"><strong>Email:</strong> {selected.email}</p>
                <p className="text-sm"><strong>Type:</strong> {selected.businessType}</p>
                {selected.message && <p className="text-sm text-slate-500 italic">"{selected.message}"</p>}
              </div>
              {action === 'approve' && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Set Login Password *</label>
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Create password for owner" required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all" />
                  <p className="text-xs text-slate-400 mt-1">Password will be emailed to the owner automatically</p>
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Note (optional)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Optional note for records…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand transition-all resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setSelected(null); setAction(null) }} className="flex-1 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleAction} disabled={processing}
                  className={`flex-1 py-2.5 rounded-full text-white text-sm font-bold transition-colors disabled:opacity-50 ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                  {processing ? 'Processing…' : action === 'approve' ? 'Approve & Create Account' : 'Reject Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
