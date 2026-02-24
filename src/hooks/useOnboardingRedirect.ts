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

    // If user is NOT new and on onboarding page, redirect to home
    if (session?.user?.isNewUser === false && pathname === "/onboarding") {
      router.push("/");
    }
  }, [session?.user?.isNewUser, pathname, router, status]);
}
