import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { Role } from '../types/roles';
import { hasRole } from '../types/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[]; // Optional: if not provided, only checks authentication
}

// this page is for loading the ui and not the sidebar, for sidebar look into the sidebar and roles.ts inside the types
/**
 * ProtectedRoute component - guards routes that require authentication and specific roles
 * If user is not authenticated, redirects to /login
 * If user doesn't have required role, redirects to /unauthorized
 * If authenticated and authorized, renders the child component
 * 
 * 
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => { // here allowedRoles is coming from App.tsx where it is passed as a prop in the protected route, if manager and here it is going to make the match and corresponding ui is loaded.
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !hasRole(user?.role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
