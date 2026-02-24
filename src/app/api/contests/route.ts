/**
 * GET  /api/contests  — List all public contests (sorted newest first)
 * POST /api/contests  — Create a new contest (authenticated)
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getContestStatus } from "@/lib/contest-status";
import {
  selectRandomProblems,
  sendContestInvites,
  type ProblemSlotSpec,
} from "@/lib/contest-helpers";
import { emitContestInviteNotifications } from "@/lib/socket/notification-helpers";

// ---------------------------------------------------------------------------
// GET /api/contests — Public contest list
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const contests = await prisma.contest.findMany({
      where: { is_public: true },
      orderBy: { created_at: "desc" },
      include: {
        creator: { select: { id: true, username: true } },
        _count: { select: { participants: true } },
      },
    });

    const formatted = contests.map((c) => ({
      id: c.id,
      title: c.title,
      creator: { id: c.creator.id, username: c.creator.username },
      starts_at: c.starts_at.toISOString(),
      duration_minutes: c.duration_minutes,
      is_public: c.is_public,
      status: getContestStatus(c.starts_at, c.duration_minutes),
      participant_count: c._count.participants,
    }));

    return NextResponse.json({ contests: formatted });
  } catch (error) {
    console.error("[GET /api/contests] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/contests — Create a contest
// ---------------------------------------------------------------------------

interface ProblemSlotInput {
  difficulty: unknown;
  topics: unknown;
}

interface CreateContestBody {
  title: unknown;
  is_public: unknown;
  starts_at: unknown;
  duration_minutes: unknown;
  problems: unknown;
  invited_user_ids?: unknown;
}

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

export async function POST(req: NextRequest) {
  // --- Auth ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creatorId = session.user.dbUserId as number;
  const creatorName = (session.user.username as string) ?? session.user.name ?? "Unknown";

  // --- Parse body ---
  let body: CreateContestBody;
  try {
    body = (await req.json()) as CreateContestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, is_public, starts_at, duration_minutes, problems: problemSlots, invited_user_ids } = body;

  // --- Validate title ---
  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "title is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  // --- Validate starts_at ---
  if (typeof starts_at !== "string") {
    return NextResponse.json(
      { error: "starts_at is required and must be an ISO 8601 datetime string" },
      { status: 400 }
    );
  }
  const startsAtDate = new Date(starts_at);
  if (isNaN(startsAtDate.getTime())) {
    return NextResponse.json(
      { error: "starts_at is not a valid ISO 8601 datetime" },
      { status: 400 }
    );
  }
  if (startsAtDate <= new Date()) {
    return NextResponse.json(
      { error: "starts_at must be in the future" },
      { status: 400 }
    );
  }

  // --- Validate duration_minutes ---
  if (
    typeof duration_minutes !== "number" ||
    !Number.isInteger(duration_minutes) ||
    duration_minutes <= 0
  ) {
    return NextResponse.json(
      { error: "duration_minutes must be a positive integer" },
      { status: 400 }
    );
  }

  // --- Validate problem slots ---
  if (!Array.isArray(problemSlots)) {
    return NextResponse.json(
      { error: "problems must be an array" },
      { status: 400 }
    );
  }
  if (problemSlots.length < 2 || problemSlots.length > 5) {
    return NextResponse.json(
      { error: "problems array must contain between 2 and 5 items" },
      { status: 400 }
    );
  }

  const validatedSlots: ProblemSlotSpec[] = [];
  for (let i = 0; i < problemSlots.length; i++) {
    const slot = problemSlots[i] as ProblemSlotInput;
    if (!slot || typeof slot !== "object") {
      return NextResponse.json(
        { error: `problems[${i}] must be an object with difficulty and topics` },
        { status: 400 }
      );
    }

    const { difficulty, topics } = slot;

    if (typeof difficulty !== "string" || !VALID_DIFFICULTIES.has(difficulty)) {
      return NextResponse.json(
        {
          error: `problems[${i}].difficulty must be one of: easy, medium, hard`,
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        {
          error: `problems[${i}].topics must be a non-empty array of topic strings`,
        },
        { status: 400 }
      );
    }
    if (!topics.every((t) => typeof t === "string" && t.trim().length > 0)) {
      return NextResponse.json(
        { error: `problems[${i}].topics must only contain non-empty strings` },
        { status: 400 }
      );
    }

    validatedSlots.push({
      difficulty: difficulty as "easy" | "medium" | "hard",
      topics: topics as string[],
    });
  }

  // --- Validate invited_user_ids (optional) ---
  let invitedUserIds: number[] = [];
  if (invited_user_ids !== undefined) {
    if (!Array.isArray(invited_user_ids)) {
      return NextResponse.json(
        { error: "invited_user_ids must be an array" },
        { status: 400 }
      );
    }
    if (!invited_user_ids.every((id) => typeof id === "number" && Number.isInteger(id))) {
      return NextResponse.json(
        { error: "invited_user_ids must be an array of integer user IDs" },
        { status: 400 }
      );
    }
    invitedUserIds = invited_user_ids as number[];

    // Verify each invited user is a friend of the creator
    if (invitedUserIds.length > 0) {
      const friendships = await prisma.friendRequest.findMany({
        where: {
          status: "accepted",
          OR: [
            { sender_id: creatorId, receiver_id: { in: invitedUserIds } },
            { receiver_id: creatorId, sender_id: { in: invitedUserIds } },
          ],
        },
      });

      const friendIds = new Set(
        friendships.flatMap((f) => [f.sender_id, f.receiver_id]).filter((id) => id !== creatorId)
      );

      const nonFriends = invitedUserIds.filter((id) => !friendIds.has(id));
      if (nonFriends.length > 0) {
        return NextResponse.json(
          {
            error: `The following invited users are not friends with you: [${nonFriends.join(", ")}]`,
          },
          { status: 400 }
        );
      }
    }
  }

  // --- Select random problems ---
  let selectedProblems: Awaited<ReturnType<typeof selectRandomProblems>>;
  try {
    selectedProblems = selectRandomProblems(validatedSlots);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Problem selection failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // --- Create contest in a transaction ---
  try {
    const contest = await prisma.$transaction(async (tx) => {
      // 1. Create the contest
      const newContest = await tx.contest.create({
        data: {
          title: title.trim(),
          creator_id: creatorId,
          is_public: typeof is_public === "boolean" ? is_public : false,
          starts_at: startsAtDate,
          duration_minutes,
        },
      });

      // 2. Create ContestProblem records
      await tx.contestProblem.createMany({
        data: selectedProblems.map((sp) => ({
          contest_id: newContest.id,
          problem_id: sp.problem.id,
          order: sp.order,
          difficulty: sp.difficulty,
        })),
      });

      // 3. Add creator as participant
      await tx.contestParticipant.create({
        data: {
          contest_id: newContest.id,
          user_id: creatorId,
          total_score: 0,
        },
      });

      // 4. Create contest conversation with creator as first participant
      await tx.conversation.create({
        data: {
          type: "contest",
          contest_id: newContest.id,
          participants: {
            create: { user_id: creatorId },
          },
        },
      });

      return newContest;
    });

    // 5. Send notifications to invited users (outside transaction — non-critical)
    if (invitedUserIds.length > 0) {
      try {
        const inviteNotifications = await sendContestInvites(
          contest.id,
          contest.title,
          startsAtDate,
          invitedUserIds,
          creatorName
        );
        // Emit real-time notification events to invited users
        emitContestInviteNotifications(inviteNotifications);
      } catch (inviteErr) {
        // Log but do not fail the whole request
        console.error("[POST /api/contests] Failed to send invites:", inviteErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        contest: {
          id: contest.id,
          title: contest.title,
          starts_at: contest.starts_at.toISOString(),
          duration_minutes: contest.duration_minutes,
          is_public: contest.is_public,
          status: getContestStatus(contest.starts_at, contest.duration_minutes),
          participant_count: 1,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/contests] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
