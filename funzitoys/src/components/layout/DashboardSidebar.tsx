'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ROUTES } from '@/constants'
import { LucideIcon, BarChart3, Package, ShoppingBag, Users, Tag, Image, Settings, Home, ClipboardList, LayoutDashboard, Bell, Globe, Layers } from 'lucide-react'

interface NavItem { label: string; href: string; icon: LucideIcon; badge?: number }

const ownerNav: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.OWNER.DASHBOARD, icon: LayoutDashboard },
  { label: 'Products', href: ROUTES.OWNER.PRODUCTS, icon: Package },
  { label: 'Orders', href: ROUTES.OWNER.ORDERS, icon: ShoppingBag },
  { label: 'Customers', href: ROUTES.OWNER.CUSTOMERS, icon: Users },
  { label: 'Offers', href: ROUTES.OWNER.OFFERS, icon: Tag },
  { label: 'Analytics', href: ROUTES.OWNER.ANALYTICS, icon: BarChart3 },
  { label: 'Branding', href: ROUTES.OWNER.BRANDING, icon: Image },
  { label: 'Settings', href: ROUTES.OWNER.SETTINGS, icon: Settings },
]
const adminNav: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { label: 'Shop Owners', href: ROUTES.ADMIN.OWNERS, icon: Users },
  { label: 'Access Requests', href: ROUTES.ADMIN.REQUESTS, icon: ClipboardList },
  { label: 'Customers', href: ROUTES.ADMIN.CUSTOMERS, icon: Users },
  { label: 'All Products', href: ROUTES.ADMIN.PRODUCTS, icon: Package },
  { label: 'All Orders', href: ROUTES.ADMIN.ORDERS, icon: ShoppingBag },
  { label: 'Analytics', href: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
]
const adminCMSNav: NavItem[] = [
  { label: 'Site Settings', href: ROUTES.ADMIN.SETTINGS, icon: Settings },
  { label: 'Banners', href: ROUTES.ADMIN.BANNERS, icon: Image },
  { label: 'Categories', href: ROUTES.ADMIN.CATEGORIES, icon: Layers },
  { label: 'Landing Pages', href: ROUTES.ADMIN.LANDING, icon: Globe },
  { label: 'Notifications', href: ROUTES.ADMIN.NOTIFICATIONS, icon: Bell },
]

export function DashboardSidebar({ reqCount = 0 }: { reqCount?: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
  const nav = isAdmin ? adminNav : ownerNav
  const cmsNav = isAdmin ? adminCMSNav : []

  const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); logout(); router.push('/') }

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 h-full z-40">
      <div className="p-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-sm">F</div>
          <div><p className="font-bold text-brand text-sm leading-none">FunziToys</p><p className="text-[10px] text-slate-400 mt-0.5">{isAdmin ? 'Admin Panel' : 'Owner Panel'}</p></div>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {nav.map(item => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const badge = item.href === ROUTES.ADMIN.REQUESTS ? reqCount : item.badge
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-orange-50 text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
              <Icon className="w-4 h-4 flex-shrink-0" /><span className="flex-1">{item.label}</span>
              {badge && badge > 0 ? <span className="bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{badge}</span> : null}
            </Link>
          )
        })}
        {cmsNav.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1">Customize</p>
            {cmsNav.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-orange-50 text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Icon className="w-4 h-4 flex-shrink-0" />{item.label}</Link>
            })}
          </>
        )}
      </nav>
      <div className="p-2 border-t border-slate-200 space-y-0.5">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800"><Home className="w-4 h-4" />View Store</Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 w-full"><span className="text-base">🚪</span>Logout</button>
      </div>
    </aside>
  )
}
