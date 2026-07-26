'use client'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import type { AuthUser } from '@/types'

export function useAuth() {
  const router = useRouter()
  const { user, setUser, setLoading, isLoading, logout } = useAuthStore()

  const login = useCallback(async (email: string, password: string, role?: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, role }) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Login failed')
      setUser(data.data.user as AuthUser)
      return data.data.user as AuthUser
    } finally { setLoading(false) }
  }, [setUser, setLoading])

  const register = useCallback(async (payload: { firstName: string; lastName?: string; email: string; mobile?: string; password: string }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Registration failed')
      return true
    } finally { setLoading(false) }
  }, [setLoading])

  const verifyOTP = useCallback(async (email: string, code: string) => {
    const res = await fetch('/api/auth/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) })
    const data = await res.json()
    if (!data.success) throw new Error(data.error ?? 'Verification failed')
    return true
  }, [])

  const resendOTP = useCallback(async (email: string) => {
    const res = await fetch('/api/auth/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const data = await res.json()
    if (!data.success) throw new Error(data.error)
  }, [])

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    logout()
    router.push('/')
  }, [logout, router])

  return {
    user, isLoading,
    isCustomer: user?.role === 'CUSTOMER', isOwner: user?.role === 'OWNER',
    isAdmin: user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN', isSuperAdmin: user?.role === 'SUPER_ADMIN',
    login, register, verifyOTP, resendOTP, signOut,
  }
}
