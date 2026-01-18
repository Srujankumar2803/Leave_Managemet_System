import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode; // indicates that it should be of the type react component omly. [where it is below passed as prop]
}

/**
 * ProtectedRoute component - guards routes that require authentication
 * If user is not authenticated, redirects to /login
 * If authenticated, renders the child component
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => { // here chilildren is prop and its type is defined in interface above where ProtectedRouteProps means it should be of the type react component only.
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // see AuthSlice.ts for isAuthenticated state, when logout is clicked, isauthenticated becomes false and it navigates to login page.
  }

  return <>{children}</>; // if authenticated, it returns the child component which is passed as prop.
};

export default ProtectedRoute;
