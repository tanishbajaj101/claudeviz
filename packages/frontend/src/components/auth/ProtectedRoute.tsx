import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Protected route wrapper that requires authentication.
 *
 * Redirects to /auth/signin if user is not authenticated.
 * Shows loading state while checking authentication.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}
