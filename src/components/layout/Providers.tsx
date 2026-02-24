"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { useOnboardingRedirect } from "@/hooks/useOnboardingRedirect";
import { FriendsProvider } from "@/components/friends/FriendsContext";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";

function OnboardingGuard({ children }: { children: ReactNode }) {
  useOnboardingRedirect();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FriendsProvider>
        <NotificationsProvider>
          <OnboardingGuard>{children}</OnboardingGuard>
        </NotificationsProvider>
      </FriendsProvider>
    </SessionProvider>
  );
}
