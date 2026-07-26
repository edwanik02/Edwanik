import jwt from 'jsonwebtoken'
import type { AuthUser } from '@/types'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-key-1234567890'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-1234567890'

export const signAccessToken = (user: AuthUser) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name }, ACCESS_SECRET, { expiresIn: '15m' })
export const signRefreshToken = (userId: string) => jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: '7d' })
export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_SECRET) as AuthUser & { sub: string; iat: number; exp: number }
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET) as { sub: string }
