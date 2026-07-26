import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import type { Role, AuthUser } from '@/types'

const schema = z.object({ email: z.string().email(), password: z.string().min(1), role: z.enum(['CUSTOMER', 'OWNER', 'SUPER_ADMIN', 'ADMIN']).optional() })

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = schema.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email, isActive: true, deletedAt: null }, include: { owner: true } })
    if (!user || !(await comparePassword(password, user.passwordHash)))
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    if (role && !['SUPER_ADMIN', 'ADMIN'].includes(user.role) && user.role !== role)
      return NextResponse.json({ success: false, error: 'Access denied for this role' }, { status: 403 })
    if (!user.isVerified && user.role === 'CUSTOMER')
      return NextResponse.json({ success: false, error: 'Please verify your email first' }, { status: 403 })
    if (user.owner && !user.owner.isApproved && user.role === 'OWNER')
      return NextResponse.json({ success: false, error: 'Account pending admin approval' }, { status: 403 })

    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, role: user.role as Role, avatarUrl: user.avatarUrl ?? undefined, isVerified: user.isVerified }
    const accessToken = signAccessToken(authUser)
    const refreshToken = signRefreshToken(user.id)
    await prisma.session.create({ data: { userId: user.id, token: accessToken, refreshToken, expiresAt: new Date(Date.now() + 7 * 86400000), ipAddress: req.headers.get('x-forwarded-for') ?? undefined } })

    const res = NextResponse.json({ success: true, data: { user: authUser, accessToken } })
    const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' }
    res.cookies.set('access_token', accessToken, { ...cookieOpts, maxAge: 900 })
    res.cookies.set('refresh_token', refreshToken, { ...cookieOpts, maxAge: 604800 })
    return res
  } catch (e) {
    if (e instanceof Error && e.name === 'ZodError') return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
    console.error('[LOGIN]', e)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}
