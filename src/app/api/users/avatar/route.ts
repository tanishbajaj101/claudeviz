import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = getUserByUsername(username);
    if (!user || !user.avatar_svg) {
        return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    return new NextResponse(user.avatar_svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
    });
}
