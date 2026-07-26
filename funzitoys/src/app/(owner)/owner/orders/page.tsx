import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/utils'
import { ORDER_STATUS_COLORS } from '@/constants'

export default async function OwnerOrdersPage() {
  const token = (await cookies()).get('access_token')?.value
  if (!token) redirect('/owner/login')
  let user: ReturnType<typeof verifyAccessToken>
  try { user = verifyAccessToken(token) } catch { redirect('/owner/login') }
  const owner = await prisma.owner.findUnique({ where: { userId: user.sub ?? user.id } })
  if (!owner) redirect('/owner/login')

  const orders = await prisma.order.findMany({
    where: { items: { some: { product: { ownerId: owner.id } } } },
    include: { customer: { include: { user: { select: { name: true, email: true } } } }, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-2xl font-bold">📦 Orders</h1><p className="text-sm text-slate-500">{orders.length} total orders</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-slate-400"><div className="text-5xl mb-3">📦</div><p className="font-semibold">No orders yet</p><p className="text-sm mt-1">Orders will appear here when customers place them</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-bold text-slate-700">{o.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold">{o.customer.user.name}</p>
                      <p className="text-xs text-slate-400">{o.customer.user.email}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">{o.items.map(i => `${i.productName} ×${i.quantity}`).join(', ')}</td>
                    <td className="py-3 px-4 text-sm font-bold text-brand">{formatCurrency(Number(o.total))}</td>
                    <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[o.status] ?? 'bg-slate-100 text-slate-600'}`}>{o.status}</span></td>
                    <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${o.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paymentStatus}</span></td>
                    <td className="py-3 px-4 text-xs text-slate-400">{formatDate(o.createdAt)}</td>
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
