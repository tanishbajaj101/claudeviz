import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMessagesWithFriend } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ friendId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendId: friendIdStr } = await params;
    const friendId = parseInt(friendIdStr, 10);

    if (isNaN(friendId)) {
        return NextResponse.json({ error: "Invalid friend ID" }, { status: 400 });
    }

    const messages = getMessagesWithFriend(session.user.dbUserId, friendId);
    return NextResponse.json({ messages });
}
