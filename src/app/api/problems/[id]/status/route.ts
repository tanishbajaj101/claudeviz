/**
 * GET /api/problems/[id]/status — Check if authenticated user has solved the problem.
 *
 * Returns:
 *   {
 *     solved: boolean,
 *     solved_at: string | null  // ISO 8601 date of first accepted submission
 *   }
 *
 * If not authenticated, returns { solved: false, solved_at: null }
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id: problemId } = await params;

  if (!problemId) {
    return NextResponse.json({ error: "Problem ID required" }, { status: 400 });
  }

  // If not authenticated, return not solved
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ solved: false, solved_at: null });
  }

  const userId = session.user.dbUserId as number;

  try {
    const db = getDb();

    // Find the first accepted submission for this problem
    const submission = db
      .prepare(
        `SELECT created_at
         FROM submissions
         WHERE user_id = ? AND problem_id = ? AND status = 'Accepted'
         ORDER BY created_at ASC
         LIMIT 1`
      )
      .get(userId, problemId) as { created_at: string } | undefined;

    if (submission) {
      return NextResponse.json({
        solved: true,
        solved_at: new Date(submission.created_at).toISOString(),
      });
    }

    return NextResponse.json({ solved: false, solved_at: null });
  } catch (error) {
    console.error(`[GET /api/problems/${problemId}/status] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
