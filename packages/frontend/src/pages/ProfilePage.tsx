import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Current user profile page - Redirects to /profile/:username
 *
 * This is a placeholder. Will be migrated from src/app/profile/page.tsx in Task #11.
 */
export function ProfilePage() {
  const { user } = useAuth();

  if (!user?.username) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  return <Navigate to={`/profile/${user.username}`} replace />;
}
