import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectToDatabase();

    const video = await Video.findById(id).lean();

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(video, { status: 200 });
  } catch (err: unknown) {
    console.error("GET /api/videos/[id] error:", err);

    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
