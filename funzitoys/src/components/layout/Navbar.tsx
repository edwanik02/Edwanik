'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Bell, Search, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import { useNotifStore } from '@/features/notifications/store/notifStore'
import { ROUTES } from '@/constants'

interface Props { siteName?: string; logoUrl?: string }

export function Navbar({ siteName = 'FunziToys', logoUrl }: Props) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const itemCount = useCartStore(s => s.itemCount())
  const wishCount = useWishlistStore(s => s.items.length)
  const unread = useNotifStore(s => s.unreadCount)
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (search.trim()) router.push(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(search.trim())}`) }
  const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); logout(); router.push('/'); setUserOpen(false) }
  const dashboardRoute = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? ROUTES.ADMIN.DASHBOARD : user?.role === 'OWNER' ? ROUTES.OWNER.DASHBOARD : ROUTES.ACCOUNT

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-slate-200`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brand overflow-hidden flex items-center justify-center">
            {logoUrl ? <Image src={logoUrl} alt={siteName} width={36} height={36} className="object-cover" /> : <span className="text-xl">🧸</span>}
          </div>
          <span className="font-serif font-bold text-xl text-brand hidden sm:block">{siteName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[['Home', ROUTES.HOME], ['Products', ROUTES.PRODUCTS], ['Categories', ROUTES.CATEGORIES], ['About', ROUTES.ABOUT]].map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-brand hover:bg-orange-50 transition-all">{label}</Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 flex-1 max-w-xs focus-within:border-brand focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search toys…" className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400" />
        </form>

        <div className="flex items-center gap-1">
          {user?.role === 'CUSTOMER' && (
            <>
              <Link href={ROUTES.WISHLIST} className="relative w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:border-brand hover:bg-orange-50 transition-all">
                <Heart className="w-4 h-4 text-slate-600" />
                {wishCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>}
              </Link>
              <Link href={ROUTES.CART} className="relative w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:border-brand hover:bg-orange-50 transition-all">
                <ShoppingCart className="w-4 h-4 text-slate-600" />
                {itemCount > 0 && <span data-testid="cart-count" className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>}
              </Link>
            </>
          )}
          {user && (
            <button className="relative w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:border-brand hover:bg-orange-50 transition-all">
              <Bell className="w-4 h-4 text-slate-600" />
              {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
            </button>
          )}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserOpen(o => !o)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:border-brand transition-all">
                <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold">
                  {user.avatarUrl ? <Image src={user.avatarUrl} alt={user.name} width={28} height={28} className="rounded-full object-cover" /> : user.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-700 max-w-[80px] truncate hidden sm:block">{user.name.split(' ')[0]}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link href={dashboardRoute} onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"><LayoutDashboard className="w-4 h-4" />Dashboard</Link>
                  {user.role === 'CUSTOMER' && <Link href={ROUTES.ACCOUNT} onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"><User className="w-4 h-4" />My Account</Link>}
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"><LogOut className="w-4 h-4" />Logout</button>
                </div>
              )}
            </div>
          ) : <Link href={ROUTES.LOGIN} className="text-sm font-bold text-white bg-brand px-4 py-2 rounded-full hover:bg-[var(--pd)] transition-colors">Login</Link>}
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center">{menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-2 mb-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search toys…" className="bg-transparent text-sm outline-none w-full" />
          </form>
          {[['Home', ROUTES.HOME], ['Products', ROUTES.PRODUCTS], ['Categories', ROUTES.CATEGORIES], ['About', ROUTES.ABOUT]].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-brand">{label}</Link>
          ))}
        </div>
      )}
    </header>
  )
}
