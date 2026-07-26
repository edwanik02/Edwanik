import { randomInt } from 'crypto'
import { prisma } from './prisma'

const OTP_EXPIRY_MIN = 10
export const generateOTP = () => randomInt(100000, 999999).toString()

export async function createOTP(email: string): Promise<string> {
  const code = generateOTP()
  await prisma.oTPVerification.updateMany({ where: { email, used: false }, data: { used: true } })
  await prisma.oTPVerification.create({ data: { email, code, expiresAt: new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000) } })
  return code
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const otp = await prisma.oTPVerification.findFirst({ where: { email, code, used: false, expiresAt: { gt: new Date() } } })
  if (!otp) return false
  await prisma.oTPVerification.update({ where: { id: otp.id }, data: { used: true } })
  return true
}
