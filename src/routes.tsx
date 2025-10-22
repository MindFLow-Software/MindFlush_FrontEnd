import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { PatientsList } from './pages/app/patients/patients-list/patients-list'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { NewPatients } from './pages/app/patients/new-patients/new-patients'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/new-patients',
        element: <NewPatients />,
      },
      {
        path: '/patients-list',
        element: <PatientsList />,
      },
    ],
  },
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
])