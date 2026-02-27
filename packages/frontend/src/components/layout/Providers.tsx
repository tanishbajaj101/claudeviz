

import { AuthProvider } from "../../contexts/AuthContext";
import { ReactNode } from "react";
import { useOnboardingRedirect } from "../../hooks/useOnboardingRedirect";
import { FriendsProvider } from "../../components/friends/FriendsContext";
import { NotificationsProvider } from "../../components/notifications/NotificationsProvider";
import { ToastNotifications } from "../../components/notifications/ToastNotifications";

function OnboardingGuard({ children }: { children: ReactNode }) {
  useOnboardingRedirect();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FriendsProvider>
        <NotificationsProvider>
          <OnboardingGuard>{children}</OnboardingGuard>
          <ToastNotifications />
        </NotificationsProvider>
      </FriendsProvider>
    </AuthProvider>
  );
}
