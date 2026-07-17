import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus, TaskPriority } from '@/types'

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  createTask: (moduleId: string, title: string, priority: TaskPriority) => Promise<Task | null>
  fetchTasks: (moduleId: string) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  completeTask: (id: string) => Promise<void>
  archiveTask: (id: string) => Promise<void>
  pinTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  createTask: async (moduleId: string, title: string, priority: TaskPriority) => {
    try {
      set({ error: null })
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            module_id: moduleId,
            title,
            priority,
            status: 'not_started',
            order: get().tasks.length,
            is_pinned: false,
          },
        ])
        .select()
        .single()

      if (error) throw error

      set({ tasks: [...get().tasks, data] })
      return data
    } catch (error) {
      set({ error: (error as Error).message })
      return null
    }
  },

  fetchTasks: async (moduleId: string) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('module_id', moduleId)
        .neq('status', 'archived')
        .order('order', { ascending: true })

      if (error) throw error

      set({ tasks: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set({
        tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  deleteTask: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      set({ tasks: get().tasks.filter((t) => t.id !== id) })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  completeTask: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'completed' as TaskStatus,
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      set({
        tasks: get().tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'completed' as TaskStatus,
                completed_at: new Date().toISOString(),
              }
            : t
        ),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  archiveTask: async (id: string) => {
    try {
      set({ error: null })
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'archived' as TaskStatus })
        .eq('id', id)

      if (error) throw error

      set({ tasks: get().tasks.filter((t) => t.id !== id) })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  pinTask: async (id: string) => {
    try {
      set({ error: null })
      const task = get().tasks.find((t) => t.id === id)
      if (!task) return

      const { error } = await supabase
        .from('tasks')
        .update({ is_pinned: !task.is_pinned })
        .eq('id', id)

      if (error) throw error

      set({
        tasks: get().tasks.map((t) => (t.id === id ? { ...t, is_pinned: !t.is_pinned } : t)),
      })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
