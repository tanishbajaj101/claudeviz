"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserProfile, UserSubmission } from "@/types";
import { getUserProfile, saveSubmission } from "@/lib/submissions";

interface UseSubmissionsReturn {
  profile: UserProfile;
  solvedProblems: string[];
  recordSubmission: (problemId: string, submission: UserSubmission) => void;
}

export function useSubmissions(): UseSubmissionsReturn {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const [profile, setProfile] = useState<UserProfile>({
    solvedProblems: [],
    submissions: [],
  });

  // Load from localStorage on mount / when email changes
  useEffect(() => {
    if (email) {
      setProfile(getUserProfile(email));
    }
  }, [email]);

  const recordSubmission = useCallback(
    (problemId: string, submission: UserSubmission) => {
      if (!email) return;
      const updated = saveSubmission(email, problemId, submission);
      setProfile(updated);
    },
    [email]
  );

  return {
    profile,
    solvedProblems: profile.solvedProblems,
    recordSubmission,
  };
}
