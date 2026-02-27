import { createBrowserRouter, Outlet } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Lazy-loaded page components (will be created in Task #11)
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProblemPage } from './pages/ProblemPage';
import { ContestsPage } from './pages/ContestsPage';
import { ContestDetailPage } from './pages/ContestDetailPage';
import { ContestProblemPage } from './pages/ContestProblemPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { PublicProfilePage } from './pages/PublicProfilePage';

/**
 * React Router configuration for AlgoArena.
 *
 * Routes mapped from Next.js App Router structure:
 * - / → Home (problem list)
 * - /auth/signin → Sign in page
 * - /onboarding → Onboarding (after first sign-in)
 * - /problems/:id → Problem workspace
 * - /contests → Contest list
 * - /contests/:id → Contest detail + leaderboard + discussion
 * - /contests/:contestId/problems/:problemId → Contest problem workspace
 * - /messages → Conversations page
 * - /profile → Current user profile (redirect to /profile/:username)
 * - /profile/:username → Public profile page
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      {
        path: 'auth/signin',
        element: <SignInPage />,
      },

      // Protected routes (require authentication)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: 'onboarding',
            element: <OnboardingPage />,
          },
          {
            path: 'problems/:id',
            element: <ProblemPage />,
          },
          {
            path: 'contests',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <ContestsPage />,
              },
              {
                path: ':id',
                element: <ContestDetailPage />,
              },
              {
                path: ':contestId/problems/:problemId',
                element: <ContestProblemPage />,
              },
            ],
          },
          {
            path: 'messages',
            element: <MessagesPage />,
          },
          {
            path: 'profile',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <ProfilePage />,
              },
              {
                path: ':username',
                element: <PublicProfilePage />,
              },
            ],
          },
        ],
      },

      // Catch-all 404
      {
        path: '*',
        element: (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-zinc-100">404</h1>
              <p className="mt-2 text-zinc-400">Page not found</p>
            </div>
          </div>
        ),
      },
    ],
  },
]);
