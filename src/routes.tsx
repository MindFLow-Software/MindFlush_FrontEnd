import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { PatientsList } from './pages/app/patients/patients-list/patients-list'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { VideoRoom } from './pages/app/video-room/video-room'
import { AppointmentsPage } from './pages/app/appointment/appointment-list'
import { MockPsychologistProfilePage } from './pages/app/account/account'

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
        path: '/patients-list',
        element: <PatientsList />,
      },
      {
        path: '/video-room',
        element: <VideoRoom />,
      },
      {
        path: '/appointment',
        element: <AppointmentsPage />,
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