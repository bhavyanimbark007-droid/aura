import { useState, useEffect } from 'react'
import { useBodyStore } from '@/store/bodyStore'
import { useAuthStore } from '@/store/authStore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

export default function WeightTracker() {
  const user = useAuthStore((s) => s.user)
  const { weights, fetchWeights, addWeight, deleteWeight } = useBodyStore()
  const [newWeight, setNewWeight] = useState('')
  const [unit, setUnit] = useState('kg')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchWeights(user.id)
    }
  }, [user])

  const handleAddWeight = async () => {
    if (!newWeight || !user) {
      toast.error('Please enter a weight')
      return
    }

    setLoading(true)
    try {
      await addWeight(user.id, parseFloat(newWeight), unit, notes)
      setNewWeight('')
      setNotes('')
      toast.success('Weight added! 💪')
    } catch (error) {
      toast.error('Failed to add weight')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteWeight(id)
      toast.success('Weight deleted')
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const currentWeight = weights[0]?.weight || 0
  const highestWeight = Math.max(...weights.map((w) => w.weight), 0)
  const lowestWeight = weights.length > 0 ? Math.min(...weights.map((w) => w.weight)) : 0
  const averageWeight = weights.length > 0 ? (weights.reduce((sum, w) => sum + w.weight, 0) / weights.length).toFixed(1) : 0

  const chartData = weights
    .slice()
    .reverse()
    .map((w) => ({
      date: new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.weight,
    }))

  return (
    <div className="space-y-6">
      {/* Add Weight Form */}
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold text-white">Log Weight</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-dark-400 mb-2">Weight</label>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Enter weight"
              step="0.1"
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-2">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)"
              className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddWeight}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-dark-400 mb-1">Current</p>
          <p className="text-2xl font-bold text-purple-400">{currentWeight} {unit}</p>
        </div>
        <div className="card">
          <p className="text-sm text-dark-400 mb-1">Highest</p>
          <p className="text-2xl font-bold text-red-400">{highestWeight} {unit}</p>
        </div>
        <div className="card">
          <p className="text-sm text-dark-400 mb-1">Lowest</p>
          <p className="text-2xl font-bold text-green-400">{lowestWeight} {unit}</p>
        </div>
        <div className="card">
          <p className="text-sm text-dark-400 mb-1">Average</p>
          <p className="text-2xl font-bold text-blue-400">{averageWeight} {unit}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#a78bfa"
                dot={{ fill: '#a78bfa', r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weight History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">History</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
          {weights.length === 0 ? (
            <p className="text-center text-dark-400 py-8">No weight entries yet 📊</p>
          ) : (
            weights.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 hover:bg-dark-700 rounded-lg transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium">{entry.weight} {entry.unit}</p>
                  <p className="text-xs text-dark-500">{formatDate(entry.created_at)}</p>
                  {entry.notes && <p className="text-xs text-dark-400 mt-1">{entry.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
