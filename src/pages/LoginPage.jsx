import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      if (isSignUp) setError('Vérifiez votre email pour confirmer votre compte.')
      else navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(99,102,241,0.25)' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '28px' }}>
            📋
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px' }}>Suivi Postulations</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {isSignUp ? 'Créez votre espace personnel' : 'Bienvenue, connectez-vous'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="vous@email.com"
              style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s' }}
          >
            {loading ? 'Chargement...' : isSignUp ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '1.5rem' }}>
          {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
          >
            {isSignUp ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
      </div>
    </div>
  )
}