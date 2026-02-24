import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNotifications } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = getNotifications(session.user.dbUserId);

    // API requests JSON parsing for payload
    const formatted = notifications.map(n => ({
        ...n,
        payload: JSON.parse(n.payload),
        read: n.read === 1
    }));

    return NextResponse.json({ notifications: formatted });
}
