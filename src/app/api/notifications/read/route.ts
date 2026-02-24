import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markNotificationsRead } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, all } = await req.json();

    if (all) {
        markNotificationsRead(session.user.dbUserId);
    } else if (Array.isArray(ids) && ids.length > 0) {
        markNotificationsRead(session.user.dbUserId, ids);
    } else {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
