import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // TODO: replace with real auth check (e.g. redux auth slice / token check)
  const isAuthenticated = true

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}