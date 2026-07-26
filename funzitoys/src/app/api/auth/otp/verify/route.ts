import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyOTP } from '@/lib/otp'

const schema = z.object({ email: z.string().email(), code: z.string().length(6) })

export async function POST(req: NextRequest) {
  try {
    const { email, code } = schema.parse(await req.json())
    const valid = await verifyOTP(email, code)
    if (!valid) return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })
    await prisma.user.update({ where: { email }, data: { isVerified: true } })
    return NextResponse.json({ success: true, data: { message: 'Email verified successfully' } })
  } catch {
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}
