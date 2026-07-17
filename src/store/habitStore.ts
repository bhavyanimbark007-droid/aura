import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Habit, HabitFrequency } from '@/types'

interface HabitState {
  habits: Habit[]
  loading: boolean
  error: string | null
  createHabit: (moduleId: string, name: string, frequency: HabitFrequency) => Promise<Habit | null>
  fetchHabits: (moduleId: string) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  completeHabit: (id: string) => Promise<void>
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: false,
  error: null,

  createHabit: async (moduleId: string, name: string, frequency: HabitFrequency) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            module_id: moduleId,
            name,
            frequency,
            current_streak: 0,
            longest_streak: 0,
            completion_percentage: 0,
            difficulty: 'medium',
          },
        ])
        .select()
        .single()

      if (error) throw error

      set({ habits: [...get().habits, data] })
      return data
    } catch (error) {
      set({ error: (error as Error).message })
      return null
    }
  },

  fetchHabits: async (moduleId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('module_id', moduleId)

      if (error) throw error

      set({ habits: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  updateHabit: async (id: string, updates: Partial<Habit>) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set({
        habits: get().habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  deleteHabit: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)

      if (error) throw error

      set({ habits: get().habits.filter((h) => h.id !== id) })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  completeHabit: async (id: string) => {
    try {
      set({ error: null })
      const habit = get().habits.find((h) => h.id === id)
      if (!habit) return

      const { error } = await supabase
        .from('habit_completions')
        .insert([
          {
            habit_id: id,
            completed_date: new Date().toISOString().split('T')[0],
          },
        ])

      if (error) throw error

      // Update habit stats
      set({
        habits: get().habits.map((h) =>
          h.id === id
            ? {
                ...h,
                current_streak: h.current_streak + 1,
                completion_percentage: Math.min(100, h.completion_percentage + 10),
              }
            : h
        ),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
