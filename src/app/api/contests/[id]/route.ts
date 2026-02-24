import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getContestDetails, getContestLeaderboard, joinContest, createNotification } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
        const details = getContestDetails(contestId);
        if (!details) {
            return NextResponse.json({ error: "Contest not found" }, { status: 404 });
        }

        const leaderboard = getContestLeaderboard(contestId);

        return NextResponse.json({
            ...details,
            leaderboard,
        });
    } catch (error) {
        console.error("Failed to fetch contest details:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

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
        const { action, friendId } = await req.json();

        if (action === "join") {
            joinContest(contestId, session.user.dbUserId);
            return NextResponse.json({ success: true });
        }

        if (action === "invite") {
            if (!friendId) {
                return NextResponse.json({ error: "Missing friendId" }, { status: 400 });
            }

            // get contest name for the notification
            const details = getContestDetails(contestId);
            if (!details) {
                return NextResponse.json({ error: "Contest not found" }, { status: 404 });
            }

            createNotification(friendId, "contest_invite", {
                contest_id: contestId,
                contest_name: details.contest.title,
                inviter_id: session.user.dbUserId,
                inviter_username: session.user.username,
                starts_at: details.contest.starts_at,
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Failed to process contest action:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
