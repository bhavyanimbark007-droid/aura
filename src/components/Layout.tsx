import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default function Layout() {
  return (
    <div className="flex h-screen bg-dark-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-dark-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-dark-700">
        <MobileNav />
      </div>
    </div>
  )
}
