import { Link } from 'react-router-dom'
import { Home, Plus, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function MobileNav() {
  const signOut = useAuthStore((s) => s.signOut)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="bg-dark-800 border-t border-dark-700">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className="flex-1 flex items-center justify-center py-3 text-dark-400 hover:text-white transition-colors"
        >
          <Home className="w-6 h-6" />
        </Link>
        <button className="flex-1 flex items-center justify-center py-3 text-dark-400 hover:text-white transition-colors">
          <Plus className="w-6 h-6" />
        </button>
        <Link
          to="#settings"
          className="flex-1 flex items-center justify-center py-3 text-dark-400 hover:text-white transition-colors"
        >
          <Settings className="w-6 h-6" />
        </Link>
        <button
          onClick={handleSignOut}
          className="flex-1 flex items-center justify-center py-3 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
