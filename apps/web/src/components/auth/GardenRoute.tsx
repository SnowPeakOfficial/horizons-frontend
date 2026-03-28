/**
 * GardenRoute — smart route guard for garden pages.
 *
 * Allows access if:
 *  1. The user is authenticated, OR
 *  2. The URL contains ?token=... (guest email-link access)
 *
 * In all other cases, redirects to /auth/login with a ?redirect= param
 * so the user is returned to the original letter URL after logging in.
 */

import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface GardenRouteProps {
  children: React.ReactNode;
}

export const GardenRoute: React.FC<GardenRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tokenParam = searchParams.get('token');
  // Token must be a non-empty string (not just '?token=')
  const hasGuestToken = typeof tokenParam === 'string' && tokenParam.trim().length > 0;

  // Allow through: authenticated users OR guests with a valid token
  if (isAuthenticated || hasGuestToken) {
    return <>{children}</>;
  }

  // Preserve the full original URL so LoginPage can redirect back after login
  const redirectTo = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/auth/login?redirect=${redirectTo}`} replace />;
};
