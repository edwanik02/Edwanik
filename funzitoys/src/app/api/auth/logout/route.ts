import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  if (token) await prisma.session.deleteMany({ where: { token } }).catch(() => {})
  const res = NextResponse.json({ success: true })
  res.cookies.delete('access_token')
  res.cookies.delete('refresh_token')
  return res
}
