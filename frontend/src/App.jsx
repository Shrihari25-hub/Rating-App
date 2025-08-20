import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext' 
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import StoreOwnerDashboard from './pages/StoreOwnerDashboard'
import Layout from './components/Layout'

function AppContent() {
  const { user } = useAuth(); 
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/store-owner/*" element={
          <ProtectedRoute requiredRole="store_owner">
            <Layout>
              <StoreOwnerDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/user/*" element={
          <ProtectedRoute>
            <Layout>
              <UserDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <Navigate to={
            user?.role === 'admin' ? '/admin' : 
            user?.role === 'store_owner' ? '/store-owner' : '/user'
          } replace />
        } />
      </Routes>
    </Router>
  )
}

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <AppContent /> 
    </AuthProvider>
  )
}

export default App