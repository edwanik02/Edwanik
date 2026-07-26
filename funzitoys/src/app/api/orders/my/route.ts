import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const customer = await prisma.customer.findUnique({ where: { userId: user.id } })
    if (!customer) return NextResponse.json({ success: true, data: [] })
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: { items: { include: { product: { include: { images: { where: { isPrimary: true } } } } } }, address: true },
      orderBy: { createdAt: 'desc' },
    })
    const mapped = orders.map(o => ({ ...o, total: Number(o.total), subtotal: Number(o.subtotal), shippingFee: Number(o.shippingFee), discount: Number(o.discount), items: o.items.map(i => ({ ...i, price: Number(i.price), total: Number(i.total) })) }))
    return NextResponse.json({ success: true, data: mapped })
  } catch {
    return NextResponse.json({ success: true, data: [] })
  }
}
