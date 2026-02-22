import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getSubmissionsByUserId,
  getSolvedProblemsByUserId,
  createSubmission,
} from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = getSubmissionsByUserId(session.user.dbUserId);
  const solvedProblems = getSolvedProblemsByUserId(session.user.dbUserId);

  // Convert to UserSubmission format
  const formattedSubmissions = submissions.map((s) => ({
    problemId: s.problem_id,
    timestamp: s.created_at,
    status: s.status,
    time: s.time,
    memory: s.memory,
  }));

  return NextResponse.json({
    submissions: formattedSubmissions,
    solvedProblems,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { problemId, status, time, memory } = body;

  if (!problemId || !status) {
    return NextResponse.json(
      { error: "problemId and status are required" },
      { status: 400 }
    );
  }

  const submission = createSubmission({
    userId: session.user.dbUserId,
    problemId,
    status,
    time,
    memory,
  });

  // Return updated solved problems
  const solvedProblems = getSolvedProblemsByUserId(session.user.dbUserId);

  return NextResponse.json({
    submission,
    solvedProblems,
  });
}
