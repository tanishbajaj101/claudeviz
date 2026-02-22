import { NextRequest, NextResponse } from "next/server";
import { isUsernameAvailable } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  // Validate username format (3-20 chars, alphanumeric + underscore)
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3-20 characters, alphanumeric and underscore only" },
      { status: 400 }
    );
  }

  const available = isUsernameAvailable(username);
  return NextResponse.json({ available });
}
