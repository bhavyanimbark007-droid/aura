import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { WeightEntry, BodyMeasurement, NutritionEntry } from '@/types'

interface BodyState {
  weights: WeightEntry[]
  measurements: BodyMeasurement[]
  nutritionToday: NutritionEntry | null
  loading: boolean
  error: string | null
  fetchWeights: (userId: string, days?: number) => Promise<void>
  addWeight: (userId: string, weight: number, unit: string, notes?: string) => Promise<void>
  deleteWeight: (id: string) => Promise<void>
  fetchMeasurements: (userId: string) => Promise<void>
  addMeasurement: (userId: string, type: string, value: number, unit: string) => Promise<void>
  fetchNutritionToday: (userId: string) => Promise<void>
  updateNutrition: (userId: string, entry: Partial<NutritionEntry>) => Promise<void>
}

export const useBodyStore = create<BodyState>((set, get) => ({
  weights: [],
  measurements: [],
  nutritionToday: null,
  loading: false,
  error: null,

  fetchWeights: async (userId: string, days = 30) => {
    try {
      set({ loading: true, error: null })
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ weights: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  addWeight: async (userId: string, weight: number, unit: string, notes?: string) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('weight_entries')
        .insert([
          {
            user_id: userId,
            weight,
            unit,
            notes,
          },
        ])
        .select()
        .single()

      if (error) throw error

      set({ weights: [data, ...get().weights] })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  deleteWeight: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      set({ weights: get().weights.filter((w) => w.id !== id) })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  fetchMeasurements: async (userId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', userId)
        .order('type', { ascending: true })

      if (error) throw error

      set({ measurements: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  addMeasurement: async (userId: string, type: string, value: number, unit: string) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('body_measurements')
        .insert([
          {
            user_id: userId,
            type,
            value,
            unit,
          },
        ])
        .select()
        .single()

      if (error) throw error

      set({ measurements: [...get().measurements, data] })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  fetchNutritionToday: async (userId: string) => {
    try {
      set({ error: null })
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('nutrition_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      set({ nutritionToday: data || null })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateNutrition: async (userId: string, entry: Partial<NutritionEntry>) => {
    try {
      set({ error: null })
      const today = new Date().toISOString().split('T')[0]

      const { data: existing } = await supabase
        .from('nutrition_entries')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('nutrition_entries')
          .update(entry)
          .eq('id', existing.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('nutrition_entries')
          .insert([{ user_id: userId, date: today, ...entry }])

        if (error) throw error
      }

      set({ nutritionToday: { ...get().nutritionToday!, ...entry } as NutritionEntry })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
