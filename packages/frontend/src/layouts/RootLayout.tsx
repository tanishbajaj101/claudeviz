import { Outlet } from 'react-router-dom';
import { Providers } from '../components/layout/Providers';
import { Navbar } from '../components/layout/Navbar';
import { FriendsSidebar } from '../components/friends/FriendsSidebar';

/**
 * Root layout component that wraps all pages.
 *
 * Equivalent to Next.js app/layout.tsx:
 * - Provides global context (Providers)
 * - Renders Navbar on all pages
 * - Renders FriendsSidebar on all pages
 * - Uses Outlet for nested routes
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      <Providers>
        <Navbar />
        <FriendsSidebar />
        <Outlet />
      </Providers>
    </div>
  );
}
