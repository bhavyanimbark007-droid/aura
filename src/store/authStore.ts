import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ error: null })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        set({ user: data.user as unknown as User })
      }
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ error: null })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        set({ user: data.user as unknown as User })
      }
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  signOut: async () => {
    try {
      set({ error: null })
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null })
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true })
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      if (data.session?.user) {
        set({ user: data.session.user as unknown as User })
      }
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },
}))
