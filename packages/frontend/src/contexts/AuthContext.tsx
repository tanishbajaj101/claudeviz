import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, ApiError } from '../lib/api-client';

/**
 * AuthContext - JWT-based authentication replacing NextAuth.
 *
 * Authentication flow:
 * 1. User clicks "Sign in with Google" → redirects to /api/auth/google
 * 2. Backend handles OAuth → sets httpOnly cookie → redirects to frontend
 * 3. Frontend calls /api/auth/session to get user data
 * 4. User state is stored in context and persisted via httpOnly cookie
 *
 * The JWT token is stored in an httpOnly cookie by the backend, so it's not
 * accessible to JavaScript (security best practice). We rely on the backend
 * to validate the cookie on each request.
 */

export interface User {
  id?: number;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  isPending?: boolean;
  isNewUser?: boolean;
}

interface SessionResponse {
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Fetch current user session from backend.
   * Called on mount and after sign-in.
   */
  const fetchSession = useCallback(async (): Promise<boolean> => {
    try {
      const data = await api.get<SessionResponse>('/api/auth/session');
      setUser(data.user);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Not authenticated
        setUser(null);
        return false;
      }
      console.error('Failed to fetch session:', error);
      setUser(null);
      return false;
    }
  }, []);

  /**
   * Initialize auth state on mount.
   * Check for token in URL (from onboarding redirect) or fetch session.
   */
  useEffect(() => {
    const initAuth = async () => {
      // Check if we have a token in URL (from OAuth callback or onboarding)
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        // Token is in URL (OAuth callback or onboarding).
        // Save to localStorage so cross-site fetches work on Safari/Firefox
        // (those browsers block sameSite=none cookies from railway.app on vercel.app).
        localStorage.setItem('auth-token', token);
        await fetchSession();

        // Clean up URL
        params.delete('token');
        const newSearch = params.toString();
        const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
        window.history.replaceState({}, '', newUrl);
      } else {
        // Normal flow - try to fetch session from existing cookie
        await fetchSession();
      }

      setLoading(false);
    };

    initAuth();
  }, [fetchSession, location.search, location.pathname]);

  /**
   * Initiate Google OAuth sign-in.
   * Redirects to backend OAuth endpoint.
   */
  const signIn = useCallback(() => {
   let apiUrl = import.meta.env.VITE_API_URL || '';

   // Ensure apiUrl is absolute if it looks like a domain (no protocol and doesn't start with /)
   if (apiUrl && !apiUrl.startsWith('http') && !apiUrl.startsWith('/')) {
     apiUrl = `https://${apiUrl}`;
   }

   window.location.href = `${apiUrl}/api/auth/google`;
  }, []);
  /**
   * Sign out the user.
   * Clears the httpOnly cookie via backend and resets local state.
   */
  const signOut = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }

    localStorage.removeItem('auth-token');
    setUser(null);
    navigate('/auth/signin');
  }, [navigate]);

  /**
   * Refresh user data from backend.
   * Useful after profile updates.
   */
  const refreshUser = useCallback(async () => {
    await fetchSession();
  }, [fetchSession]);

  const value: AuthContextValue = {
    user,
    loading,
    signIn,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
