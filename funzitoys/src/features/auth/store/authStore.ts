import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types'

interface AuthState { user: AuthUser | null; isLoading: boolean; setUser: (user: AuthUser | null) => void; setLoading: (v: boolean) => void; logout: () => void }

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    { name: 'ft-auth', partialize: (s) => ({ user: s.user }) }
  )
)
