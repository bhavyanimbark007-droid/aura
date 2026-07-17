import { useTaskStore } from '@/store/taskStore'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface TaskListProps {
  moduleId: string
}

export default function TaskList({ moduleId }: TaskListProps) {
  const { tasks, createTask } = useTaskStore()
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const result = await createTask(moduleId, newTaskTitle, 'medium')
    if (result) {
      setNewTaskTitle('')
      toast.success('Task created!')
    }
  }

  const moduleTasks = tasks.filter((t) => t.module_id === moduleId)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleCreateTask}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {moduleTasks.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            <p>No tasks yet. Create one to get started! 🚀</p>
          </div>
        ) : (
          moduleTasks.map((task) => (
            <div key={task.id} className="card flex items-center gap-3 hover:bg-dark-700 cursor-pointer transition-colors">
              <div className="w-5 h-5 rounded border-2 border-dark-600"></div>
              <div className="flex-1">
                <p className="text-white font-medium">{task.title}</p>
                <p className="text-xs text-dark-500">{task.priority}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
