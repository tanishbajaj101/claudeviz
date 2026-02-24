"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProfileClient } from "@/components/profile/ProfileClient";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Redirect to username-based profile if authenticated
    if (status === "authenticated" && session?.user?.username) {
      router.push(`/profile/${session.user.username}`);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="font-mono text-sm text-zinc-500">Loading...</p>
      </main>
    );
  }

  // While redirecting, show the profile client
  return <ProfileClient />;
}
