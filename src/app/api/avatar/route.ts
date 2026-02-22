import { NextRequest, NextResponse } from "next/server";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";
import type { Options } from "@dicebear/bottts";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const seed = searchParams.get("seed") ?? searchParams.get("id");

  if (!seed) {
    return NextResponse.json({ error: "seed is required" }, { status: 400 });
  }

  const eyesParam = searchParams.get("eyes");
  const faceParam = searchParams.get("face");
  const mouthParam = searchParams.get("mouth");
  const sidesParam = searchParams.get("sides");
  const topParam = searchParams.get("top");
  const textureParam = searchParams.get("texture");
  const baseColorParam = searchParams.get("baseColor");

  const options: Options & { seed?: string } = { seed };

  if (eyesParam) options.eyes = [eyesParam as NonNullable<Options["eyes"]>[number]];
  if (faceParam) options.face = [faceParam as NonNullable<Options["face"]>[number]];
  if (mouthParam) options.mouth = [mouthParam as NonNullable<Options["mouth"]>[number]];
  if (sidesParam) options.sides = [sidesParam as NonNullable<Options["sides"]>[number]];
  if (topParam) options.top = [topParam as NonNullable<Options["top"]>[number]];
  if (textureParam) options.texture = [textureParam as NonNullable<Options["texture"]>[number]];
  if (baseColorParam) options.baseColor = [baseColorParam];

  const svg = createAvatar(bottts, options).toString();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
