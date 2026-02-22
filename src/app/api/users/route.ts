import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createUser, getUserByGoogleId, isUsernameAvailable } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, username, avatarSvg } = body;

  if (!name || !username || !avatarSvg) {
    return NextResponse.json(
      { error: "Name, username, and avatarSvg are required" },
      { status: 400 }
    );
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3-20 characters, alphanumeric and underscore only" },
      { status: 400 }
    );
  }

  // Check availability
  if (!isUsernameAvailable(username)) {
    return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
  }

  try {
    const user = createUser({
      googleId: session.user.googleId,
      email: session.user.email,
      name: name.trim(),
      username,
      avatarSvg,
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserByGoogleId(session.user.googleId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
