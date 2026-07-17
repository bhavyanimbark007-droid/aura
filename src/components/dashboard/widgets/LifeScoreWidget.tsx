import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function LifeScoreWidget() {
  const lifeScore = 82
  const data = [{ value: lifeScore }, { value: 100 - lifeScore }]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-dark p-6 rounded-2xl"
    >
      <p className="text-sm font-semibold text-dark-400 mb-4">LIFE SCORE</p>
      <div className="flex items-center justify-center h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" startAngle={90} endAngle={450}>
              <Cell fill="#8b5cf6" />
              <Cell fill="#374151" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-white">{lifeScore}</p>
        <p className="text-xs text-dark-400 mt-1">↑ 5 from last week</p>
      </div>
    </motion.div>
  )
}
