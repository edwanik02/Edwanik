import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/dashboard/StatCard'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { getMonthlySales } from '@/services/analytics.service'
import { formatCurrency, formatDate } from '@/utils'
import { ORDER_STATUS_COLORS } from '@/constants'
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Owner Dashboard' }

export default async function OwnerDashboardPage() {
  const token = (await cookies()).get('access_token')?.value
  if (!token) redirect('/owner/login')
  let user: ReturnType<typeof verifyAccessToken>
  try { user = verifyAccessToken(token) } catch { redirect('/owner/login') }

  const owner = await prisma.owner.findUnique({ where: { userId: user.sub ?? user.id }, include: { permissions: true } })
  if (!owner) redirect('/owner/login')

  const ownerWhere = { items: { some: { product: { ownerId: owner.id } } } }

  const [productCount, orderAgg, customerGroups, monthlySales, recentOrders] = await Promise.all([
    prisma.product.count({ where: { ownerId: owner.id, deletedAt: null, isActive: true } }),
    prisma.order.aggregate({ where: { ...ownerWhere, paymentStatus: 'PAID' }, _sum: { total: true }, _count: true }),
    prisma.order.groupBy({ by: ['customerId'], where: ownerWhere }),
    getMonthlySales(owner.id),
    prisma.order.findMany({
      where: ownerWhere,
      include: { customer: { include: { user: { select: { name: true, email: true } } } }, items: { include: { product: { include: { images: { where: { isPrimary: true } } } } } } },
      orderBy: { createdAt: 'desc' }, take: 5,
    }),
  ])

  const topProducts = await prisma.product.findMany({
    where: { ownerId: owner.id, deletedAt: null },
    include: { images: { where: { isPrimary: true } }, _count: { select: { orderItems: true } } },
    orderBy: { orderItems: { _count: 'desc' } }, take: 5,
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold">🏪 Owner Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, <strong>{user.name.split(' ')[0]}</strong>! Here's your store overview.</p>
        </div>
        <span className="text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full">● Store Active</span>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="My Products" value={productCount} delta="+2 this week" icon={Package} color="primary" />
        <StatCard title="Total Orders" value={orderAgg._count} delta="+5 today" icon={ShoppingBag} color="green" />
        <StatCard title="Customers" value={customerGroups.length} icon={Users} color="blue" />
        <StatCard title="Revenue" value={formatCurrency(Number(orderAgg._sum.total ?? 0))} delta="+12%" icon={DollarSign} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-base mb-4">📊 Monthly Sales</h3>
          <SalesChart data={monthlySales} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-base mb-4">🏆 Top Products</h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-400"><div className="text-4xl mb-2">📦</div><p className="text-sm">No products yet</p></div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400 w-5">{i + 1}</span>
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-lg">
                    {p.images[0] ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" /> : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p._count.orderItems} orders</p>
                  </div>
                  <p className="text-sm font-bold text-brand">{formatCurrency(Number(p.price))}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold">📦 Recent Orders</h3>
          <Link href="/owner/orders" className="text-sm font-bold text-brand hover:underline">View All →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-400"><div className="text-4xl mb-2">📦</div><p>No orders yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                <th className="text-left py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wide">Order</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Total</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Date</th>
              </tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-700">{o.orderNumber}</td>
                    <td className="py-3 px-4 text-sm">{o.customer.user.name}</td>
                    <td className="py-3 px-4 text-sm font-bold text-brand">{formatCurrency(Number(o.total))}</td>
                    <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[o.status] ?? 'bg-slate-100 text-slate-600'}`}>{o.status}</span></td>
                    <td className="py-3 px-4 text-xs text-slate-400">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['🧸 Add Product', '/owner/products/new', 'bg-brand text-white'], ['📦 View Orders', '/owner/orders', 'bg-slate-100 text-slate-700'], ['📈 Analytics', '/owner/analytics', 'bg-slate-100 text-slate-700'], ['🖼️ Branding', '/owner/branding', 'bg-slate-100 text-slate-700']].map(([label, href, cls]) => (
          <Link key={href} href={href} className={`${cls} font-bold text-sm py-3 px-4 rounded-xl text-center hover:opacity-90 transition-all`}>{label}</Link>
        ))}
      </div>
    </div>
  )
}
