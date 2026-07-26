# 🧸 FunziToys — Production-Ready Multi-Role eCommerce Platform

> Built with Next.js 15 · TypeScript · Prisma · PostgreSQL · Tailwind CSS · Zustand · Cloudinary

## 🚀 Quick Start

```bash
git clone https://github.com/your-org/funzitoys
cd funzitoys
npm install

cp .env.example .env.local
# Fill in: DATABASE_URL, JWT secrets, Cloudinary, SMTP

npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

npm run dev
# → http://localhost:3000
```

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Customer | arjun@example.com | cust123 |
| Owner | ravi@store.com | owner123 |
| Super Admin | admin@funzitoys.com | admin123 |

> Admin login: `/admin/login` (not publicly linked)

## 🏗️ Architecture

```
funzitoys/
├── src/
│   ├── app/
│   │   ├── (public)/          # Customer-facing store
│   │   ├── (auth)/            # Login / Register / OTP
│   │   ├── (customer)/        # Cart, Wishlist, Account
│   │   ├── (owner)/           # Owner dashboard
│   │   ├── (admin)/           # Super Admin panel
│   │   └── api/               # REST API routes
│   ├── components/            # Reusable UI components
│   ├── features/              # Zustand stores + hooks
│   ├── lib/                   # Prisma, JWT, Auth, Email
│   ├── services/              # Analytics service
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Helpers + formatters
│   └── constants/             # Routes, permissions
├── prisma/
│   ├── schema.prisma          # Full DB schema (25 models)
│   └── seed.ts                # Demo data seeder
└── tests/                     # Unit + E2E tests
```

## 🔐 Role System

| Role | Access | Login |
|------|--------|-------|
| Customer | Store, Cart, Wishlist, Orders | `/login` |
| Owner | Products, Orders, Analytics, Branding | `/owner/login` |
| Super Admin | Full platform + CMS + Owner management | `/admin/login` |

Owner accounts are created only by Admin — no public owner registration.

## ✨ Features

### Customer
- Browse products with search, filter, pagination
- Cart with quantity management
- Wishlist (persisted)
- WhatsApp checkout
- Email OTP verification on registration
- Profile with avatar upload
- Notifications

### Owner Dashboard
- Analytics with monthly sales chart
- Product CRUD with real image upload
- Order management
- Customer list
- Offers/promotions creator
- Branding (logo + banner upload)
- Theme color picker
- WhatsApp settings

### Super Admin
- Create/manage owner accounts
- Owner access request system (approve/reject)
- All customers, products, orders across platform
- Full platform analytics
- Site settings, banners, categories, landing page editor

## 🛠️ Tech Stack

Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, TanStack Query v5, PostgreSQL (Neon), Prisma v6, JWT + bcrypt, Nodemailer, Cloudinary, Upstash Redis, Vercel/Docker, Jest + Playwright.

## 🚀 Deployment

### Vercel
```bash
vercel --prod
npx prisma migrate deploy
```

### Docker
```bash
docker-compose up -d
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

## 🧪 Testing
```bash
npm test
npm run test:e2e
```

## 📦 Useful Commands
```bash
npm run db:studio
npm run db:seed
npm run db:reset
npm run type-check
```

---

© 2026 EDWANIKSTUDIO. All Rights Reserved. | Powered by FunziToys
