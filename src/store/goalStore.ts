import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Goal, GoalStatus, TaskPriority } from '@/types'

interface GoalState {
  goals: Goal[]
  loading: boolean
  error: string | null
  createGoal: (moduleId: string, title: string, target: number) => Promise<Goal | null>
  fetchGoals: (moduleId: string) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  updateProgress: (id: string, progress: number) => Promise<void>
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  createGoal: async (moduleId: string, title: string, target: number) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            module_id: moduleId,
            title,
            target,
            current_progress: 0,
            status: 'not_started' as GoalStatus,
            priority: 'medium' as TaskPriority,
          },
        ])
        .select()
        .single()

      if (error) throw error

      set({ goals: [...get().goals, data] })
      return data
    } catch (error) {
      set({ error: (error as Error).message })
      return null
    }
  },

  fetchGoals: async (moduleId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('module_id', moduleId)
        .neq('status', 'archived')

      if (error) throw error

      set({ goals: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  updateGoal: async (id: string, updates: Partial<Goal>) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set({
        goals: get().goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  deleteGoal: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error

      set({ goals: get().goals.filter((g) => g.id !== id) })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateProgress: async (id: string, progress: number) => {
    try {
      set({ error: null })
      const goal = get().goals.find((g) => g.id === id)
      if (!goal) return

      const newProgress = Math.min(goal.target, progress)
      const newStatus: GoalStatus = newProgress >= goal.target ? 'completed' : 'in_progress'

      const { error } = await supabase
        .from('goals')
        .update({
          current_progress: newProgress,
          status: newStatus,
        })
        .eq('id', id)

      if (error) throw error

      set({
        goals: get().goals.map((g) =>
          g.id === id
            ? {
                ...g,
                current_progress: newProgress,
                status: newStatus,
              }
            : g
        ),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
