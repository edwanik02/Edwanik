import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { getMonthlySales } from '@/services/analytics.service'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || !['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const owner = await prisma.owner.findUnique({ where: { userId: user.id } })
  if (!owner) return NextResponse.json({ success: false, error: 'Owner not found' }, { status: 404 })
  const ownerWhere = { items: { some: { product: { ownerId: owner.id } } } }

  const [totalOrders, totalProducts, revenue, monthlySales, recentOrdersRaw, topProductsRaw] = await Promise.all([
    prisma.order.count({ where: ownerWhere }), prisma.product.count({ where: { ownerId: owner.id, deletedAt: null } }),
    prisma.order.aggregate({ where: { ...ownerWhere, paymentStatus: 'PAID' }, _sum: { total: true } }), getMonthlySales(owner.id),
    prisma.order.findMany({ where: ownerWhere, take: 5, orderBy: { createdAt: 'desc' }, include: { customer: { include: { user: { select: { name: true, email: true } } } }, items: true } }),
    prisma.product.findMany({ where: { ownerId: owner.id, deletedAt: null }, take: 5, include: { images: { where: { isPrimary: true } }, category: true, owner: { select: { id: true, storeName: true, logoUrl: true } }, _count: { select: { reviews: true, orderItems: true } } }, orderBy: { orderItems: { _count: 'desc' } } }),
  ])
  const customerGroups = await prisma.order.groupBy({ by: ['customerId'], where: ownerWhere })

  return NextResponse.json({
    success: true,
    data: {
      totalOrders, totalProducts, totalCustomers: customerGroups.length, totalRevenue: Number(revenue._sum.total ?? 0), monthlySales,
      recentOrders: recentOrdersRaw.map(o => ({ ...o, total: Number(o.total), subtotal: Number(o.subtotal), shippingFee: Number(o.shippingFee), discount: Number(o.discount) })),
      topProducts: topProductsRaw.map(p => ({ ...p, price: Number(p.price), mrpPrice: p.mrpPrice ? Number(p.mrpPrice) : null, reviewCount: p._count.reviews })),
    },
  })
}
