import { useState } from 'react'
import WeightTracker from '@/components/body/WeightTracker'
import NutritionTracker from '@/components/body/NutritionTracker'

type TabType = 'weight' | 'nutrition'

export default function BodyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('weight')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl">💪</span>
        <div>
          <h1 className="text-3xl font-bold text-white">Body Transformation</h1>
          <p className="text-dark-400">Track your fitness journey</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-dark-700">
        <button
          onClick={() => setActiveTab('weight')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'weight'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          Weight
        </button>
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'nutrition'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-dark-400 hover:text-white'
          }`}
        >
          Nutrition
        </button>
      </div>

      {activeTab === 'weight' && <WeightTracker />}
      {activeTab === 'nutrition' && <NutritionTracker />}
    </div>
  )
}
