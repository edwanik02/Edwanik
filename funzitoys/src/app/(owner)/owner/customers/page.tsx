import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/utils'

export default async function OwnerCustomersPage() {
  const token = (await cookies()).get('access_token')?.value
  if (!token) redirect('/owner/login')
  let user: ReturnType<typeof verifyAccessToken>
  try { user = verifyAccessToken(token) } catch { redirect('/owner/login') }
  const owner = await prisma.owner.findUnique({ where: { userId: user.sub ?? user.id } })
  if (!owner) redirect('/owner/login')

  const orders = await prisma.order.findMany({
    where: { items: { some: { product: { ownerId: owner.id } } } },
    include: { customer: { include: { user: { select: { name: true, email: true, mobile: true, createdAt: true } } } } },
  })

  const custMap = new Map<string, { name: string; email: string; mobile: string | null; joined: Date; orderCount: number; totalSpent: number }>()
  orders.forEach(o => {
    const existing = custMap.get(o.customerId)
    if (existing) { existing.orderCount++; existing.totalSpent += Number(o.total) }
    else { custMap.set(o.customerId, { name: o.customer.user.name, email: o.customer.user.email, mobile: o.customer.user.mobile, joined: o.customer.user.createdAt, orderCount: 1, totalSpent: Number(o.total) }) }
  })
  const customers = Array.from(custMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-2xl font-bold">👥 Customers</h1><p className="text-sm text-slate-500">{customers.length} customers who ordered from your store</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-16 text-slate-400"><div className="text-5xl mb-3">👥</div><p className="font-semibold">No customers yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['Customer', 'Email', 'Mobile', 'Orders', 'Total Spent', 'Joined'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.email} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{c.name[0]}</div>
                        <p className="text-sm font-semibold">{c.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{c.email}</td>
                    <td className="py-3 px-4 text-sm">{c.mobile ?? '—'}</td>
                    <td className="py-3 px-4 text-sm font-bold">{c.orderCount}</td>
                    <td className="py-3 px-4 text-sm font-bold text-brand">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-xs text-slate-400">{formatDate(c.joined)}</td>
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
