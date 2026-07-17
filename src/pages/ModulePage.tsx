import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useModuleStore } from '@/store/moduleStore'
import { useTaskStore } from '@/store/taskStore'
import { useHabitStore } from '@/store/habitStore'
import { useGoalStore } from '@/store/goalStore'
import ModuleHeader from '@/components/module/ModuleHeader'
import TaskList from '@/components/module/TaskList'
import HabitList from '@/components/module/HabitList'
import GoalList from '@/components/module/GoalList'

type TabType = 'overview' | 'tasks' | 'habits' | 'goals'

export default function ModulePage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const modules = useModuleStore((s) => s.modules)
  const fetchTasks = useTaskStore((s) => s.fetchTasks)
  const fetchHabits = useHabitStore((s) => s.fetchHabits)
  const fetchGoals = useGoalStore((s) => s.fetchGoals)

  const module = modules.find((m) => m.id === id)

  useEffect(() => {
    if (id) {
      fetchTasks(id)
      fetchHabits(id)
      fetchGoals(id)
    }
  }, [id])

  if (!module) {
    return <div className="text-center text-dark-400">Module not found</div>
  }

  return (
    <div className="space-y-6">
      <ModuleHeader module={module} activeTab={activeTab} onTabChange={setActiveTab} />

      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickStats />
            <RecentTasks />
            <TopHabits />
          </div>
        )}
        {activeTab === 'tasks' && <TaskList moduleId={id} />}
        {activeTab === 'habits' && <HabitList moduleId={id} />}
        {activeTab === 'goals' && <GoalList moduleId={id} />}
      </div>
    </div>
  )
}

function QuickStats() {
  return <div className="card">Quick Stats</div>
}

function RecentTasks() {
  return <div className="card">Recent Tasks</div>
}

function TopHabits() {
  return <div className="card">Top Habits</div>
}
