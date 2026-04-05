import { Outlet } from 'react-router-dom';
import { Providers } from '../components/layout/Providers';
import { Navbar } from '../components/layout/Navbar';
import { FriendsSidebar } from '../components/friends/FriendsSidebar';
import { FireThemeEffect } from '../components/layout/FireThemeEffect';

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
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Providers>
        <FireThemeEffect />
        <Navbar />
        <FriendsSidebar />
        <Outlet />
      </Providers>
    </div>
  );
}
