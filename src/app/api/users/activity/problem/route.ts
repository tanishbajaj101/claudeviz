/**
 * POST /api/users/activity/problem
 *
 * Track that the authenticated user has opened a problem page.
 * Updates `last_opened_problem_id` and `last_active` on the user record.
 *
 * Request body:
 *   { problem_id: string }
 *
 * Response:
 *   { success: true }
 *
 * Notes:
 *   - Requires authentication.
 *   - `last_opened_problem_id` and `last_active` are stored in the legacy
 *     better-sqlite3 `users` table (added via ALTER TABLE migration in
 *     src/lib/db.ts getDb()).
 *   - The problem_id is validated against the known problem list so random
 *     values cannot pollute the activity data.
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { updateLastProblem } from "@/lib/db";
import { problems } from "@/data/problems";

interface ActivityBody {
  problem_id: unknown;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  let body: ActivityBody;
  try {
    body = (await req.json()) as ActivityBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { problem_id } = body;

  if (typeof problem_id !== "string" || problem_id.trim().length === 0) {
    return NextResponse.json(
      { error: "problem_id must be a non-empty string" },
      { status: 400 }
    );
  }

  // Validate that the problem_id exists in the known problem set
  const knownProblem = problems.find((p) => p.id === problem_id.trim());
  if (!knownProblem) {
    return NextResponse.json(
      { error: "Unknown problem_id" },
      { status: 404 }
    );
  }

  try {
    // updateLastProblem writes last_opened_problem_id and last_active via
    // the legacy better-sqlite3 connection. The `solved` param is accepted
    // for API compatibility but not used (solved state lives in submissions).
    updateLastProblem(userId, problem_id.trim(), false);

    console.log(
      `[POST /api/users/activity/problem] user ${userId} opened problem ${problem_id}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/users/activity/problem] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
