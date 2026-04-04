import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserProfile, UserSubmission } from "@/types";
import { api } from "../lib/api-client";

interface UseSubmissionsReturn {
  profile: UserProfile;
  solvedProblems: string[];
  recordSubmission: (problemId: string, submission: UserSubmission) => Promise<{ xp_awarded: number | null }>;
  loading: boolean;
  lastXpAward: number | null;
  clearLastXpAward: () => void;
}

interface SubmissionsResponse {
  solvedProblems: string[];
  submissions: UserSubmission[];
}

interface RecordSubmissionResponse {
  solvedProblems: string[];
  xp_awarded?: number;
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
        const data = await api.get<SubmissionsResponse>("/api/problems/submissions");
        setProfile({
          solvedProblems: data.solvedProblems,
          submissions: data.submissions,
        });
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
        const data = await api.post<RecordSubmissionResponse>("/api/problems/submissions", {
          problemId,
          status: submission.status,
          time: submission.time,
          memory: submission.memory,
        });

        console.log('[useSubmissions] Submission saved, solved problems:', data.solvedProblems);
        setProfile((prev) => ({
          solvedProblems: data.solvedProblems,
          submissions: [submission, ...prev.submissions],
        }));
        if (data.xp_awarded) {
          setLastXpAward(data.xp_awarded);
        }
        return { xp_awarded: data.xp_awarded ?? null };
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
