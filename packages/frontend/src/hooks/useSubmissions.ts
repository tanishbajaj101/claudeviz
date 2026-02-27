import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserProfile, UserSubmission } from "@/types";

interface UseSubmissionsReturn {
  profile: UserProfile;
  solvedProblems: string[];
  recordSubmission: (problemId: string, submission: UserSubmission) => Promise<void>;
  loading: boolean;
}

export function useSubmissions(): UseSubmissionsReturn {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile>({
    solvedProblems: [],
    submissions: [],
  });
  const [loading, setLoading] = useState(true);

  // Load from API on mount / when user changes
  useEffect(() => {
    async function fetchSubmissions() {
      if (!user?.dbUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/submissions");
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
  }, [user?.dbUserId]);

  const recordSubmission = useCallback(
    async (problemId: string, submission: UserSubmission) => {
      if (!user?.dbUserId) return;

      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemId,
            status: submission.status,
            time: submission.time,
            memory: submission.memory,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setProfile((prev) => ({
            solvedProblems: data.solvedProblems,
            submissions: [submission, ...prev.submissions],
          }));
        }
      } catch (error) {
        console.error("Failed to record submission:", error);
      }
    },
    [user?.dbUserId]
  );

  return {
    profile,
    solvedProblems: profile.solvedProblems,
    recordSubmission,
    loading,
  };
}
