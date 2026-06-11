import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { CreateProfilePage } from '@/pages/CreateProfilePage'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Loader2 } from 'lucide-react'

const DashboardPage = React.lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const PatientsPage = React.lazy(() => import('@/pages/PatientsPage').then(m => ({ default: m.PatientsPage })))
const PatientDetailPage = React.lazy(() => import('@/pages/PatientDetailPage').then(m => ({ default: m.PatientDetailPage })))
const ReportsPage = React.lazy(() => import('@/pages/ReportsPage').then(m => ({ default: m.ReportsPage })))
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const MessagesPage = React.lazy(() => import('@/pages/MessagesPage').then(m => ({ default: m.MessagesPage })))

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 spinner text-blue-600" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, doctor, loading, needsProfile } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (needsProfile) {
    return <Navigate to="/create-profile" replace />
  }

  if (!doctor) {
    return <LoadingScreen />
  }

  return <>{children}</>
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, needsProfile } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user && !needsProfile) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function ProfileRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, needsProfile } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!needsProfile) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />

      {/* Profile Creation */}
      <Route
        path="/create-profile"
        element={
          <ProfileRoute>
            <CreateProfilePage />
          </ProfileRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="patients"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PatientsPage />
            </Suspense>
          }
        />
        <Route
          path="patients/:patientId"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PatientDetailPage />
            </Suspense>
          }
        />
        <Route
          path="messages"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <MessagesPage />
            </Suspense>
          }
        />
        <Route
          path="reports"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ReportsPage />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
