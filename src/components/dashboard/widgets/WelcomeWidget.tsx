import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

export default function WelcomeWidget() {
  const today = new Date()
  const timeOfDay = today.getHours() < 12 ? 'Good Morning' : today.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-dark p-6 lg:col-span-2 rounded-2xl"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{timeOfDay} ✨</h2>
        <p className="text-dark-400">{formatDate(today)}</p>
      </div>
      <div className="mt-6 pt-6 border-t border-dark-700">
        <p className="text-sm text-dark-400">Today's focus: Stay consistent, achieve more 🚀</p>
      </div>
    </motion.div>
  )
}
