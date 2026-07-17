import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useModuleStore } from '@/store/moduleStore'
import DashboardGrid from '@/components/dashboard/DashboardGrid'
import WelcomeWidget from '@/components/dashboard/widgets/WelcomeWidget'
import LifeScoreWidget from '@/components/dashboard/widgets/LifeScoreWidget'
import QuickStatsWidget from '@/components/dashboard/widgets/QuickStatsWidget'
import RecentActivityWidget from '@/components/dashboard/widgets/RecentActivityWidget'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { fetchModules } = useModuleStore()

  useEffect(() => {
    if (user) {
      fetchModules(user.id)
    }
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 mt-1">Welcome back, {user?.name}!</p>
        </div>
      </div>

      <DashboardGrid>
        <WelcomeWidget />
        <LifeScoreWidget />
        <QuickStatsWidget />
        <RecentActivityWidget />
      </DashboardGrid>
    </div>
  )
}
