import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/utils'

export default async function AdminOwnersPage() {
  const owners = await prisma.owner.findMany({
    include: { user: true, permissions: true, _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-serif text-2xl font-bold">🏪 Shop Owners</h1><p className="text-sm text-slate-500">Manage owner accounts</p></div>
        <Link href="/admin/owners/requests" className="inline-flex items-center gap-2 text-sm font-bold border border-slate-200 px-4 py-2 rounded-full hover:border-brand hover:text-brand transition-all">📋 View Requests</Link>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold">Owner Accounts</h3>
          <span className="text-sm text-slate-500">{owners.length} owners · Only Admin can create accounts</span>
        </div>
        {owners.length === 0 ? (
          <div className="text-center py-12 text-slate-400"><div className="text-4xl mb-2">🏪</div><p>No owners yet</p><p className="text-sm mt-1">Approve requests to create owner accounts</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['Owner', 'Email', 'Store', 'Products', 'Status', 'Joined', 'Permissions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {owners.map(o => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{o.user.name[0]}</div>
                        <div><p className="text-sm font-semibold">{o.user.name}</p><p className="text-xs text-slate-400">{o.user.mobile ?? ''}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{o.user.email}</td>
                    <td className="py-3 px-4 text-sm font-medium">{o.storeName}</td>
                    <td className="py-3 px-4 text-sm font-bold">{o._count.products}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${o.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {o.isApproved ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">{formatDate(o.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                        {[o.permissions?.canManageProducts && '📦', o.permissions?.canManageOrders && '🛍️', o.permissions?.canViewAnalytics && '📈'].filter(Boolean).join(' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
