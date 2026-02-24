import { getPublicContests } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const contests = getPublicContests();
    return NextResponse.json({ contests });
}
