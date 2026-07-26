import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding FunziToys database...\n')

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' }, update: {},
    create: { id: 'singleton', siteName: 'FunziToys', tagline: 'Fun For Everyone!', primaryColor: '#FF6B35', whatsappNum: '+91 9876543210', supportEmail: 'hello@funzitoys.com' },
  })
  console.log('✅ Site settings')

  const adminHash = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@funzitoys.com' }, update: {},
    create: { name: 'Super Admin', email: 'admin@funzitoys.com', passwordHash: adminHash, role: 'SUPER_ADMIN', isVerified: true },
  })
  console.log('✅ Super Admin: admin@funzitoys.com / admin123')

  const owner1Hash = await bcrypt.hash('owner123', 12)
  await prisma.user.upsert({
    where: { email: 'ravi@store.com' }, update: {},
    create: {
      name: 'Ravi Kumar', email: 'ravi@store.com', passwordHash: owner1Hash, role: 'OWNER', mobile: '+91 9876543210', isVerified: true,
      owner: { create: { storeName: 'FunziToys Main', storeSlug: 'funzitoys-main', whatsappNum: '+91 9876543210', isApproved: true, approvedAt: new Date(), permissions: { create: { canManageProducts: true, canManageOrders: true, canViewCustomers: true, canManageSettings: true, canUploadImages: true, canViewAnalytics: true } }, storeSettings: { create: { primaryColor: '#FF6B35', tagline: 'Fun For Everyone!' } } } },
    },
  })
  console.log('✅ Owner 1: ravi@store.com / owner123')

  const owner2Hash = await bcrypt.hash('owner456', 12)
  await prisma.user.upsert({
    where: { email: 'priya@store.com' }, update: {},
    create: {
      name: 'Priya Sharma', email: 'priya@store.com', passwordHash: owner2Hash, role: 'OWNER', mobile: '+91 9871234567', isVerified: true,
      owner: { create: { storeName: 'KidZone Store', storeSlug: 'kidzone-store', whatsappNum: '+91 9871234567', isApproved: true, approvedAt: new Date(), permissions: { create: { canManageProducts: true, canManageOrders: true, canViewCustomers: true, canUploadImages: true, canManageOffers: true } }, storeSettings: { create: {} } } },
    },
  })
  console.log('✅ Owner 2: priya@store.com / owner456')

  const custPass = await bcrypt.hash('cust123', 12)
  const custs = [
    { name: 'Arjun Patel', email: 'arjun@example.com', mobile: '+91 9876500001' },
    { name: 'Meena Devi', email: 'meena@example.com', mobile: '+91 9876500002' },
    { name: 'Sam Thomas', email: 'sam@example.com', mobile: '+91 9876500003' },
  ]
  for (const c of custs) {
    await prisma.user.upsert({ where: { email: c.email }, update: {}, create: { ...c, passwordHash: custPass, role: 'CUSTOMER', isVerified: true, customer: { create: {} } } })
  }
  console.log('✅ Demo customers: arjun@example.com / cust123')

  const catData = [
    { name: 'Plushies', slug: 'plushies', emoji: '🧸', sortOrder: 1 },
    { name: 'Vehicles', slug: 'vehicles', emoji: '🚗', sortOrder: 2 },
    { name: 'Games', slug: 'games', emoji: '🎮', sortOrder: 3 },
    { name: 'Creative', slug: 'creative', emoji: '🎨', sortOrder: 4 },
    { name: 'Outdoor', slug: 'outdoor', emoji: '🏃', sortOrder: 5 },
    { name: 'Educational', slug: 'educational', emoji: '📚', sortOrder: 6 },
  ]
  for (const cat of catData) await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat })
  console.log('✅ Categories seeded')

  const cats = await prisma.category.findMany()
  const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]))
  const owner1 = await prisma.owner.findUnique({ where: { storeSlug: 'funzitoys-main' } })
  const owner2 = await prisma.owner.findUnique({ where: { storeSlug: 'kidzone-store' } })

  const productData = [
    { name: 'Teddy Bear Deluxe', slug: 'teddy-bear-deluxe', price: 499, mrpPrice: 699, badge: 'BESTSELLER' as const, catName: 'Plushies', stock: 50, isNew: false, desc: 'Super soft premium teddy bear. Safe for ages 1+. Machine washable & hypoallergenic.', ownerId: owner1!.id },
    { name: 'RC Racing Car', slug: 'rc-racing-car', price: 1299, mrpPrice: 1799, badge: 'SALE' as const, catName: 'Vehicles', stock: 30, isNew: true, desc: 'Remote-controlled racing car with 2.4GHz control. Up to 30km/h. Rechargeable battery.', ownerId: owner1!.id },
    { name: 'Building Blocks 200pc', slug: 'building-blocks-200pc', price: 799, mrpPrice: null, badge: 'NEW' as const, catName: 'Educational', stock: 80, isNew: true, desc: '200-piece colorful building blocks. Develops spatial reasoning and creativity.', ownerId: owner2!.id },
    { name: 'Watercolor Paint Set', slug: 'watercolor-paint-set', price: 349, mrpPrice: 499, badge: 'SALE' as const, catName: 'Creative', stock: 120, isNew: false, desc: '24-color professional watercolor paints with brushes. Non-toxic & safe.', ownerId: owner1!.id },
    { name: 'Outdoor Frisbee Kit', slug: 'outdoor-frisbee-kit', price: 299, mrpPrice: null, badge: null, catName: 'Outdoor', stock: 60, isNew: false, desc: 'Aerodynamic frisbee set. Includes 2 frisbees and a carrying bag.', ownerId: owner2!.id },
    { name: 'Strategy Board Game', slug: 'strategy-board-game', price: 899, mrpPrice: 1199, badge: 'HOT' as const, catName: 'Games', stock: 45, isNew: false, desc: 'Award-winning family strategy game. 2–4 players. Ages 8+. 60–90 min.', ownerId: owner1!.id },
    { name: 'Dino Plush Collection', slug: 'dino-plush-collection', price: 599, mrpPrice: null, badge: 'NEW' as const, catName: 'Plushies', stock: 70, isNew: true, desc: 'Set of 3 dinosaur plushies — T-Rex, Triceratops, Brachiosaurus. Ultra-soft.', ownerId: owner2!.id },
    { name: 'Kids Telescope', slug: 'kids-telescope', price: 1499, mrpPrice: 1999, badge: 'NEW' as const, catName: 'Educational', stock: 20, isNew: true, desc: 'Beginner telescope. Explore stars & moon. Includes star map guide.', ownerId: owner1!.id },
  ]
  for (const p of productData) {
    await prisma.product.upsert({
      where: { slug: p.slug }, update: {},
      create: { name: p.name, slug: p.slug, description: p.desc, price: p.price, mrpPrice: p.mrpPrice ?? undefined, badge: p.badge ?? undefined, categoryId: catMap[p.catName], ownerId: p.ownerId, isNew: p.isNew, inventory: { create: { quantity: p.stock } } },
    })
  }
  console.log('✅ Products seeded (8 products)')

  await prisma.heroBanner.upsert({
    where: { id: 'hero-main' }, update: {},
    create: { id: 'hero-main', title: 'The Happiest Toy Store Online', subtitle: 'Safe, fun & educational toys for every age. Quality you can trust, joy you can feel.', eyebrow: 'New Arrivals 2025', ctaText: 'Shop Now', ctaLink: '/products', isActive: true, sortOrder: 0 },
  })
  console.log('✅ Hero banner')

  const reqs = [
    { name: 'Amit Singh', shopName: 'Toy Kingdom', email: 'amit@toykingdom.com', phone: '+91 9876501010', businessType: 'Toy Retailer', message: 'We run a physical toy store and want to expand online.' },
    { name: 'Sunita Rao', shopName: 'Little Stars Toys', email: 'sunita@littlestars.com', phone: '+91 9876502020', businessType: 'Home Business' },
  ]
  for (const r of reqs) {
    const existing = await prisma.ownerRequest.findFirst({ where: { email: r.email } })
    if (!existing) {
      await prisma.ownerRequest.create({ data: r })
    }
  }
  console.log('✅ Sample owner requests')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n─── Demo Credentials ───────────────────────')
  console.log('Customer:    arjun@example.com   / cust123')
  console.log('Owner:       ravi@store.com      / owner123')
  console.log('Super Admin: admin@funzitoys.com / admin123')
  console.log('────────────────────────────────────────────')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
