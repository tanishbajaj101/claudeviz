

import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Home, User, Trophy, Users, Bell, MessageSquare } from "lucide-react";
import { useFriends } from "../../components/friends/FriendsContext";
import { NotificationsDropdown } from "../../components/notifications/NotificationsDropdown";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { user, signIn, signOut } = useAuth();
  const { toggleSidebar, unreadChatCount } = useFriends();

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-zinc-950">
              AA
            </div>
            <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
              AlgoArena
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              <Link
                to="/messages"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground relative"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
                {unreadChatCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadChatCount > 9 ? "9+" : unreadChatCount}
                  </span>
                )}
              </Link>

              <Link
                to="/contests"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
                className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* User menu */}
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
                className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-zinc-500 hover:text-foreground"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="rounded-md bg-primary px-4 py-1.5 font-mono text-sm font-medium text-white transition-colors hover:bg-primary"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
