import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserProfile, UserSubmission } from "@/types";

interface UseSubmissionsReturn {
  profile: UserProfile;
  solvedProblems: string[];
  recordSubmission: (problemId: string, submission: UserSubmission) => Promise<{ xp_awarded: number | null }>;
  loading: boolean;
  lastXpAward: number | null;
  clearLastXpAward: () => void;
}

export function useSubmissions(): UseSubmissionsReturn {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile>({
    solvedProblems: [],
    submissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastXpAward, setLastXpAward] = useState<number | null>(null);

  // Load from API on mount / when user changes
  useEffect(() => {
    async function fetchSubmissions() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/problems/submissions");
        if (response.ok) {
          const data = await response.json();
          setProfile({
            solvedProblems: data.solvedProblems,
            submissions: data.submissions,
          });
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [user?.id]);

  const recordSubmission = useCallback(
    async (problemId: string, submission: UserSubmission): Promise<{ xp_awarded: number | null }> => {
      console.log('[useSubmissions] recordSubmission called', {
        problemId,
        status: submission.status,
        hasUser: !!user,
        userId: user?.id
      });

      if (!user?.id) {
        console.warn('[useSubmissions] No user ID - skipping submission recording');
        return { xp_awarded: null };
      }

      try {
        console.log('[useSubmissions] Sending POST /api/problems/submissions...');
        const response = await fetch("/api/problems/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemId,
            status: submission.status,
            time: submission.time,
            memory: submission.memory,
          }),
        });

        console.log('[useSubmissions] Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[useSubmissions] Submission saved, solved problems:', data.solvedProblems);
          setProfile((prev) => ({
            solvedProblems: data.solvedProblems,
            submissions: [submission, ...prev.submissions],
          }));
          if (data.xp_awarded) {
            setLastXpAward(data.xp_awarded);
          }
          return { xp_awarded: data.xp_awarded ?? null };
        } else {
          const error = await response.text();
          console.error('[useSubmissions] Failed to save submission:', response.status, error);
        }
      } catch (error) {
        console.error("[useSubmissions] Failed to record submission:", error);
      }
      return { xp_awarded: null };
    },
    [user?.id]
  );

  return {
    profile,
    solvedProblems: profile.solvedProblems,
    recordSubmission,
    loading,
    lastXpAward,
    clearLastXpAward: () => setLastXpAward(null),
  };
}
