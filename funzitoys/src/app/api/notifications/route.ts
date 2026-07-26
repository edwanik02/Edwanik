import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const notifs = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 50 })
  return NextResponse.json({ success: true, data: notifs })
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { ids } = await req.json().catch(() => ({ ids: null }))
  if (ids) await prisma.notification.updateMany({ where: { id: { in: ids }, userId: user.id }, data: { isRead: true } })
  else await prisma.notification.updateMany({ where: { userId: user.id, isRead: false }, data: { isRead: true } })
  return NextResponse.json({ success: true })
}
