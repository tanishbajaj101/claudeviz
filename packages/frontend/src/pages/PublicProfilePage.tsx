import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProfileClient } from '../components/profile/ProfileClient';

/**
 * Public profile page - fetches user by username and renders ProfileClient
 */
export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    const fetchUserByUsername = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user ID by username
        const res = await fetch(`/api/users/by-username/${encodeURIComponent(username)}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('User not found');
          } else {
            setError('Failed to fetch user');
          }
          return;
        }

        const data = await res.json();
        setUserId(data.id);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserByUsername();
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error || !userId) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="mt-2 text-muted-foreground">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return <ProfileClient userId={userId} />;
}
