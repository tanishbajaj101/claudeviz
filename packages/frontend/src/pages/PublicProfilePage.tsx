import { useParams } from 'react-router-dom';

/**
 * Public profile page
 *
 * This is a placeholder. Will be migrated from src/app/profile/[username]/page.tsx in Task #11.
 */
export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">@{username}</h1>
      <p className="mt-2 text-zinc-400">Profile loading...</p>
    </div>
  );
}
