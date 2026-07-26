import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: { include: { user: { select: { name: true, email: true, mobile: true } } } }, items: { include: { product: { include: { images: { where: { isPrimary: true } } } } } }, address: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
  })
  if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: { ...order, total: Number(order.total), subtotal: Number(order.subtotal), shippingFee: Number(order.shippingFee), discount: Number(order.discount) } })
}

const updateSchema = z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']), note: z.string().optional() })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getAuthUser(req)
    if (!user || !['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const { status, note } = updateSchema.parse(await req.json())
    const order = await prisma.order.update({ where: { id }, data: { status, statusHistory: { create: { status, note } } }, include: { items: true } })
    return NextResponse.json({ success: true, data: { ...order, total: Number(order.total) } })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ success: false, error: e.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    console.error('[ORDER UPDATE]', e)
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 })
  }
}
