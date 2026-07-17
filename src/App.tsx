import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import Layout from '@/components/Layout'
import AuthPage from '@/pages/AuthPage'
import DashboardPage from '@/pages/DashboardPage'
import ModulePage from '@/pages/ModulePage'
import BodyPage from '@/pages/BodyPage'
import LoadingScreen from '@/components/LoadingScreen'

function App() {
  const { user, loading, checkAuth } = useAuthStore()
  const { fetchSettings } = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSettings(user.id)
    }
  }, [user])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<AuthPage />} />
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/module/:id" element={<ModulePage />} />
            <Route path="/body" element={<BodyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  )
}

export default App
