import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/dashboard/StatCard'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { getMonthlySales } from '@/services/analytics.service'
import { formatCurrency, formatDate } from '@/utils'
import { DollarSign, ShoppingBag, Users, Store } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  let totalOrders = 0, totalCustomers = 0, totalOwners = 0, totalProducts = 0, revenue: any = { _sum: { total: 0 } }, monthlySales: any[] = [], topOwners: any[] = [], recentOrders: any[] = []
  try {
    const res = await Promise.all([
      prisma.order.count().catch(() => 0),
      prisma.user.count({ where: { role: 'CUSTOMER' } }).catch(() => 0),
      prisma.user.count({ where: { role: 'OWNER' } }).catch(() => 0),
      prisma.product.count({ where: { deletedAt: null } }).catch(() => 0),
      prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }).catch(() => ({ _sum: { total: 0 } })),
      getMonthlySales().catch(() => []),
      prisma.owner.findMany({ include: { user: { select: { name: true } }, _count: { select: { products: true } } }, take: 5 }).catch(() => []),
      prisma.order.findMany({ include: { customer: { include: { user: { select: { name: true } } } }, items: true }, orderBy: { createdAt: 'desc' }, take: 5 }).catch(() => []),
    ])
    totalOrders = res[0]
    totalCustomers = res[1]
    totalOwners = res[2]
    totalProducts = res[3]
    revenue = res[4]
    monthlySales = res[5]
    topOwners = res[6]
    recentOrders = res[7]
  } catch (err) {
    console.error('Failed to query admin analytics:', err)
  }
  const rev = Number(revenue._sum?.total ?? 0)

  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl font-bold">📈 Platform Analytics</h1><p className="text-sm text-slate-500">Full platform performance overview</p></div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Platform Revenue" value={formatCurrency(rev)} delta="+22% this month" icon={DollarSign} color="primary" />
        <StatCard title="Total Orders" value={totalOrders} delta="+15 today" icon={ShoppingBag} color="green" />
        <StatCard title="Total Customers" value={totalCustomers} delta="+8 this week" icon={Users} color="blue" />
        <StatCard title="Active Owners" value={totalOwners} icon={Store} color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">📊 Platform Sales (6 months)</h3>
          <SalesChart data={monthlySales} />
          <div className="mt-4 grid grid-cols-3 gap-3">{monthlySales.slice(-3).map(m => <div key={m.month} className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-xs font-bold text-slate-400">{m.month}</p><p className="text-sm font-bold text-brand">{formatCurrency(m.revenue)}</p><p className="text-xs text-slate-400">{m.orders} orders</p></div>)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">🏪 Top Performing Owners</h3>
          <div className="space-y-3">
            {topOwners.map((o, i) => (
              <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-slate-400 w-5">{i + 1}</span>
                <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{o.user.name[0]}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{o.storeName}</p><p className="text-xs text-slate-400">{o._count.products} products</p></div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${o.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.isApproved ? 'Active' : 'Pending'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-100"><h3 className="font-bold">Recent Orders (All Stores)</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50">{['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>)}</tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-bold">{o.orderNumber}</td>
                  <td className="py-3 px-4 text-sm">{o.customer.user.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td className="py-3 px-4 text-sm font-bold text-brand">{formatCurrency(Number(o.total))}</td>
                  <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span></td>
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
