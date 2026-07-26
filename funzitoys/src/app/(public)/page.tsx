import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { Product, Category, BadgeType } from '@/types'

export const metadata: Metadata = { title: 'FunziToys – Fun For Everyone', description: 'Safe, fun & educational toys for every age. Shop 500+ premium toys trusted by 10,000+ families.' }
export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const [settings, cats, featuredRaw, newRaw, banner] = await Promise.all([
      prisma.siteSettings.findFirst().catch(() => null),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }).catch(() => []),
      prisma.product.findMany({ where: { isActive: true, isApproved: true, deletedAt: null }, include: { images: { orderBy: { sortOrder: 'asc' } }, category: true, inventory: true, owner: { select: { id: true, storeName: true, logoUrl: true } }, _count: { select: { reviews: true } } }, orderBy: { createdAt: 'desc' }, take: 8 }).catch(() => []),
      prisma.product.findMany({ where: { isActive: true, isApproved: true, deletedAt: null, isNew: true }, include: { images: { orderBy: { sortOrder: 'asc' } }, category: true, inventory: true, owner: { select: { id: true, storeName: true, logoUrl: true } }, _count: { select: { reviews: true } } }, orderBy: { createdAt: 'desc' }, take: 4 }).catch(() => []),
      prisma.heroBanner.findFirst({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }).catch(() => null),
    ])
    const toProduct = (p: any): Product => ({
      ...p, price: Number(p.price), mrpPrice: p.mrpPrice ? Number(p.mrpPrice) : undefined, badge: (p.badge as BadgeType) ?? undefined, reviewCount: p._count?.reviews ?? 0,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(), updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(), images: (p.images ?? []).map((img: any) => ({ ...img, alt: img.alt ?? undefined })),
      description: p.description ?? undefined, inventory: p.inventory ? { quantity: p.inventory.quantity, reserved: p.inventory.reserved, lowStockAt: p.inventory.lowStockAt } : undefined,
      owner: { id: p.owner?.id, storeName: p.owner?.storeName, logoUrl: p.owner?.logoUrl ?? undefined },
      category: { ...p.category, imageUrl: p.category?.imageUrl ?? undefined, description: p.category?.description ?? undefined },
    })
    const categories: Category[] = cats.map((c: any) => ({
      ...c,
      imageUrl: c.imageUrl ?? undefined,
      description: c.description ?? undefined,
    }))
    return { settings, cats: categories, featured: featuredRaw.map(toProduct), newArrivals: newRaw.map(toProduct), banner }
  } catch (err) {
    console.error('Failed to fetch home page data:', err)
    return { settings: null, cats: [], featured: [], newArrivals: [], banner: null }
  }
}

