"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { useOnboardingRedirect } from "@/hooks/useOnboardingRedirect";

function OnboardingGuard({ children }: { children: ReactNode }) {
  useOnboardingRedirect();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <OnboardingGuard>{children}</OnboardingGuard>
    </SessionProvider>
  );
}
