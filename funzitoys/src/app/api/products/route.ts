import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { slugify } from '@/utils'

const querySchema = z.object({
  page: z.coerce.number().default(1), limit: z.coerce.number().default(20),
  search: z.string().optional(), categoryId: z.string().optional(), category: z.string().optional(), ownerId: z.string().optional(),
  sortBy: z.enum(['price', 'createdAt', 'name']).default('createdAt'), sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export async function GET(req: NextRequest) {
  try {
    const p = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams))
    const skip = (p.page - 1) * p.limit
    let ownerId = p.ownerId
    if (ownerId === 'me') {
      const user = await getAuthUser(req)
      if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      const owner = await prisma.owner.findUnique({ where: { userId: user.id } })
      ownerId = owner?.id
    }
    const where = {
      isActive: true, isApproved: true, deletedAt: null,
      ...(p.search && { name: { contains: p.search, mode: 'insensitive' as const } }),
      ...(p.categoryId && { categoryId: p.categoryId }),
      ...(p.category && { category: { slug: p.category } }),
      ...(ownerId && { ownerId }),
    }
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { sortOrder: 'asc' } }, category: true, inventory: true, owner: { select: { id: true, storeName: true, logoUrl: true } }, _count: { select: { reviews: true } } },
        orderBy: { [p.sortBy]: p.sortOrder }, skip, take: p.limit,
      }),
      prisma.product.count({ where }),
    ])
    const mapped = products.map(prod => ({ ...prod, price: Number(prod.price), mrpPrice: prod.mrpPrice ? Number(prod.mrpPrice) : null, reviewCount: prod._count.reviews }))
    return NextResponse.json({ success: true, data: mapped, pagination: { page: p.page, limit: p.limit, total, totalPages: Math.ceil(total / p.limit) } })
  } catch (e) {
    console.error('[PRODUCTS GET]', e)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

const createSchema = z.object({
  name: z.string().min(1), description: z.string().optional(), price: z.coerce.number().positive(),
  mrpPrice: z.coerce.number().positive().optional(), categoryId: z.string().min(1),
  badge: z.enum(['NEW', 'SALE', 'HOT', 'LIMITED', 'BESTSELLER']).optional(), stock: z.coerce.number().int().min(0).default(0),
  imageUrls: z.array(z.string()).default([]), imagePublicIds: z.array(z.string()).default([]),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user || !['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const body = createSchema.parse(await req.json())
    const owner = await prisma.owner.findUnique({ where: { userId: user.id } })
    if (!owner && user.role === 'OWNER') return NextResponse.json({ success: false, error: 'Owner not found' }, { status: 404 })
    let slug = slugify(body.name)
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`
    const product = await prisma.product.create({
      data: {
        name: body.name, slug, description: body.description, price: body.price, mrpPrice: body.mrpPrice,
        badge: body.badge, categoryId: body.categoryId, ownerId: owner?.id ?? user.id, isNew: body.badge === 'NEW',
        inventory: { create: { quantity: body.stock } },
        ...(body.imageUrls.length > 0 && { images: { createMany: { data: body.imageUrls.map((url, i) => ({ url, publicId: body.imagePublicIds[i] ?? url, sortOrder: i, isPrimary: i === 0 })) } } }),
      },
      include: { images: true, category: true, inventory: true },
    })
    return NextResponse.json({ success: true, data: { ...product, price: Number(product.price), mrpPrice: product.mrpPrice ? Number(product.mrpPrice) : null } }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ success: false, error: e.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    console.error('[PRODUCT CREATE]', e)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}
