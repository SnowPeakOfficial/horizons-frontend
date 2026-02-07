/**
 * Guest Route Component
 * Redirects to dashboard if user is already authenticated
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/my-gardens" replace />;
  }

  return <>{children}</>;
};
