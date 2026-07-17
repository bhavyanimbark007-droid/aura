import { useState, useEffect } from 'react'
import { useBodyStore } from '@/store/bodyStore'
import { useUserStore } from '@/store/userStore'
import { useAuthStore } from '@/store/authStore'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NutritionTracker() {
  const user = useAuthStore((s) => s.user)
  const { nutritionToday, fetchNutritionToday, updateNutrition } = useBodyStore()
  const { settings } = useUserStore()
  const [calories, setCalories] = useState(0)
  const [protein, setProtein] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [fats, setFats] = useState(0)
  const [water, setWater] = useState(0)

  useEffect(() => {
    if (user) {
      fetchNutritionToday(user.id)
    }
  }, [user])

  useEffect(() => {
    if (nutritionToday) {
      setCalories(nutritionToday.calories)
      setProtein(nutritionToday.protein)
      setCarbs(nutritionToday.carbs)
      setFats(nutritionToday.fats)
      setWater(nutritionToday.water)
    }
  }, [nutritionToday])

  const handleUpdate = async (field: string, value: number) => {
    if (!user) return

    try {
      await updateNutrition(user.id, {
        [field]: Math.max(0, value),
      })
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const caloriesGoal = settings?.calories_goal || 2500
  const proteinGoal = settings?.protein_goal || 150
  const carbsGoal = settings?.carbs_goal || 300
  const fatsGoal = settings?.fats_goal || 80
  const waterGoal = settings?.water_goal || 3000

  const caloriesPercent = Math.min(100, (calories / caloriesGoal) * 100)
  const proteinPercent = Math.min(100, (protein / proteinGoal) * 100)
  const carbsPercent = Math.min(100, (carbs / carbsGoal) * 100)
  const fatsPercent = Math.min(100, (fats / fatsGoal) * 100)
  const waterPercent = Math.min(100, (water / waterGoal) * 100)

  const macroData = [
    { name: 'Protein', value: protein, fill: '#ef4444' },
    { name: 'Carbs', value: carbs, fill: '#eab308' },
    { name: 'Fats', value: fats, fill: '#f97316' },
  ]

  return (
    <div className="space-y-6">
      {/* Macros Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Macros</h3>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={macroData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={100} startAngle={90} endAngle={-270}>
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 flex-1">
            <div>
              <p className="text-sm text-dark-400 mb-1">Protein: {protein}g / {proteinGoal}g</p>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${proteinPercent}%` }}></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Carbs: {carbs}g / {carbsGoal}g</p>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${carbsPercent}%` }}></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Fats: {fats}g / {fatsGoal}g</p>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${fatsPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calories */}
        <div className="card">
          <p className="text-sm text-dark-400 mb-3">Calories</p>
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-white">{calories}</p>
            <p className="text-sm text-dark-400">/ {caloriesGoal}</p>
          </div>
          <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${caloriesPercent}%` }}></div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdate('calories', calories - 100)}
              className="flex-1 px-3 py-1 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <Minus className="w-4 h-4" />
              100
            </button>
            <button
              onClick={() => handleUpdate('calories', calories + 100)}
              className="flex-1 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              100
            </button>
          </div>
        </div>

        {/* Water */}
        <div className="card">
          <p className="text-sm text-dark-400 mb-3">Water</p>
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-white">{water}ml</p>
            <p className="text-sm text-dark-400">/ {waterGoal}ml</p>
          </div>
          <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-blue-500" style={{ width: `${waterPercent}%` }}></div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdate('water', water - 250)}
              className="flex-1 px-3 py-1 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <Minus className="w-4 h-4" />
              250ml
            </button>
            <button
              onClick={() => handleUpdate('water', water + 250)}
              className="flex-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              250ml
            </button>
          </div>
        </div>
      </div>

      {/* Manual Input */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Manual Entry</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm text-dark-400 mb-2">Protein (g)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => {
                setProtein(parseInt(e.target.value) || 0)
                handleUpdate('protein', parseInt(e.target.value) || 0)
              }}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-2">Carbs (g)</label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => {
                setCarbs(parseInt(e.target.value) || 0)
                handleUpdate('carbs', parseInt(e.target.value) || 0)
              }}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-2">Fats (g)</label>
            <input
              type="number"
              value={fats}
              onChange={(e) => {
                setFats(parseInt(e.target.value) || 0)
                handleUpdate('fats', parseInt(e.target.value) || 0)
              }}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-2">Calories</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => {
                setCalories(parseInt(e.target.value) || 0)
                handleUpdate('calories', parseInt(e.target.value) || 0)
              }}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
