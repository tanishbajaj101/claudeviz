import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { respondFriendRequest } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendship_id, status } = await req.json();
    if (!friendship_id || !status || !['accepted', 'rejected'].includes(status)) {
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    respondFriendRequest(friendship_id, status);
    return NextResponse.json({ success: true });
}
