import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { createOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'

const schema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email'),
  mobile: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 })
    const passwordHash = await hashPassword(data.password)
    await prisma.user.create({
      data: { name: [data.firstName, data.lastName].filter(Boolean).join(' '), email: data.email, mobile: data.mobile, passwordHash, role: 'CUSTOMER', isVerified: false, customer: { create: {} } },
    })
    const otp = await createOTP(data.email)
    await sendOTPEmail(data.email, data.firstName, otp).catch(console.error)
    return NextResponse.json({ success: true, data: { message: 'OTP sent to your email' } }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ success: false, error: e.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    console.error('[REGISTER]', e)
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 })
  }
}
