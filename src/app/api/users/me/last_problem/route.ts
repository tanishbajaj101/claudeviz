import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateLastProblem } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { problem_id, solved } = await req.json();

        if (!problem_id || typeof solved !== "boolean") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        // Call DB updater
        updateLastProblem(session.user.dbUserId, problem_id, solved);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update last problem:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
