import { prisma } from '@/lib/prisma'
import { formatDate } from '@/utils'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  let customers: any[] = []
  try {
    customers = await prisma.user.findMany({ where: { role: 'CUSTOMER', deletedAt: null }, orderBy: { createdAt: 'desc' } })
  } catch (err) {
    console.error('Failed to query admin users:', err)
  }
  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-2xl font-bold">👥 All Customers</h1><p className="text-sm text-slate-500">{customers.length} registered customers</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50">{['Customer', 'Email', 'Mobile', 'Status', 'Joined'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>)}</tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-[var(--pl)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{c.name[0]}</div><p className="text-sm font-semibold">{c.name}</p></div></td>
                  <td className="py-3 px-4 text-sm">{c.email}</td>
                  <td className="py-3 px-4 text-sm">{c.mobile ?? '—'}</td>
                  <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${c.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.isVerified ? '✅ Verified' : '⏳ Pending'}</span></td>
                  <td className="py-3 px-4 text-xs text-slate-400">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
