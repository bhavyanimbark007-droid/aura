import { useHabitStore } from '@/store/habitStore'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface HabitListProps {
  moduleId: string
}

export default function HabitList({ moduleId }: HabitListProps) {
  const { habits, createHabit, completeHabit } = useHabitStore()
  const [newHabitName, setNewHabitName] = useState('')

  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) {
      toast.error('Please enter a habit name')
      return
    }

    const result = await createHabit(moduleId, newHabitName, 'daily')
    if (result) {
      setNewHabitName('')
      toast.success('Habit created!')
    }
  }

  const moduleHabits = habits.filter((h) => h.module_id === moduleId)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateHabit()}
          placeholder="Add a new habit..."
          className="flex-1 px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleCreateHabit}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {moduleHabits.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            <p>No habits yet. Build one today! 🏆</p>
          </div>
        ) : (
          moduleHabits.map((habit) => (
            <div key={habit.id} className="card flex items-center justify-between hover:bg-dark-700 transition-colors">
              <div>
                <p className="text-white font-medium">{habit.name}</p>
                <div className="flex gap-4 mt-2 text-xs text-dark-500">
                  <span>🔥 Streak: {habit.current_streak}</span>
                  <span>📊 {habit.completion_percentage}%</span>
                </div>
              </div>
              <button
                onClick={() => completeHabit(habit.id)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Complete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
