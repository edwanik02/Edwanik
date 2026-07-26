import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductsClient } from './ProductsClient'
import type { Metadata } from 'next'
import type { Category, BadgeType } from '@/types'

export const metadata: Metadata = { title: 'All Products – FunziToys', description: 'Browse 500+ safe, fun & educational toys' }
export const dynamic = 'force-dynamic'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams
  const page = Number(sp.page ?? 1)
  const limit = 20
  const search = sp.search
  const categorySlug = sp.category
  const sortBy = (sp.sortBy as 'price' | 'createdAt' | 'name') ?? 'createdAt'
  const sortOrder = (sp.sortOrder as 'asc' | 'desc') ?? 'desc'

  const where = { isActive: true, isApproved: true, deletedAt: null, ...(search && { name: { contains: search, mode: 'insensitive' as const } }), ...(categorySlug && { category: { slug: categorySlug } }) }

  const [productsRaw, total, cats, settings] = await Promise.all([
    prisma.product.findMany({ where, include: { images: { orderBy: { sortOrder: 'asc' } }, category: true, inventory: true, owner: { select: { id: true, storeName: true, logoUrl: true } }, _count: { select: { reviews: true } } }, orderBy: { [sortBy]: sortOrder }, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.siteSettings.findFirst(),
  ])

  const products = productsRaw.map(p => ({
    ...p, price: Number(p.price), mrpPrice: p.mrpPrice ? Number(p.mrpPrice) : undefined, badge: (p.badge as BadgeType) ?? undefined, reviewCount: p._count.reviews,
    description: p.description ?? undefined, images: p.images.map(img => ({ ...img, alt: img.alt ?? undefined })),
    inventory: p.inventory ? { quantity: p.inventory.quantity, reserved: p.inventory.reserved, lowStockAt: p.inventory.lowStockAt } : undefined,
    owner: { id: p.owner.id, storeName: p.owner.storeName, logoUrl: p.owner.logoUrl ?? undefined },
    category: { ...p.category, imageUrl: p.category.imageUrl ?? undefined, description: p.category.description ?? undefined },
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  }))

  const categories: Category[] = cats.map(c => ({
    ...c,
    imageUrl: c.imageUrl ?? undefined,
    description: c.description ?? undefined,
  }))

  return (
    <>
      <Navbar siteName={settings?.siteName ?? 'FunziToys'} logoUrl={settings?.logoUrl ?? undefined} />
      <main className="pt-16"><ProductsClient initialProducts={products} categories={categories} total={total} page={page} limit={limit} initialSearch={search} initialCategory={categorySlug} /></main>
      <Footer settings={settings ? { id: settings.id, siteName: settings.siteName, primaryColor: settings.primaryColor } : null} />
    </>
  )
}
