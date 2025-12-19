import { createBrowserRouter, Outlet, redirect, Navigate, useLocation } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { PatientsList } from './pages/app/patients/patients-list'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { AppointmentsRoom } from './pages/app/video-room/appoinmets-room'
import { AppointmentsList } from './pages/app/appointment/appointment-list'
import { MockPsychologistProfilePage } from './pages/app/account/account'
import { LandingPage } from './pages/landing-page/landing-page'
import { DashboardFinance } from './pages/app/finance/dashboard-finance'

function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
const authLoader = () => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (!isAuthenticated) {
    return redirect('/sign-in')
  }
  return null
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  // GRUPO 1: Landing Page (Com Header)
  {
    path: '/',
    element: <LandingLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
    ],
  },

  // GRUPO 2: Autenticação
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },

  // GRUPO 3: Aplicação Logada
  {
    path: '/',

    loader: authLoader,
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      // {
      //   path: '/dashboard-finance',
      //   element: <DashboardFinance />,
      // },
      {
        path: '/patients-list',
        element: <PatientsList />,
      },
      {
        path: '/video-room',
        element: <AppointmentsRoom />,
      },
      {
        path: '/appointment',
        element: <AppointmentsList />,
      },
      {
        path: '/account',
        element: <MockPsychologistProfilePage />,
      },
      {
        path: '/perfil',
        element: <MockPsychologistProfilePage />,
      },
    ],
  },
])