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
import { Users, Package, ShoppingBag, DollarSign, Store, ClipboardList } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const token = (await cookies()).get('access_token')?.value
  if (!token) redirect('/admin/login')
  try { verifyAccessToken(token) } catch { redirect('/admin/login') }

  let totalOrders = 0, totalProducts = 0, totalCustomers = 0, totalOwners = 0, pendingReqs = 0, revenue = { _sum: { total: null } }, monthlySales: any[] = [], recentOrders: any[] = [], topOwners: any[] = []

  try {
    const [tOrders, tProducts, tCust, tOwn, pReqs, rev, mSales, rOrders] = await Promise.all([
      prisma.order.count().catch(() => 0),
      prisma.product.count({ where: { deletedAt: null } }).catch(() => 0),
      prisma.user.count({ where: { role: 'CUSTOMER' } }).catch(() => 0),
      prisma.user.count({ where: { role: 'OWNER' } }).catch(() => 0),
      prisma.ownerRequest.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }).catch(() => ({ _sum: { total: null } })),
      getMonthlySales().catch(() => []),
      prisma.order.findMany({
        include: { customer: { include: { user: { select: { name: true } } } }, items: true },
        orderBy: { createdAt: 'desc' }, take: 5,
      }).catch(() => []),
    ])
    totalOrders = tOrders
    totalProducts = tProducts
    totalCustomers = tCust
    totalOwners = tOwn
    pendingReqs = pReqs
    revenue = rev as any
    monthlySales = mSales
    recentOrders = rOrders

    topOwners = await prisma.owner.findMany({
      include: { user: { select: { name: true } }, _count: { select: { products: true } } },
      take: 5,
    }).catch(() => [])
  } catch (err) {
    console.error('Failed to load admin dashboard:', err)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-3" style={{ background: 'linear-gradient(135deg, #1a0533, #2d1460, #1a2a6c)' }}>
        <div>
          <h1 className="font-serif text-2xl font-bold">⚙️ Super Admin Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">Full platform control & analytics</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30 px-3 py-1.5 rounded-full">Super Admin</span>
          <span className="text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full">● System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Shop Owners" value={totalOwners} icon={Store} color="purple" />
        <StatCard title="Customers" value={totalCustomers} icon={Users} color="blue" />
        <StatCard title="Products" value={totalProducts} icon={Package} color="primary" />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} color="green" />
        <StatCard title="Revenue" value={formatCurrency(Number(revenue._sum.total ?? 0))} icon={DollarSign} color="yellow" />
        <div className="bg-white rounded-2xl border-2 border-dashed border-orange-200 p-5 flex flex-col items-center justify-center text-center">
          <ClipboardList className="w-6 h-6 text-brand mb-1" />
          <p className="text-2xl font-bold font-serif text-brand">{pendingReqs}</p>
          <p className="text-xs text-slate-500">Pending Requests</p>
          {pendingReqs > 0 && <Link href="/admin/owners/requests" className="text-xs text-brand font-bold mt-1 hover:underline">Review →</Link>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">📊 Platform Sales (6 months)</h3>
          <SalesChart data={monthlySales} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">🏪 Top Owners</h3>
            <Link href="/admin/owners" className="text-xs font-bold text-brand hover:underline">View All →</Link>
          </div>
          <div className="space-y-3">
            {topOwners.map((o, i) => (
              <div key={o.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 w-5">{i + 1}</span>
                <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{o.user.name[0]}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{o.storeName}</p>
                  <p className="text-xs text-slate-400">{o._count.products} products</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${o.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.isApproved ? 'Active' : 'Pending'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold">📦 Recent Orders (All Stores)</h3>
          <Link href="/admin/orders" className="text-sm font-bold text-brand hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50">
              {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-bold">{o.orderNumber}</td>
                  <td className="py-3 px-4 text-sm">{o.customer.user.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td className="py-3 px-4 text-sm font-bold text-brand">{formatCurrency(Number(o.total))}</td>
                  <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[o.status] ?? ''}`}>{o.status}</span></td>
                  <td className="py-3 px-4 text-xs text-slate-400">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['🏪 Manage Owners', '/admin/owners'], ['📋 Access Requests', '/admin/owners/requests'], ['🧸 All Products', '/admin/products'], ['📂 Categories', '/admin/cms/categories']].map(([label, href]) => (
          <Link key={href} href={href} className="bg-white border border-slate-200 hover:border-brand text-slate-700 hover:text-brand font-bold text-sm py-3 px-4 rounded-xl text-center transition-all">{label}</Link>
        ))}
      </div>
    </div>
  )
}
