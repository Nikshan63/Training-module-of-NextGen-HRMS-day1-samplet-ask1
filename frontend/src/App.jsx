import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout       from './components/layout/AppLayout'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import DashboardPage   from './pages/DashboardPage'
import ProjectsPage    from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import MembersPage     from './pages/MembersPage'
import SettingsPage    from './pages/SettingsPage'
import { PageLoader }  from './components/ui'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><PageLoader /></div>
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<PublicRoute><LoginPage    /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected */}
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route path="/dashboard"         element={<DashboardPage    />} />
            <Route path="/projects"          element={<ProjectsPage     />} />
            <Route path="/projects/:id"      element={<ProjectDetailPage />} />
            <Route path="/members"           element={<MembersPage      />} />
            <Route path="/settings"          element={<SettingsPage     />} />
          </Route>

          {/* Default */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
