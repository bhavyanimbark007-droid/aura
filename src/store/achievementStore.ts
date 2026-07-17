import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Achievement } from '@/types'

interface AchievementState {
  achievements: Achievement[]
  loading: boolean
  error: string | null
  fetchAchievements: (userId: string) => Promise<void>
  unlockAchievement: (userId: string, title: string, description: string, icon: string, rarity: string) => Promise<void>
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  loading: false,
  error: null,

  fetchAchievements: async (userId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlock_date', { ascending: false })

      if (error) throw error
      set({ achievements: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  unlockAchievement: async (userId: string, title: string, description: string, icon: string, rarity: string) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('achievements')
        .insert([
          {
            user_id: userId,
            title,
            description,
            icon,
            rarity,
            xp_reward: 50,
            unlock_date: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      set({ achievements: [data, ...get().achievements] })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
