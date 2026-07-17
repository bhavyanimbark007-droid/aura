import { motion } from 'framer-motion'
import { Activity, Flame, Zap } from 'lucide-react'

export default function QuickStatsWidget() {
  const stats = [
    { label: 'Streak', value: '12', icon: Flame, color: 'text-orange-400' },
    { label: 'Habits', value: '8/10', icon: Activity, color: 'text-green-400' },
    { label: 'XP', value: '450', icon: Zap, color: 'text-yellow-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-dark p-6 lg:col-span-2 rounded-2xl"
    >
      <p className="text-sm font-semibold text-dark-400 mb-4">TODAY'S STATS</p>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="flex flex-col items-center">
              <Icon className={`w-5 h-5 mb-2 ${stat.color}`} />
              <p className="text-sm text-dark-400">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
