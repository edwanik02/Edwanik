'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { Role } from '@/types'

interface Props { children: React.ReactNode; allowedRoles?: Role[]; redirectTo?: string }

export function AuthGuard({ children, allowedRoles, redirectTo = '/login' }: Props) {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    if (!isLoading && !user) { router.push(redirectTo); return }
    if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) router.push('/')
  }, [user, isLoading, allowedRoles, redirectTo, router])
  if (isLoading || !user) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" /></div>
  if (allowedRoles && !allowedRoles.includes(user.role)) return null
  return <>{children}</>
}
