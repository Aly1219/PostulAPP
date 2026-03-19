import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()

  const navStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
    textDecoration: 'none', transition: 'all 0.2s',
    background: isActive ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'transparent',
    color: isActive ? 'white' : '#6b7280',
  })

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            📋
          </div>
          <span style={{ fontWeight: '800', fontSize: '16px', color: '#1e1b4b' }}>Suivi Postulations</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <NavLink to="/dashboard" style={({ isActive }) => navStyle(isActive)}>📊 Dashboard</NavLink>
          <NavLink to="/suivi" style={({ isActive }) => navStyle(isActive)}>📝 Suivi</NavLink>
          <NavLink to="/entreprises" style={({ isActive }) => navStyle(isActive)}>🏢 Entreprises</NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '6px 12px', fontSize: '13px', color: '#6366f1', fontWeight: '600' }}>
            {user?.email?.split('@')[0]}
          </div>
          <button onClick={signOut}
            style={{ background: '#fef2f2', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '13px', color: '#ef4444', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}