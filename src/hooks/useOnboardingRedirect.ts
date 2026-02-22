"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export function useOnboardingRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // If user is new and not on onboarding page, redirect to onboarding
    if (session?.user?.isNewUser && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [session?.user?.isNewUser, pathname, router, status]);
}
