import { createBrowserRouter, Outlet, redirect, Navigate, useLocation } from 'react-router-dom'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { PatientsList } from './pages/app/patients/patients-list'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { AppointmentsRoom } from './pages/app/video-room/appoinmets-room'
import { AppointmentsList } from './pages/app/appointment/appointment-list/appointment-list'
import { MockPsychologistProfilePage } from './pages/app/account/account'
import { LandingPage } from './pages/landing-page/landing-page'
import { DashboardFinance } from './pages/app/finance/dashboard-finance'
import { AdminApprovalsPage } from './pages/app/admin/approvals/approvals'
import { AvailabilityPage } from './pages/app/appointment/availability-page/availability-page'
import { SuggestionPage } from './pages/app/suggestion/suggestion-page'
import { AdminDashboard } from './pages/app/admin/dashboard/admin-dashboard'
import { AdminSuggestionsPage } from './pages/app/admin/suggestions/suggestions-page'
import { SuggestionsManagement } from './pages/app/admin/suggestions/suggestions-management'

const getUser = () => {
  const userData = localStorage.getItem('user')
  if (!userData || userData === 'undefined' || userData === 'null') return null

  try {
    const user = JSON.parse(userData)
    const roleValue = typeof user.role === 'object' && user.role !== null
      ? user.role.name
      : user.role

    return {
      ...user,
      role: roleValue ? String(roleValue).trim().toUpperCase() : undefined
    }
  } catch {
    return null
  }
}

const authLoader = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (!isAuthenticated) {
    return redirect('/sign-in')
  }
  return null
}

const adminLoader = () => {
  const user = getUser()
  if (!user || user.role !== 'SUPER_ADMIN') {
    return redirect('/dashboard')
  }
  return null
}

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole?: string
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const user = getUser()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <LandingPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    loader: authLoader,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/dashboard-finance', element: <DashboardFinance /> },
      { path: '/patients-list', element: <PatientsList /> },
      { path: '/video-room', element: <AppointmentsRoom /> },
      { path: '/appointment', element: <AppointmentsList /> },
      { path: '/availability', element: <AvailabilityPage /> },
      { path: '/account', element: <MockPsychologistProfilePage /> },
      {
        path: '/approvals',
        loader: adminLoader,
        element: (
          <ProtectedRoute allowedRole="SUPER_ADMIN">
            <AdminApprovalsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin-dashboard',
        loader: adminLoader,
        element: (
          <ProtectedRoute allowedRole="SUPER_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin-suggestions',
        loader: adminLoader,
        element: (
          <ProtectedRoute allowedRole="SUPER_ADMIN">
            <AdminSuggestionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/menagement-suggestions',
        element: (
          <ProtectedRoute allowedRole="SUPER_ADMIN">
            <SuggestionsManagement />
          </ProtectedRoute>
        ),
      },

      { path: '/suggestion', element: <SuggestionPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])