import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { JournalEntry } from '@/types'

interface JournalState {
  entries: JournalEntry[]
  loading: boolean
  error: string | null
  fetchEntries: (userId: string) => Promise<void>
  createEntry: (userId: string, title: string, content: string) => Promise<void>
  updateEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  fetchEntries: async (userId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ entries: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  createEntry: async (userId: string, title: string, content: string) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{ user_id: userId, title, content, entry_type: 'general' }])
        .select()
        .single()

      if (error) throw error
      set({ entries: [data, ...get().entries] })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateEntry: async (id: string, updates: Partial<JournalEntry>) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set({
        entries: get().entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  deleteEntry: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      set({ entries: get().entries.filter((e) => e.id !== id) })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
