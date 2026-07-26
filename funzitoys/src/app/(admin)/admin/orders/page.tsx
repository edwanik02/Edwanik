import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/utils'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  let orders: any[] = []
  try {
    orders = await prisma.order.findMany({
      include: { customer: { include: { user: { select: { name: true, email: true } } } }, items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Failed to query admin orders:', err)
  }
  const statusColors: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700', PROCESSING: 'bg-indigo-100 text-indigo-700', SHIPPED: 'bg-cyan-100 text-cyan-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700', REFUNDED: 'bg-gray-100 text-gray-700' }

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-2xl font-bold">📦 All Orders</h1><p className="text-sm text-slate-500">{orders.length} total orders across all stores</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50">{['Order ID', 'Customer', 'Items', 'Total', 'Order Status', 'Payment', 'Date'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>)}</tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-bold">{o.orderNumber}</td>
                  <td className="py-3 px-4"><p className="text-sm font-semibold">{o.customer.user.name}</p><p className="text-xs text-slate-400">{o.customer.user.email}</p></td>
                  <td className="py-3 px-4 text-sm text-slate-500">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td className="py-3 px-4 text-sm font-bold text-brand">{formatCurrency(Number(o.total))}</td>
                  <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[o.status] ?? 'bg-slate-100 text-slate-600'}`}>{o.status}</span></td>
                  <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${o.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paymentStatus}</span></td>
                  <td className="py-3 px-4 text-xs text-slate-400">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
