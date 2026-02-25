import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendFriendRequest, getUserById, createNotification } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressee_id } = await req.json();
    if (!addressee_id || typeof addressee_id !== "number") {
        return NextResponse.json({ error: "Invalid addressee_id" }, { status: 400 });
    }

    sendFriendRequest(session.user.dbUserId, addressee_id);

    // Create notification for addressee
    const requester = await getUserById(session.user.dbUserId);
    if (requester) {
        createNotification(addressee_id, "friend_request", {
            requester_id: requester.id,
            username: requester.username
        });
    }

    return NextResponse.json({ success: true });
}
