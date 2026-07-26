import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ success: false, error: 'Email not found' }, { status: 404 })
    const otp = await createOTP(email)
    await sendOTPEmail(email, user.name.split(' ')[0], otp).catch(console.error)
    return NextResponse.json({ success: true, data: { message: 'OTP sent' } })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 })
  }
}
