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
import { prisma } from "@/lib/prisma";

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
    // Find the first accepted submission for this problem
    const submission = await prisma.submission.findFirst({
      where: {
        user_id: userId,
        problem_id: problemId,
        status: "Accepted",
      },
      orderBy: { created_at: "asc" },
      select: { created_at: true },
    });

    if (submission) {
      return NextResponse.json({
        solved: true,
        solved_at: submission.created_at.toISOString(),
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
