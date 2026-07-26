import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { formatCurrency, formatDate } from '@/utils'
import { BADGE_COLORS } from '@/constants'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: { images: { where: { isPrimary: true } }, category: true, owner: { include: { user: { select: { name: true } } } }, inventory: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Failed to query admin products:', err)
  }

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-2xl font-bold">🧸 All Products</h1><p className="text-sm text-slate-500">{products.length} products across all stores</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50">{['Product', 'Owner', 'Category', 'Price', 'Stock', 'Status', 'Created'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">{h}</th>)}</tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center text-xl">{p.images[0] ? <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="object-cover" /> : '📦'}</div>
                      <div><p className="text-sm font-semibold">{p.name}</p>{p.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_COLORS[p.badge] ?? ''}`}>{p.badge}</span>}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{p.owner.user.name}</td>
                  <td className="py-3 px-4"><span className="text-xs font-bold bg-orange-50 text-brand px-2 py-1 rounded-full">{p.category.name}</span></td>
                  <td className="py-3 px-4"><p className="text-sm font-bold text-brand">{formatCurrency(Number(p.price))}</p>{p.mrpPrice && <p className="text-xs text-slate-400 line-through">{formatCurrency(Number(p.mrpPrice))}</p>}</td>
                  <td className="py-3 px-4 text-sm font-bold">{p.inventory?.quantity ?? 0}</td>
                  <td className="py-3 px-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="py-3 px-4 text-xs text-slate-400">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
