import { PrismaClient } from '@prisma/client'

const DEFAULT_DB_URL = 'postgresql://user:password@localhost:5432/funzitoys'

function getValidDbUrl(url?: string): string {
  if (url && typeof url === 'string' && url.trim().length > 0 && (url.startsWith('postgresql://') || url.startsWith('postgres://'))) {
    return url.trim()
  }
  return DEFAULT_DB_URL
}

process.env.DATABASE_URL = getValidDbUrl(process.env.DATABASE_URL)
process.env.DIRECT_URL = getValidDbUrl(process.env.DIRECT_URL)

const g = globalThis as unknown as { prisma: PrismaClient }
export const prisma = g.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: [],
})
if (process.env.NODE_ENV !== 'production') g.prisma = prisma

