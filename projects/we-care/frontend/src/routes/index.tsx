import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import DashboardPage from "../pages/DashboardPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import NewReferralPage from "../pages/NewReferralPage";
import PatientBookingPage from "../pages/PatientBookingPage";
import PatientBookingReviewPage from "../pages/PatientBookingReviewPage";
import PatientPortalPage from "../pages/PatientPortalPage";
import { NotFoundPage } from "../pages/placeholders";
import ReferralDetailPage from "../pages/ReferralDetailPage";
import SettingsPage from "../pages/SettingsPage";
import SignupPage from "../pages/SignupPage";
import SpecialistsPage from "../pages/SpecialistsPage";
import { GuestRoute } from "./GuestRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  // Auth — redirect to / if already logged in
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },

  // Doctor portal — requires auth, renders inside AppLayout
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/referrals/new", element: <NewReferralPage /> },
          { path: "/referrals/:id", element: <ReferralDetailPage /> },
          { path: "/specialists", element: <SpecialistsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },

  // Patient portal — token-gated, no auth
  { path: "/p/:token", element: <PatientPortalPage /> },
  { path: "/p/:token/book", element: <PatientBookingPage /> },
  { path: "/p/:token/review", element: <PatientBookingReviewPage /> },
  { path: "/patient/:token", element: <PatientPortalPage /> },
  { path: "/patient/:token/book", element: <PatientBookingPage /> },
  { path: "/patient/:token/review", element: <PatientBookingReviewPage /> },

  // Fallback
  { path: "*", element: <NotFoundPage /> },
]);
