import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

const AdminProtectedRoute = lazy(() => import('./components/AdminProtectedRoute'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <p className="animate-pulse">Loading SAMFEM...</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminLogin />
            </Suspense>
          }
        />

        <Route
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminProtectedRoute />
            </Suspense>
          }
        >
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminDashboard />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
