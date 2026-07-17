import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
        >
          <span className="text-3xl">✨</span>
        </motion.div>
        <h1 className="text-2xl font-bold text-white mt-4">AURA</h1>
        <p className="text-dark-400 mt-2">Loading your life operating system...</p>
      </div>
    </div>
  )
}
