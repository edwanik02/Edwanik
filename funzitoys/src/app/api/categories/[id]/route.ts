import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await prisma.category.update({ where: { id }, data: { isActive: false } })
    return NextResponse.json({ success: true, data: { message: 'Category removed' } })
  } catch (e) {
    console.error('[CATEGORY DELETE]', e)
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}
