import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const cats = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ success: true, data: cats })
}

const schema = z.object({ name: z.string().min(1), emoji: z.string().default('📦'), imageUrl: z.string().optional(), description: z.string().optional() })

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const body = schema.parse(await req.json())
    const slug = body.name.toLowerCase().replace(/\s+/g, '-')
    const cat = await prisma.category.create({ data: { ...body, slug } })
    return NextResponse.json({ success: true, data: cat }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ success: false, error: e.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}
