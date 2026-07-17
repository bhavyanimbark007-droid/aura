import { Link } from 'react-router-dom'
import { useModuleStore } from '@/store/moduleStore'
import { useAuthStore } from '@/store/authStore'
import { Plus, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import CreateModuleModal from '@/components/module/CreateModuleModal'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const modules = useModuleStore((s) => s.modules)
  const signOut = useAuthStore((s) => s.signOut)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="h-full flex flex-col bg-dark-800 border-r border-dark-700">
      {/* Logo */}
      <Link to="/" className="p-6 border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
          <span className="font-bold text-lg">AURA</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-dark-300 hover:text-white"
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </Link>

        <div className="pt-4 pb-2">
          <div className="px-4 py-2 text-xs font-semibold text-dark-500 uppercase tracking-wider">
            Modules
          </div>
        </div>

        {modules.map((module) => (
          <Link
            key={module.id}
            to={`/module/${module.id}`}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-dark-300 hover:text-white"
          >
            <span>{module.icon}</span>
            <span>{module.name}</span>
          </Link>
        ))}

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-blue-400 hover:text-blue-300"
        >
          <Plus className="w-5 h-5" />
          <span>Create Module</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-dark-400 hover:text-white text-sm">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>

      {showCreateModal && <CreateModuleModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
