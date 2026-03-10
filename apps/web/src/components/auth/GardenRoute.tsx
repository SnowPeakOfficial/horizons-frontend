/**
 * GardenRoute — smart route guard for garden pages.
 *
 * Allows access if:
 *  1. The user is authenticated, OR
 *  2. The URL contains ?token=... (guest email-link access)
 *
 * In all other cases, redirects to /auth/login.
 */

import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface GardenRouteProps {
  children: React.ReactNode;
}

export const GardenRoute: React.FC<GardenRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchParams] = useSearchParams();
  const hasGuestToken = !!searchParams.get('token');

  // Allow through: authenticated users OR guests with a valid token
  if (isAuthenticated || hasGuestToken) {
    return <>{children}</>;
  }

  return <Navigate to="/auth/login" replace />;
};
