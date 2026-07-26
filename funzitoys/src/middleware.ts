import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'

const PUBLIC = ['/', '/products', '/categories', '/about', '/owner-portal']
const AUTH_ONLY = ['/login', '/register', '/verify-otp', '/owner/login', '/admin/login']
const OWNER_PATHS = ['/owner']
const ADMIN_PATHS = ['/admin']
const CUSTOMER_PATHS = ['/cart', '/checkout', '/wishlist', '/orders', '/account']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('access_token')?.value
  const isProtected = [...OWNER_PATHS, ...ADMIN_PATHS, ...CUSTOMER_PATHS].some(p => pathname.startsWith(p))

  if (PUBLIC.some(p => pathname === p || pathname.startsWith(p + '/')) && !isProtected) return NextResponse.next()
  if (pathname.startsWith('/api/auth')) return NextResponse.next()
  if (pathname.startsWith('/api/products') && req.method === 'GET') return NextResponse.next()
  if (pathname.startsWith('/api/categories') && req.method === 'GET') return NextResponse.next()

  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && token) {
    try {
      const user = verifyAccessToken(token)
      const dest = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'OWNER' ? '/owner/dashboard' : '/'
      return NextResponse.redirect(new URL(dest, req.url))
    } catch { /* fall through */ }
  }

  if (!token) {
    if (isProtected) {
      const role = ADMIN_PATHS.some(p => pathname.startsWith(p)) ? 'admin' : OWNER_PATHS.some(p => pathname.startsWith(p)) ? 'owner' : 'customer'
      const loginPath = role === 'admin' ? '/admin/login' : role === 'owner' ? '/owner/login' : '/login'
      const url = new URL(loginPath, req.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  try {
    const user = verifyAccessToken(token)
    if (OWNER_PATHS.some(p => pathname.startsWith(p)) && !['OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(user.role))
      return NextResponse.redirect(new URL('/owner/login?error=unauthorized', req.url))
    if (ADMIN_PATHS.some(p => pathname.startsWith(p)) && !['SUPER_ADMIN', 'ADMIN'].includes(user.role))
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url))
    const headers = new Headers(req.headers)
    headers.set('x-user-id', user.sub ?? user.id)
    headers.set('x-user-role', user.role)
    headers.set('x-user-email', user.email)
    return NextResponse.next({ request: { headers } })
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('access_token')
    res.cookies.delete('refresh_token')
    return res
  }
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'] }
