import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { UserSettings } from '@/types'

interface UserState {
  settings: UserSettings | null
  totalXP: number
  level: number
  loading: boolean
  error: string | null
  fetchSettings: (userId: string) => Promise<void>
  updateSettings: (userId: string, updates: Partial<UserSettings>) => Promise<void>
  addXP: (userId: string, amount: number, reason: string) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  settings: null,
  totalXP: 0,
  level: 1,
  loading: false,
  error: null,

  fetchSettings: async (userId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      // Create default settings if none exist
      if (!data) {
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert([{ user_id: userId }])
          .select()
          .single()

        if (createError) throw createError
        set({ settings: newSettings })
      } else {
        set({ settings: data })
      }

      // Fetch total XP
      const { data: xpData } = await supabase
        .from('xp_entries')
        .select('amount')
        .eq('user_id', userId)

      const totalXP = xpData?.reduce((sum, entry) => sum + entry.amount, 0) || 0
      const level = Math.floor(totalXP / 1000) + 1

      set({ totalXP, level })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  updateSettings: async (userId: string, updates: Partial<UserSettings>) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId)

      if (error) throw error

      set({
        settings: get().settings ? { ...get().settings!, ...updates } : null,
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  addXP: async (userId: string, amount: number, reason: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('xp_entries')
        .insert([{ user_id: userId, amount, reason }])

      if (error) throw error

      const newTotal = get().totalXP + amount
      const newLevel = Math.floor(newTotal / 1000) + 1

      set({ totalXP: newTotal, level: newLevel })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
