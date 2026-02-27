

import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Home, User, Trophy, Users, Bell } from "lucide-react";
import { useFriends } from "../../components/friends/FriendsContext";
import { NotificationsDropdown } from "../../components/notifications/NotificationsDropdown";

export function Navbar() {
  const { user, signIn, signOut } = useAuth();
  const { toggleSidebar, unreadChatCount } = useFriends();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 font-mono text-sm font-bold text-zinc-950">
              AA
            </div>
            <span className="font-mono text-lg font-semibold tracking-tight text-zinc-100">
              AlgoArena
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/contests"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Trophy className="h-4 w-4" />
                <span>Contests</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Friends icon with real-time unread badge */}
              <button
                onClick={toggleSidebar}
                className="relative rounded-md p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Friends and messages"
              >
                <Users className="h-5 w-5" />
                {unreadChatCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadChatCount > 9 ? "9+" : unreadChatCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              <NotificationsDropdown />

              {/* User menu */}
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                {user.username && (
                  <img
                    src={`/api/users/avatar?username=${user.username}`}
                    alt="User Avatar"
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="font-mono">{user.username}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-md border border-zinc-700 px-3 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="rounded-md bg-emerald-600 px-4 py-1.5 font-mono text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
