import { create } from 'zustand'

export type PlanTier = 'Free' | 'Swimore Plus' | 'VIP' | 'VIP+'

export interface UserProfile {
  id: string
  name: string
  email: string
  plan: PlanTier
  isPartner: boolean
  avatarUrl?: string
}

export interface QuotaState {
  basicPoolUsed: number
  basicPoolLimit: number
  proPoolUsed: number
  proPoolLimit: number
  maxPoolUsed: number
  maxPoolLimit: number
  resetsAt: string
}

interface SessionState {
  token: string | null
  user: UserProfile | null
  quota: QuotaState
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  setUser: (user: UserProfile | null) => void
  setPlan: (plan: PlanTier) => void
  incrementUsage: (pool: 'basic' | 'pro' | 'max') => void
  logout: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  token: 'mock-session-jwt-alex-doe',
  user: {
    id: 'usr_882910',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    plan: 'Swimore Plus',
    isPartner: false,
  },
  quota: {
    basicPoolUsed: 32,
    basicPoolLimit: 50,
    proPoolUsed: 0,
    proPoolLimit: 0,
    maxPoolUsed: 14,
    maxPoolLimit: 50,
    resetsAt: '00:00 WIB',
  },
  isAuthenticated: true,

  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  setPlan: (plan) =>
    set((state) => {
      let proLimit = 0
      let maxLimit = 0
      if (plan === 'Swimore Plus') {
        maxLimit = 50
      } else if (plan === 'VIP') {
        proLimit = 50
        maxLimit = 50
      } else if (plan === 'VIP+') {
        proLimit = 100
        maxLimit = 50
      }

      return {
        user: state.user ? { ...state.user, plan } : null,
        quota: {
          ...state.quota,
          proPoolLimit: proLimit,
          maxPoolLimit: maxLimit,
        },
      }
    }),

  incrementUsage: (pool) =>
    set((state) => {
      const q = { ...state.quota }
      if (pool === 'basic') q.basicPoolUsed = Math.min(q.basicPoolUsed + 1, q.basicPoolLimit)
      if (pool === 'pro') q.proPoolUsed = Math.min(q.proPoolUsed + 1, q.proPoolLimit)
      if (pool === 'max') q.maxPoolUsed = Math.min(q.maxPoolUsed + 1, q.maxPoolLimit)
      return { quota: q }
    }),

  logout: () =>
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    }),
}))

