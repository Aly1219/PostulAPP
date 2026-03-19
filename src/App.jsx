import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import SuiviPage from './pages/SuiviPage'
import DashboardPage from './pages/DashboardPage'
import EntreprisesPage from './pages/EntreprisesPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f0f4ff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: '#6366f1', fontWeight: '600' }}>Chargement...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="suivi" element={<SuiviPage />} />
          <Route path="entreprises" element={<EntreprisesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}