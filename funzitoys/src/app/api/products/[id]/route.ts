import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

async function findProduct(idOrSlug: string) {
  return prisma.product.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], deletedAt: null },
    include: { images: { orderBy: { sortOrder: 'asc' } }, category: true, inventory: true, owner: { select: { id: true, storeName: true, logoUrl: true, userId: true } }, _count: { select: { reviews: true } } },
  })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await findProduct(id)
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: { ...product, price: Number(product.price), mrpPrice: product.mrpPrice ? Number(product.mrpPrice) : null, reviewCount: product._count.reviews } })
  } catch (e) {
    console.error('[PRODUCT GET]', e)
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 })
  }
}

const updateSchema = z.object({
  name: z.string().min(1).optional(), description: z.string().optional(), price: z.coerce.number().positive().optional(),
  mrpPrice: z.coerce.number().positive().nullable().optional(), categoryId: z.string().optional(),
  badge: z.enum(['NEW', 'SALE', 'HOT', 'LIMITED', 'BESTSELLER']).nullable().optional(), stock: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(), imageUrls: z.array(z.string()).optional(), imagePublicIds: z.array(z.string()).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getAuthUser(req)
    if (!user || !['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const existing = await findProduct(id)
    if (!existing) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    if (user.role === 'OWNER' && existing.owner.userId !== user.id) return NextResponse.json({ success: false, error: 'You do not own this product' }, { status: 403 })
    const body = updateSchema.parse(await req.json())
    const { stock, imageUrls, imagePublicIds, ...productFields } = body
    const product = await prisma.product.update({
      where: { id: existing.id },
      data: {
        ...productFields,
        ...(stock !== undefined && { inventory: { upsert: { create: { quantity: stock }, update: { quantity: stock } } } }),
        ...(imageUrls && { images: { deleteMany: {}, createMany: { data: imageUrls.map((url, i) => ({ url, publicId: imagePublicIds?.[i] ?? url, sortOrder: i, isPrimary: i === 0 })) } } }),
      },
      include: { images: true, category: true, inventory: true },
    })
    return NextResponse.json({ success: true, data: { ...product, price: Number(product.price), mrpPrice: product.mrpPrice ? Number(product.mrpPrice) : null } })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ success: false, error: e.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    console.error('[PRODUCT UPDATE]', e)
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getAuthUser(req)
    if (!user || !['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const existing = await findProduct(id)
    if (!existing) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    if (user.role === 'OWNER' && existing.owner.userId !== user.id) return NextResponse.json({ success: false, error: 'You do not own this product' }, { status: 403 })
    await prisma.product.update({ where: { id: existing.id }, data: { deletedAt: new Date(), isActive: false } })
    return NextResponse.json({ success: true, data: { message: 'Product deleted' } })
  } catch (e) {
    console.error('[PRODUCT DELETE]', e)
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}
