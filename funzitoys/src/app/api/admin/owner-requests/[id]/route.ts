import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUser, hashPassword } from '@/lib/auth'
import { sendOwnerApprovalEmail, sendOwnerRejectionEmail } from '@/lib/email'

const schema = z.object({ action: z.enum(['approve', 'reject']), password: z.string().min(6).optional(), note: z.string().optional() })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getAuthUser(req)
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const { action, password, note } = schema.parse(await req.json())
    const request = await prisma.ownerRequest.findUnique({ where: { id } })
    if (!request) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    if (request.status !== 'PENDING') return NextResponse.json({ success: false, error: 'Already processed' }, { status: 400 })

    if (action === 'approve') {
      if (!password) return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 })
      const passwordHash = await hashPassword(password)
      const slug = `${request.shopName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      const existingUser = await prisma.user.findUnique({ where: { email: request.email } })
      if (existingUser) {
        await prisma.user.update({ where: { id: existingUser.id }, data: { role: 'OWNER', passwordHash, owner: { create: { storeName: request.shopName, storeSlug: slug, isApproved: true, approvedAt: new Date(), approvedById: user.id, permissions: { create: {} }, storeSettings: { create: {} } } } } })
      } else {
        await prisma.user.create({ data: { name: request.name, email: request.email, mobile: request.phone, passwordHash, role: 'OWNER', isVerified: true, owner: { create: { storeName: request.shopName, storeSlug: slug, isApproved: true, approvedAt: new Date(), approvedById: user.id, permissions: { create: {} }, storeSettings: { create: {} } } } } })
      }
      await sendOwnerApprovalEmail(request.email, request.name, password).catch(console.error)
    } else {
      await sendOwnerRejectionEmail(request.email, request.name).catch(console.error)
    }
    await prisma.ownerRequest.update({ where: { id }, data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED', reviewedById: user.id, reviewNote: note } })
    return NextResponse.json({ success: true, data: { message: `Request ${action}d` } })
  } catch (e) {
    console.error('[REQUEST ACTION]', e)
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}
