/**
 * Application Routes
 *
 * All pages are lazy-loaded so each route gets its own JS chunk.
 * This keeps the initial bundle small — landing page visitors never
 * download Three.js, garden code, or any other page-specific libraries.
 */

import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { GuestRoute } from '../components/auth/GuestRoute';
import { GardenRoute } from '../components/auth/GardenRoute';
import { RootLayout } from '../components/layout/RootLayout';
import { PageLoader } from '../components/common/PageLoader';

// ── Lazy page imports ────────────────────────────────────────────────────────
const LandingPage        = React.lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage          = React.lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage       = React.lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const MyGardensPage      = React.lazy(() => import('../pages/MyGardensPage').then(m => ({ default: m.MyGardensPage })));
const GardenPage         = React.lazy(() => import('../pages/GardenPage').then(m => ({ default: m.GardenPage })));
const PricingPage        = React.lazy(() => import('../pages/PricingPage').then(m => ({ default: m.PricingPage })));
const PricingSuccessPage = React.lazy(() => import('../pages/PricingSuccessPage').then(m => ({ default: m.PricingSuccessPage })));
const ProfilePage        = React.lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const PrivacyPage        = React.lazy(() => import('../pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage          = React.lazy(() => import('../pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ContactPage        = React.lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogPage           = React.lazy(() => import('../pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage       = React.lazy(() => import('../pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));

// ── Wrap a lazy element with Suspense ────────────────────────────────────────
function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      {
        path: '/',
        element: withSuspense(<LandingPage />),
      },

      // Auth routes (only accessible when logged out)
      {
        path: '/auth/login',
        element: withSuspense(
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: '/auth/register',
        element: withSuspense(
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },

      // Protected routes (require authentication)
      {
        path: '/my-gardens',
        element: withSuspense(
          <ProtectedRoute>
            <MyGardensPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/garden/:gardenId',
        element: withSuspense(
          <GardenRoute>
            <GardenPage />
          </GardenRoute>
        ),
      },
      {
        path: '/garden/:gardenId/flower/:flowerId',
        element: withSuspense(
          <GardenRoute>
            <GardenPage />
          </GardenRoute>
        ),
      },

      // Pricing (public)
      {
        path: '/pricing',
        element: withSuspense(<PricingPage />),
      },

      // Pricing success (after Stripe checkout) — public so Stripe redirect always lands
      {
        path: '/pricing/success',
        element: withSuspense(<PricingSuccessPage />),
      },

      // Alias: backend redirects to /subscription/success
      {
        path: '/subscription/success',
        element: withSuspense(<PricingSuccessPage />),
      },

      // Profile (protected)
      {
        path: '/profile',
        element: withSuspense(
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      // Blog (public)
      {
        path: '/blog',
        element: withSuspense(<BlogPage />),
      },
      {
        path: '/blog/:slug',
        element: withSuspense(<BlogPostPage />),
      },

      // Legal & contact (public)
      {
        path: '/privacy',
        element: withSuspense(<PrivacyPage />),
      },
      {
        path: '/terms',
        element: withSuspense(<TermsPage />),
      },
      {
        path: '/contact',
        element: withSuspense(<ContactPage />),
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
