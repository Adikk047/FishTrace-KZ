import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import Login       from './pages/Login'
import Register    from './pages/Register'
import Dashboard   from './pages/Dashboard'
import AddCatch    from './pages/AddCatch'
import Market      from './pages/Market'
import CatchDetail from './pages/CatchDetail'
import Admin       from './pages/Admin'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'text-sm font-medium',
            style: { borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Market is public too */}
          <Route path="/market" element={
            <Layout><Market /></Layout>
          } />
          <Route path="/catch/:id" element={
            <Layout><CatchDetail /></Layout>
          } />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/add-catch" element={
            <ProtectedRoute roles={['fisher']}>
              <Layout><AddCatch /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['inspector']}>
              <Layout><Admin /></Layout>
            </ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/market" replace />} />
          <Route path="*" element={<Navigate to="/market" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
