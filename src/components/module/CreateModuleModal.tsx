import { useState } from 'react'
import { useModuleStore } from '@/store/moduleStore'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const MODULE_ICONS = ['💪', '✨', '👔', '📸', '🎬', '🗣', '🎓', '📊', '💻', '📚', '🎵', '🎮']

interface CreateModuleModalProps {
  onClose: () => void
}

export default function CreateModuleModal({ onClose }: CreateModuleModalProps) {
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(MODULE_ICONS[0])
  const [color, setColor] = useState('purple')
  const [loading, setLoading] = useState(false)

  const createModule = useModuleStore((s) => s.createModule)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a module name')
      return
    }

    setLoading(true)
    try {
      const result = await createModule(name, selectedIcon, color)
      if (result) {
        toast.success('Module created successfully!')
        onClose()
      }
    } catch (error) {
      toast.error('Failed to create module')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md border border-dark-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create Module</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-dark-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Module Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Coding, Finance, Reading"
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {MODULE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                    selectedIcon === icon
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-dark-600 hover:border-dark-500'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Theme Color</label>
            <div className="grid grid-cols-6 gap-2">
              {['purple', 'blue', 'pink', 'green', 'orange', 'red'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 rounded-lg border-2 transition-all ${
                    color === c ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: `var(--color-${c})` }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
