import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={'/connexion?redirect=' + encodeURIComponent(location.pathname)} replace />
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}
