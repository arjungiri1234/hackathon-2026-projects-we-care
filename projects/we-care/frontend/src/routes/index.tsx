import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import DashboardPage from '../pages/DashboardPage'
import NewReferralPage from '../pages/NewReferralPage'
import {
  ReferralDetailPage,
  SpecialistsPage,
  PatientPortalPage,
  NotFoundPage,
} from '../pages/placeholders'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'
import { AppLayout } from '../components/layout/AppLayout'

export const router = createBrowserRouter([
  // Auth — redirect to / if already logged in
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // Doctor portal — requires auth, renders inside AppLayout
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/referrals/new', element: <NewReferralPage /> },
          { path: '/referrals/:id', element: <ReferralDetailPage /> },
          { path: '/specialists', element: <SpecialistsPage /> },
        ],
      },
    ],
  },

  // Patient portal — token-gated, no auth
  { path: '/p/:token', element: <PatientPortalPage /> },

  // Fallback
  { path: '*', element: <NotFoundPage /> },
])
