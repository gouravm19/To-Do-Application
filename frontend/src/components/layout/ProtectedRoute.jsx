import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const location = useLocation();

  // Check if token exists
  const hasToken = checkAuth();

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
