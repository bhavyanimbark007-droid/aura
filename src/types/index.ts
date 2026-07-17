// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Module Types
export interface Module {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  order: number
  is_hidden: boolean
  created_at: string
  updated_at: string
}

// Task Types
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'archived'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  user_id: string
  module_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  deadline?: string
  estimated_time?: number
  completed_at?: string
  tags: string[]
  notes?: string
  attachments: string[]
  parent_task_id?: string
  order: number
  is_pinned: boolean
  created_at: string
  updated_at: string
}

// Habit Types
export type HabitFrequency = 'daily' | 'weekly' | 'monthly'

export interface Habit {
  id: string
  user_id: string
  module_id: string
  name: string
  frequency: HabitFrequency
  current_streak: number
  longest_streak: number
  completion_percentage: number
  difficulty: 'easy' | 'medium' | 'hard'
  reminder?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  created_at: string
}

// Goal Types
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'archived'

export interface Goal {
  id: string
  user_id: string
  module_id: string
  title: string
  description?: string
  target: number
  current_progress: number
  unit?: string
  deadline?: string
  priority: TaskPriority
  status: GoalStatus
  milestones: Milestone[]
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  goal_id: string
  target_value: number
  achieved: boolean
  achieved_at?: string
}

// Gamification Types
export interface UserXP {
  id: string
  user_id: string
  total_xp: number
  level: number
  next_level_xp: number
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  title: string
  description: string
  icon: string
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond'
  xp_reward: number
  unlock_date: string
  created_at: string
}

// Journal Types
export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  mood?: 'great' | 'good' | 'normal' | 'bad' | 'terrible'
  tags: string[]
  attachments: string[]
  is_favorite: boolean
  entry_type: 'daily' | 'weekly' | 'monthly' | 'general'
  created_at: string
  updated_at: string
}

// Body Tracking Types
export interface WeightEntry {
  id: string
  user_id: string
  weight: number
  unit: 'kg' | 'lb'
  notes?: string
  photo_url?: string
  created_at: string
}

export interface BodyMeasurement {
  id: string
  user_id: string
  type: string
  value: number
  unit: string
  created_at: string
}

export interface NutritionEntry {
  id: string
  user_id: string
  date: string
  calories: number
  protein: number
  carbs: number
  fats: number
  water: number
  notes?: string
}

// Dashboard Types
export interface Widget {
  id: string
  user_id: string
  type: string
  position_x: number
  position_y: number
  width: number
  height: number
  is_hidden: boolean
  config?: Record<string, any>
}

// Settings Types
export interface UserSettings {
  id: string
  user_id: string
  theme: 'dark' | 'light'
  accent_color: string
  language: string
  units: 'metric' | 'imperial'
  default_view: string
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}
