import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Module } from '@/types'

interface ModuleState {
  modules: Module[]
  loading: boolean
  error: string | null
  createModule: (name: string, icon: string, color: string) => Promise<Module | null>
  fetchModules: (userId: string) => Promise<void>
  updateModule: (id: string, updates: Partial<Module>) => Promise<void>
  deleteModule: (id: string) => Promise<void>
  reorderModules: (modules: Module[]) => Promise<void>
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  modules: [],
  loading: false,
  error: null,

  createModule: async (name: string, icon: string, color: string) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('modules')
        .insert([
          {
            name,
            icon,
            color,
            order: get().modules.length,
          },
        ])
        .select()
        .single()

      if (error) throw error

      set({ modules: [...get().modules, data] })
      return data
    } catch (error) {
      set({ error: (error as Error).message })
      return null
    }
  },

  fetchModules: async (userId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('user_id', userId)
        .order('order', { ascending: true })

      if (error) throw error

      set({ modules: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  updateModule: async (id: string, updates: Partial<Module>) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('modules')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set({
        modules: get().modules.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  deleteModule: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id)

      if (error) throw error

      set({ modules: get().modules.filter((m) => m.id !== id) })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  reorderModules: async (modules: Module[]) => {
    try {
      set({ error: null })
      const updates = modules.map((m, index) => ({
        id: m.id,
        order: index,
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('modules')
          .update({ order: update.order })
          .eq('id', update.id)

        if (error) throw error
      }

      set({ modules })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
