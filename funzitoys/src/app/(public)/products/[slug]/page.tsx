import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductDetailClient } from './ProductDetailClient'
import type { Metadata } from 'next'
import type { BadgeType } from '@/types'

interface Props { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await prisma.product.findUnique({ where: { slug }, include: { images: { where: { isPrimary: true } } } })
  if (!p) return { title: 'Product Not Found' }
  return { title: `${p.name} – FunziToys`, description: p.description ?? undefined, openGraph: { images: p.images[0]?.url ? [p.images[0].url] : [] } }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [productRaw, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug, isActive: true, deletedAt: null },
      include: { images: { orderBy: { sortOrder: 'asc' } }, category: true, inventory: true, owner: { select: { id: true, storeName: true, logoUrl: true, whatsappNum: true } }, reviews: { include: { customer: { include: { user: { select: { name: true, avatarUrl: true } } } } }, orderBy: { createdAt: 'desc' }, take: 10 }, _count: { select: { reviews: true } } },
    }),
    prisma.siteSettings.findFirst(),
  ])
  if (!productRaw) notFound()

  const relatedRaw = await prisma.product.findMany({
    where: { categoryId: productRaw.categoryId, isActive: true, id: { not: productRaw.id }, deletedAt: null },
    include: { images: { where: { isPrimary: true } }, category: true, inventory: true, owner: { select: { id: true, storeName: true, logoUrl: true } }, _count: { select: { reviews: true } } },
    take: 4,
  })

  const toProduct = (p: typeof productRaw) => ({
    ...p, price: Number(p.price), mrpPrice: p.mrpPrice ? Number(p.mrpPrice) : undefined, badge: (p.badge as BadgeType) ?? undefined, reviewCount: p._count.reviews, description: p.description ?? undefined,
    images: p.images.map(img => ({ ...img, alt: img.alt ?? undefined })), inventory: p.inventory ? { quantity: p.inventory.quantity, reserved: p.inventory.reserved, lowStockAt: p.inventory.lowStockAt } : undefined,
    owner: { id: p.owner.id, storeName: p.owner.storeName, logoUrl: p.owner.logoUrl ?? undefined }, category: { ...p.category, imageUrl: p.category.imageUrl ?? undefined, description: p.category.description ?? undefined },
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  })

  const product = toProduct(productRaw)
  const related = relatedRaw.map(p => ({
    ...p, price: Number(p.price), mrpPrice: p.mrpPrice ? Number(p.mrpPrice) : undefined, badge: (p.badge as BadgeType) ?? undefined, reviewCount: p._count.reviews, description: p.description ?? undefined,
    images: p.images.map(img => ({ ...img, alt: img.alt ?? undefined })), inventory: p.inventory ? { quantity: p.inventory.quantity, reserved: p.inventory.reserved, lowStockAt: p.inventory.lowStockAt } : undefined,
    owner: { id: p.owner.id, storeName: p.owner.storeName, logoUrl: p.owner.logoUrl ?? undefined }, category: { ...p.category, imageUrl: p.category.imageUrl ?? undefined, description: p.category.description ?? undefined },
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <>
      <Navbar siteName={settings?.siteName ?? 'FunziToys'} logoUrl={settings?.logoUrl ?? undefined} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link><span>/</span>
            <Link href="/products" className="hover:text-brand transition-colors">Products</Link><span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand transition-colors">{product.category.name}</Link><span>/</span>
            <span className="text-slate-700 font-medium">{product.name}</span>
          </nav>
          <ProductDetailClient product={product} waNumber={productRaw.owner.whatsappNum ?? settings?.whatsappNum ?? '+919876543210'} />
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-xl font-bold mb-5">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {related.map(p => {
                  const img = p.images.find(i => i.isPrimary)
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-brand hover:shadow-md transition-all">
                      <div className="aspect-square bg-slate-50 overflow-hidden">{img ? <Image src={img.url} alt={p.name} width={200} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">📦</div>}</div>
                      <div className="p-3"><p className="text-xs font-bold text-brand mb-0.5">{p.category.name}</p><p className="text-sm font-bold line-clamp-2">{p.name}</p><p className="text-sm font-bold text-brand mt-1">₹{p.price.toLocaleString('en-IN')}</p></div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer settings={settings ? { id: settings.id, siteName: settings.siteName, primaryColor: settings.primaryColor } : null} />
    </>
  )
}
