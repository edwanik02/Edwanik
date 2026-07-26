import { prisma } from '@/lib/prisma'
import type { MonthlyStat } from '@/types'

export async function getMonthlySales(ownerId?: string): Promise<MonthlyStat[]> {
  const results: MonthlyStat[] = []
  try {
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
      const where = { createdAt: { gte: start, lte: end }, ...(ownerId ? { items: { some: { product: { ownerId } } } } : {}) }
      const [count, agg] = await Promise.all([
        prisma.order.count({ where }).catch(() => 0),
        prisma.order.aggregate({ where: { ...where, paymentStatus: 'PAID' }, _sum: { total: true } }).catch(() => ({ _sum: { total: 0 } })),
      ])
      results.push({ month: start.toLocaleString('default', { month: 'short' }), revenue: Number(agg._sum?.total ?? 0), orders: count })
    }
  } catch {
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      results.push({ month: start.toLocaleString('default', { month: 'short' }), revenue: 0, orders: 0 })
    }
  }
  return results
}
