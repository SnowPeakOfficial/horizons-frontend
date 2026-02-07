/**
 * Application Routes
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { MyGardensPage } from '../pages/MyGardensPage';
import { GardenPage } from '../pages/GardenPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { GuestRoute } from '../components/auth/GuestRoute';

export const router = createBrowserRouter([
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
      <ProtectedRoute>
        <GardenPage />
      </ProtectedRoute>
    ),
  },
  
  // Legacy route redirect
  {
    path: '/dashboard',
    element: <Navigate to="/my-gardens" replace />,
  },
  
  // Catch-all redirect
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
