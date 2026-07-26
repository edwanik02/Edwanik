import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const reqs = await prisma.ownerRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ success: true, data: reqs })
}

const submitSchema = z.object({ name: z.string().min(1), shopName: z.string().min(1), email: z.string().email(), phone: z.string().min(10), businessType: z.string().min(1), message: z.string().optional() })

export async function POST(req: NextRequest) {
  try {
    const body = submitSchema.parse(await req.json())
    const existing = await prisma.ownerRequest.findFirst({ where: { email: body.email, status: 'PENDING' } })
    if (existing) return NextResponse.json({ success: false, error: 'A request from this email is already pending' }, { status: 409 })
    const request = await prisma.ownerRequest.create({ data: body })
    return NextResponse.json({ success: true, data: request }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ success: false, error: e.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    return NextResponse.json({ success: false, error: 'Failed to submit request' }, { status: 500 })
  }
}
