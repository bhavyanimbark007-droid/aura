import { motion } from 'framer-motion'
import { Zap, Trophy, Award } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

const LEVEL_NAMES = {
  1: 'Explorer',
  5: 'Disciplined',
  10: 'Focused',
  25: 'Consistent',
  50: 'Elite',
  100: 'Legend',
}

export default function GamificationWidget() {
  const user = useAuthStore((s) => s.user)
  const { totalXP, level, fetchSettings } = useUserStore()

  useEffect(() => {
    if (user) {
      fetchSettings(user.id)
    }
  }, [user])

  const xpForNextLevel = (level + 1) * 1000
  const currentLevelXP = level * 1000
  const xpProgress = ((totalXP - currentLevelXP) / (xpForNextLevel - currentLevelXP)) * 100

  const getLevelName = () => {
    for (let l = 100; l >= 1; l--) {
      if (level >= l && LEVEL_NAMES[l as keyof typeof LEVEL_NAMES]) {
        return LEVEL_NAMES[l as keyof typeof LEVEL_NAMES]
      }
    }
    return 'Explorer'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-dark p-6 lg:col-span-2 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-sm font-semibold text-dark-400 mb-1">LEVEL {level}</p>
            <p className="text-lg font-bold text-white">{getLevelName()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-sm text-yellow-400 font-semibold">{totalXP} XP</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-dark-400">
          <span>Progress to Level {level + 1}</span>
          <span>{Math.round(xpProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          />
        </div>
        <p className="text-xs text-dark-500 mt-2">{xpForNextLevel - totalXP} XP to next level</p>
      </div>

      <div className="mt-6 pt-6 border-t border-dark-700 grid grid-cols-3 gap-2">
        <div className="text-center">
          <Award className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <p className="text-xs text-dark-400">Achievements</p>
          <p className="text-lg font-bold text-white">5</p>
        </div>
        <div className="text-center">
          <Trophy className="w-5 h-5 text-orange-400 mx-auto mb-2" />
          <p className="text-xs text-dark-400">Milestones</p>
          <p className="text-lg font-bold text-white">3</p>
        </div>
        <div className="text-center">
          <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-xs text-dark-400">Streaks</p>
          <p className="text-lg font-bold text-white">12</p>
        </div>
      </div>
    </motion.div>
  )
}
