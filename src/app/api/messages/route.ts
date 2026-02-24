import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMessage } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipient_id, contest_id, type, content, metadata } = await req.json();

    if (!type || !content) {
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const message = createMessage({
        senderId: session.user.dbUserId,
        recipientId: recipient_id,
        contestId: contest_id,
        type,
        content,
        metadata
    });

    return NextResponse.json({ message });
}
