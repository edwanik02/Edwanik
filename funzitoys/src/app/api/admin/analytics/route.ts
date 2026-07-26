import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { getMonthlySales } from '@/services/analytics.service'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const [totalOrders, totalProducts, totalCustomers, totalOwners, revenue, monthlySales, recentOrdersRaw, topProductsRaw] = await Promise.all([
    prisma.order.count(), prisma.product.count({ where: { deletedAt: null } }), prisma.user.count({ where: { role: 'CUSTOMER' } }), prisma.user.count({ where: { role: 'OWNER' } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }), getMonthlySales(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: { include: { user: { select: { name: true, email: true } } } }, items: true } }),
    prisma.product.findMany({ take: 5, where: { deletedAt: null }, include: { images: { where: { isPrimary: true } }, category: true, owner: { select: { id: true, storeName: true, logoUrl: true } }, _count: { select: { reviews: true, orderItems: true } } }, orderBy: { orderItems: { _count: 'desc' } } }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      totalOrders, totalProducts, totalCustomers, totalOwners, totalRevenue: Number(revenue._sum.total ?? 0), monthlySales,
      recentOrders: recentOrdersRaw.map(o => ({ ...o, total: Number(o.total), subtotal: Number(o.subtotal), shippingFee: Number(o.shippingFee), discount: Number(o.discount) })),
      topProducts: topProductsRaw.map(p => ({ ...p, price: Number(p.price), mrpPrice: p.mrpPrice ? Number(p.mrpPrice) : null, reviewCount: p._count.reviews })),
    },
  })
}
