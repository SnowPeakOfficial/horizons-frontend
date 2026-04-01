/**
 * Application Routes
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { MyGardensPage } from '../pages/MyGardensPage';
import { GardenPage } from '../pages/GardenPage';
import { PricingPage } from '../pages/PricingPage';
import { PricingSuccessPage } from '../pages/PricingSuccessPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { GuestRoute } from '../components/auth/GuestRoute';
import { GardenRoute } from '../components/auth/GardenRoute';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { ContactPage } from '../pages/ContactPage';
import { BlogPage } from '../pages/BlogPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { RootLayout } from '../components/layout/RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      {
        path: '/',
        element: <LandingPage />,
      },

      // Auth routes (only accessible when logged out)
      {
        path: '/auth/login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: '/auth/register',
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },

      // Protected routes (require authentication)
      {
        path: '/my-gardens',
        element: (
          <ProtectedRoute>
            <MyGardensPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/garden/:gardenId',
        element: (
          <GardenRoute>
            <GardenPage />
          </GardenRoute>
        ),
      },
      {
        path: '/garden/:gardenId/flower/:flowerId',
        element: (
          <GardenRoute>
            <GardenPage />
          </GardenRoute>
        ),
      },

      // Pricing (public)
      {
        path: '/pricing',
        element: <PricingPage />,
      },

      // Pricing success (after Stripe checkout) — public so Stripe redirect always lands
      {
        path: '/pricing/success',
        element: <PricingSuccessPage />,
      },

      // Alias: backend redirects to /subscription/success
      {
        path: '/subscription/success',
        element: <PricingSuccessPage />,
      },

      // Profile (protected)
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      // Blog (public)
      {
        path: '/blog',
        element: <BlogPage />,
      },
      {
        path: '/blog/:slug',
        element: <BlogPostPage />,
      },

      // Legal & contact (public)
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/terms',
        element: <TermsPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },

      // Legacy route redirect
      {
        path: '/dashboard',
        element: <Navigate to="/my-gardens" replace />,
      },

      // Settings → Profile redirect
      {
        path: '/settings',
        element: <Navigate to="/profile" replace />,
      },
      {
        path: '/settings/notifications',
        element: <Navigate to="/profile" replace />,
      },

      // Catch-all redirect
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