function ProductSkeleton() { return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{Array(8).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-slate-100 animate-pulse aspect-[4/5]" />)}</div> }

export default async function HomePage() {
  const { settings, cats, featured, newArrivals, banner } = await getData()
  const bannerTitle = banner?.title ?? 'The Happiest Toy Store Online'
  const titleParts = bannerTitle.split(' ')
  const p1 = titleParts.slice(0, 2).join(' ')
  const p2 = titleParts.slice(2, 3).join(' ')
  const p3 = titleParts.slice(3).join(' ')

  return (
    <>
      <Navbar siteName={settings?.siteName ?? 'FunziToys'} logoUrl={settings?.logoUrl ?? undefined} />
      <main className="pt-16">
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-[#162032] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 40%, #FF6B35, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-1/3 h-2/3 opacity-5" style={{ background: 'radial-gradient(ellipse at 20% 80%, #3B82F6, transparent 70%)' }} />
          </div>
          <div className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-between gap-10 flex-wrap relative z-10">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1.5 mb-5">
                <span className="text-sm">✨</span><span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">{banner?.eyebrow ?? 'New Arrivals 2025'}</span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight mb-4">
                {p1}{' '}{p2 && <em className="text-brand not-italic">{p2}</em>}{' '}{p3}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">{banner?.subtitle ?? 'Safe, fun & educational toys for every age. Quality you can trust, joy you can feel.'}</p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/products" className="px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-[var(--pd)] transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/30">Shop Now →</Link>
                <Link href="/about" className="px-8 py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">About Us</Link>
              </div>
              <div className="flex gap-8 mt-10">{[['10K+', 'Happy Families'], ['500+', 'Products'], ['4.9★', 'Avg Rating']].map(([val, lbl]) => <div key={lbl}><p className="font-serif text-2xl font-bold text-white">{val}</p><p className="text-xs text-slate-400 mt-0.5">{lbl}</p></div>)}</div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3 max-w-[240px]">
              {[['🧸', 'Plushies'], ['🚗', 'Vehicles'], ['🎮', 'Games'], ['🎨', 'Creative']].map(([emoji, label]) => (
                <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="text-4xl mb-2">{emoji}</div><p className="text-xs text-white/70 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            <Link href="/products" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white font-bold text-sm hover:bg-[var(--pd)] transition-all">All</Link>
            {cats.map((c: Category) => (
              <Link key={c.id} href={`/products?category=${c.slug}`} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 font-bold text-sm text-slate-700 hover:border-brand hover:text-brand hover:bg-orange-50 transition-all">
                {c.imageUrl ? <Image src={c.imageUrl} alt={c.name} width={22} height={22} className="rounded-full object-cover" /> : <span>{c.emoji}</span>}{c.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="pb-12 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6"><h2 className="font-serif text-2xl font-bold">🔥 Featured Products</h2><Link href="/products" className="text-sm font-bold text-brand hover:underline">View All →</Link></div>
          <Suspense fallback={<ProductSkeleton />}><ProductGrid products={featured} /></Suspense>
        </section>

        <section className="px-6 max-w-7xl mx-auto pb-12">
          <div className="bg-gradient-to-r from-brand to-[var(--pl)] rounded-3xl p-8 flex items-center justify-between flex-wrap gap-4">
            <div><p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Limited Time Offer</p><h2 className="font-serif text-3xl font-bold text-white mb-1">Up to <span className="text-yellow-300">40% OFF</span> This Week!</h2><p className="text-white/80 text-sm">On selected toys across all categories. Don't miss out!</p></div>
            <Link href="/products" className="flex-shrink-0 px-7 py-3.5 bg-white text-brand font-bold rounded-full hover:shadow-lg transition-all">Shop the Sale →</Link>
          </div>
        </section>

        {newArrivals.length > 0 && (
          <section className="pb-12 px-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6"><h2 className="font-serif text-2xl font-bold">✨ New Arrivals</h2><Link href="/products?sortBy=createdAt" className="text-sm font-bold text-brand hover:underline">View All →</Link></div>
            <ProductGrid products={newArrivals} />
          </section>
        )}

        <section className="bg-slate-100 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10"><p className="text-xs font-bold text-brand uppercase tracking-widest mb-2">Why FunziToys?</p><h2 className="font-serif text-3xl font-bold">Built Around Your Child's Joy</h2></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[['🛡️', 'Safety Certified', 'All toys meet strict international safety standards'], ['💰', 'Best Prices', 'Direct from manufacturers — no middleman markup'], ['🚀', 'Fast Delivery', 'Quick dispatch & reliable nationwide delivery'], ['💬', 'WhatsApp Support', 'Personal help with every order via WhatsApp']].map(([ico, title, desc]) => (
                <div key={title} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand hover:shadow-md transition-all"><div className="text-3xl mb-3">{ico}</div><h3 className="font-bold text-sm mb-1">{title}</h3><p className="text-xs text-slate-500 leading-relaxed">{desc}</p></div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings ? { id: settings.id, siteName: settings.siteName, tagline: settings.tagline ?? undefined, logoUrl: settings.logoUrl ?? undefined, primaryColor: settings.primaryColor, whatsappNum: settings.whatsappNum ?? undefined, supportEmail: settings.supportEmail ?? undefined } : null} />
    </>
  )
}
