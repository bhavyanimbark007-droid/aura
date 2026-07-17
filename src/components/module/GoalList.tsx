import { useGoalStore } from '@/store/goalStore'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface GoalListProps {
  moduleId: string
}

export default function GoalList({ moduleId }: GoalListProps) {
  const { goals, createGoal } = useGoalStore()
  const [newGoalTitle, setNewGoalTitle] = useState('')

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim()) {
      toast.error('Please enter a goal title')
      return
    }

    const result = await createGoal(moduleId, newGoalTitle, 100)
    if (result) {
      setNewGoalTitle('')
      toast.success('Goal created!')
    }
  }

  const moduleGoals = goals.filter((g) => g.module_id === moduleId)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateGoal()}
          placeholder="Add a new goal..."
          className="flex-1 px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleCreateGoal}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {moduleGoals.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            <p>No goals yet. Set one and start your journey! 🎯</p>
          </div>
        ) : (
          moduleGoals.map((goal) => (
            <div key={goal.id} className="card space-y-3 hover:bg-dark-700 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium">{goal.title}</p>
                  <p className="text-sm text-dark-400 mt-1">
                    {goal.current_progress} / {goal.target}
                  </p>
                </div>
                <span className="text-lg font-bold text-purple-400">
                  {Math.round((goal.current_progress / goal.target) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                  style={{ width: `${Math.round((goal.current_progress / goal.target) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
