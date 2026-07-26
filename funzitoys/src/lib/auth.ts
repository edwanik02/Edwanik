import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { verifyAccessToken } from './jwt'
import type { AuthUser } from '@/types'

export const hashPassword = (p: string) => bcrypt.hash(p, 12)
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h)

export async function getAuthUser(req?: NextRequest): Promise<AuthUser | null> {
  try {
    let token: string | undefined
    if (req) {
      token = req.cookies.get('access_token')?.value ?? req.headers.get('authorization')?.replace('Bearer ', '')
    } else {
      const c = await cookies()
      token = c.get('access_token')?.value
    }
    if (!token) return null
    const payload = verifyAccessToken(token)
    return { id: payload.sub, email: payload.email, name: payload.name, role: payload.role, isVerified: true }
  } catch { return null }
}
