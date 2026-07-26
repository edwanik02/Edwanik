import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || !['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const searchParams = req.nextUrl.searchParams
  const status = searchParams.get('status') ?? undefined
  let ownerIdFilter = searchParams.get('ownerId') ?? undefined

  if (user.role === 'OWNER') {
    const owner = await prisma.owner.findUnique({ where: { userId: user.id } })
    if (!owner) return NextResponse.json({ success: false, error: 'Owner not found' }, { status: 404 })
    ownerIdFilter = owner.id
  }

  const where = { ...(status && { status: status as never }), ...(ownerIdFilter && { items: { some: { product: { ownerId: ownerIdFilter } } } }) }

  const orders = await prisma.order.findMany({
    where,
    include: { customer: { include: { user: { select: { name: true, email: true, mobile: true } } } }, items: { include: { product: { include: { images: { where: { isPrimary: true } } } } } }, address: true },
    orderBy: { createdAt: 'desc' },
  })

  const mapped = orders.map(o => ({ ...o, total: Number(o.total), subtotal: Number(o.subtotal), shippingFee: Number(o.shippingFee), discount: Number(o.discount), items: o.items.map(i => ({ ...i, price: Number(i.price), total: Number(i.total) })) }))
  return NextResponse.json({ success: true, data: mapped, pagination: { page: 1, limit: mapped.length, total: mapped.length, totalPages: 1 } })
}
