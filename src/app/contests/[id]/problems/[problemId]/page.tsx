"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getProblemById } from "@/lib/problems";
import { getContestStatus } from "@/lib/contest-status";
import { ContestProblemWorkspace } from "@/components/contests/ContestProblemWorkspace";

interface ContestData {
  contest: {
    id: string;
    title: string;
    starts_at: string;
    duration_minutes: number;
    is_participant: boolean;
    conversation_id?: string;
  };
}

export default function ContestProblemPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const contestId = params?.id as string;
  const problemId = params?.problemId as string;

  const [contestData, setContestData] = useState<ContestData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get problem from static data
  const problem = getProblemById(problemId);

  useEffect(() => {
    if (!contestId) return;

    // Fetch contest data to verify participation and get timing
    fetch(`/api/contests/${contestId}`)
      .then((res) => res.json())
      .then((data) => {
        setContestData(data);
        setLoading(false);

        // Redirect if not a participant
        if (!data.contest.is_participant) {
          router.push(`/contests/${contestId}`);
        }
      })
      .catch((err) => {
        console.error("[ContestProblemPage] Error:", err);
        setLoading(false);
      });
  }, [contestId, router]);

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!problem || !contestData) {
    return notFound();
  }

  const status = getContestStatus(
    contestData.contest.starts_at,
    contestData.contest.duration_minutes
  );

  // Redirect if contest has ended
  if (status === "completed") {
    router.push(`/contests/${contestId}`);
    return null;
  }

  return (
    <ContestProblemWorkspace
      problem={problem}
      contestId={contestId}
      contestTitle={contestData.contest.title}
      contestStartsAt={contestData.contest.starts_at}
      contestDuration={contestData.contest.duration_minutes}
      conversationId={contestData.contest.conversation_id}
    />
  );
}
