import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import {
  DashboardPage,
  NewReferralPage,
  ReferralDetailPage,
  SpecialistsPage,
  PatientPortalPage,
  NotFoundPage,
} from '../pages/placeholders'

export const router = createBrowserRouter([
  // Auth
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },

  // Doctor portal
  { path: '/', element: <DashboardPage /> },
  { path: '/referrals/new', element: <NewReferralPage /> },
  { path: '/referrals/:id', element: <ReferralDetailPage /> },
  { path: '/specialists', element: <SpecialistsPage /> },

  // Patient portal — token-gated, no auth
  { path: '/p/:token', element: <PatientPortalPage /> },

  // Fallback
  { path: '*', element: <NotFoundPage /> },
])
