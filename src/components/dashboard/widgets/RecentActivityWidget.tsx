import { motion } from 'framer-motion'

export default function RecentActivityWidget() {
  const activities = [
    { name: 'Workout Completed', time: '2 hours ago', icon: '💪' },
    { name: 'Habit Streak Updated', time: '4 hours ago', icon: '🔥' },
    { name: 'Goal Progress', time: '6 hours ago', icon: '🎯' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-dark p-6 lg:col-span-2 rounded-2xl"
    >
      <p className="text-sm font-semibold text-dark-400 mb-4">RECENT ACTIVITY</p>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-center gap-3 py-2">
            <span className="text-lg">{activity.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-white">{activity.name}</p>
              <p className="text-xs text-dark-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
