import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getContestDetails, submitContestProblem } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const contestId = parseInt(id, 10);

    if (isNaN(contestId)) {
        return NextResponse.json({ error: "Invalid contest ID" }, { status: 400 });
    }

    try {
        const { problemId, isCorrect } = await req.json();

        if (!problemId || typeof isCorrect !== "boolean") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const details = getContestDetails(contestId);
        if (!details) {
            return NextResponse.json({ error: "Contest not found" }, { status: 404 });
        }

        // Check if contest is active
        const now = new Date();
        const startTime = new Date(details.contest.starts_at);
        const endTime = new Date(startTime.getTime() + details.contest.duration_minutes * 60000);

        if (now < startTime) {
            return NextResponse.json({ error: "Contest has not started yet" }, { status: 400 });
        }

        if (now > endTime) {
            return NextResponse.json({ error: "Contest has ended" }, { status: 400 });
        }

        // Verify user is a participant
        const isParticipant = details.participants.some(p => p.id === session.user.dbUserId);
        if (!isParticipant) {
            return NextResponse.json({ error: "You are not a participant in this contest" }, { status: 403 });
        }

        // Find problem in contest to get max points
        const contestProblem = details.problems.find(p => p.problem_id === problemId);
        if (!contestProblem) {
            return NextResponse.json({ error: "Problem not part of this contest" }, { status: 400 });
        }

        // Calculate time bonus: (Remaining Time / Total Time) * 20% of Max Points
        let timeBonus = 0;
        if (isCorrect) {
            const remainingTimeMs = endTime.getTime() - now.getTime();
            const totalTimeMs = details.contest.duration_minutes * 60000;
            const timeRatio = Math.max(0, remainingTimeMs / totalTimeMs);
            const maxBonus = Math.floor(contestProblem.points * 0.2);
            timeBonus = Math.floor(maxBonus * timeRatio);
        }

        const result = submitContestProblem({
            contestId,
            problemId,
            userId: session.user.dbUserId,
            isCorrect,
            timeBonus,
            maxPoints: contestProblem.points
        });

        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Failed to process contest submission:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
