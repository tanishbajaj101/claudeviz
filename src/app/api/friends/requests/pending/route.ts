import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPendingFriendRequests } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = getPendingFriendRequests(session.user.dbUserId);
    return NextResponse.json({ requests });
}
