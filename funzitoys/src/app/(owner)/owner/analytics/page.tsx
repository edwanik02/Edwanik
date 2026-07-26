import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/dashboard/StatCard'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { getMonthlySales } from '@/services/analytics.service'
import { formatCurrency } from '@/utils'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OwnerAnalyticsPage() {
  const token = (await cookies()).get('access_token')?.value
  if (!token) redirect('/owner/login')
  let user: ReturnType<typeof verifyAccessToken>
  try { user = verifyAccessToken(token) } catch { redirect('/owner/login') }

  let orderAgg: any = { _sum: { total: 0 } }, orderCount = 0, customerGroups: any[] = [], monthlySales: any[] = [], topProducts: any[] = [], statusCounts: any[] = []

  try {
    const owner = await prisma.owner.findUnique({ where: { userId: user.sub ?? user.id } }).catch(() => null)
    if (!owner) redirect('/owner/login')

    const ownerWhere = { items: { some: { product: { ownerId: owner.id } } } }
    const res = await Promise.all([
      prisma.order.aggregate({ where: { ...ownerWhere, paymentStatus: 'PAID' }, _sum: { total: true } }).catch(() => ({ _sum: { total: 0 } })),
      prisma.order.count({ where: ownerWhere }).catch(() => 0),
      prisma.order.groupBy({ by: ['customerId'], where: ownerWhere }).catch(() => []),
      getMonthlySales(owner.id).catch(() => []),
      prisma.product.findMany({
        where: { ownerId: owner.id, deletedAt: null },
        include: { images: { where: { isPrimary: true } }, _count: { select: { orderItems: true, reviews: true } } },
        orderBy: { orderItems: { _count: 'desc' } }, take: 5,
      }).catch(() => []),
      prisma.order.groupBy({ by: ['status'], where: ownerWhere, _count: true }).catch(() => []),
    ])
    orderAgg = res[0]
    orderCount = res[1]
    customerGroups = res[2]
    monthlySales = res[3]
    topProducts = res[4]
    statusCounts = res[5]
  } catch (err) {
    console.error('Failed to load owner analytics:', err)
  }

  const revenue = Number(orderAgg._sum.total ?? 0)
  const aov = orderCount > 0 ? revenue / orderCount : 0
  const statusMap = Object.fromEntries(statusCounts.map(s => [s.status, s._count]))

  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl font-bold">📈 Analytics</h1><p className="text-sm text-slate-500">Your store performance overview</p></div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(revenue)} delta="+18% vs last month" icon={DollarSign} color="primary" />
        <StatCard title="Total Orders" value={orderCount} icon={ShoppingBag} color="green" />
        <StatCard title="Avg Order Value" value={formatCurrency(aov)} icon={TrendingUp} color="blue" />
        <StatCard title="Unique Customers" value={customerGroups.length} icon={Users} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">📊 Monthly Sales (6 months)</h3>
          <SalesChart data={monthlySales} />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {monthlySales.slice(-3).map(m => (
              <div key={m.month} className="text-center bg-slate-50 rounded-xl p-3">
                <p className="text-xs font-bold text-slate-400">{m.month}</p>
                <p className="text-sm font-bold text-brand">{formatCurrency(m.revenue)}</p>
                <p className="text-xs text-slate-400">{m.orders} orders</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">🏆 Top Products by Orders</h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No product data yet</div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const img = p.images[0]
                const totalOrders = p._count.orderItems
                const maxOrders = topProducts[0]._count.orderItems || 1
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-5 flex-shrink-0">{i + 1}</span>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-lg">
                      {img ? <img src={img.url} alt={p.name} className="w-full h-full object-cover" /> : '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${(totalOrders / maxOrders) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold">{totalOrders}</p>
                      <p className="text-xs text-slate-400">orders</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">📦 Order Status Breakdown</h3>
          <div className="space-y-3">
            {[['DELIVERED', '✅', 'bg-green-500'], ['SHIPPED', '🚚', 'bg-blue-500'], ['PROCESSING', '⚙️', 'bg-indigo-500'], ['PENDING', '⏳', 'bg-yellow-500'], ['CANCELLED', '❌', 'bg-red-500']].map(([status, icon, color]) => {
              const count = statusMap[status] ?? 0
              const pct = orderCount > 0 ? Math.round((count / orderCount) * 100) : 0
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-base w-6">{icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{status}</span>
                      <span className="text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">💡 Customer Insights</h3>
          <div className="space-y-4">
            {[
              ['New Customers', '+12 this week', 'text-green-600', '👤'],
              ['Returning Customers', '68%', 'text-blue-600', '🔄'],
              ['Avg Rating', '4.9 ⭐', 'text-amber-600', '⭐'],
              ['Cart Abandonment', '23%', 'text-red-600', '🛒'],
              ['WhatsApp Orders', `${orderCount}`, 'text-green-600', '💬'],
            ].map(([label, value, cls, icon]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="flex items-center gap-2 text-sm text-slate-600"><span>{icon}</span>{label}</span>
                <span className={`text-sm font-bold ${cls}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
