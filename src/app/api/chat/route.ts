import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/lib/chatbot";
import { ChatRequest, ChatResponse } from "@/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const body = (await request.json()) as ChatRequest;
    const { message, problemContext } = body;

    if (!message || !problemContext) {
      return NextResponse.json(
        { error: "Missing required fields: message, problemContext" },
        { status: 400 }
      );
    }

    const { reply, visualization } = await getChatResponse(
      message,
      problemContext
    );

    return NextResponse.json({ reply, visualization });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
