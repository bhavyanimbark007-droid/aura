import { Module } from '@/types'

interface ModuleHeaderProps {
  module: Module
  activeTab: string
  onTabChange: (tab: any) => void
}

export default function ModuleHeader({ module, activeTab, onTabChange }: ModuleHeaderProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'habits', label: 'Habits' },
    { id: 'goals', label: 'Goals' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{module.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-white">{module.name}</h1>
          <p className="text-dark-400">Manage your {module.name.toLowerCase()} journey</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-dark-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
