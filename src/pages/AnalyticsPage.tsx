import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { useHabitStore } from '@/store/habitStore'
import { useGoalStore } from '@/store/goalStore'
import { useBodyStore } from '@/store/bodyStore'
import { useUserStore } from '@/store/userStore'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react'

export default function AnalyticsPage() {
  const user = useAuthStore((s) => s.user)
  const tasks = useTaskStore((s) => s.tasks)
  const habits = useHabitStore((s) => s.habits)
  const goals = useGoalStore((s) => s.goals)
  const weights = useBodyStore((s) => s.weights)
  const { totalXP, level } = useUserStore()

  const [stats, setStats] = useState({
    tasksCompleted: 0,
    habitsCompleted: 0,
    goalsCompleted: 0,
    averageHabitCompletion: 0,
  })

  useEffect(() => {
    const completedTasks = tasks.filter((t) => t.status === 'completed').length
    const completedGoals = goals.filter((g) => g.status === 'completed').length
    const avgHabit = habits.length > 0 ? habits.reduce((sum, h) => sum + h.completion_percentage, 0) / habits.length : 0

    setStats({
      tasksCompleted: completedTasks,
      habitsCompleted: habits.filter((h) => h.current_streak > 0).length,
      goalsCompleted: completedGoals,
      averageHabitCompletion: Math.round(avgHabit),
    })
  }, [tasks, habits, goals])

  const chartData = [
    { name: 'Tasks', completed: stats.tasksCompleted, total: tasks.length },
    { name: 'Habits', completed: stats.habitsCompleted, total: habits.length },
    { name: 'Goals', completed: stats.goalsCompleted, total: goals.length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-dark-400 mt-1">Your progress overview</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-dark-400">Tasks Completed</p>
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.tasksCompleted}</p>
          <p className="text-xs text-dark-500 mt-1">of {tasks.length} total</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-dark-400">Habit Streak Avg</p>
            <Zap className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.averageHabitCompletion}%</p>
          <p className="text-xs text-dark-500 mt-1">completion rate</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-dark-400">Level</p>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{level}</p>
          <p className="text-xs text-dark-500 mt-1">{totalXP} total XP</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-dark-400">Weight Progress</p>
            <Calendar className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{weights.length}</p>
          <p className="text-xs text-dark-500 mt-1">entries logged</p>
        </div>
      </div>

      {/* Completion Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Completion Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#8b5cf6" name="Completed" />
            <Bar dataKey="total" fill="#4b5563" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Habit Completion Trend */}
      {habits.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Habit Performance</h3>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-white">{habit.name}</p>
                  <span className="text-xs text-dark-400">🔥 {habit.current_streak}</span>
                </div>
                <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${habit.completion_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
