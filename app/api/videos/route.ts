import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { videoUploadSchema } from "@/lib/validations";
import type { ZodIssue } from "zod";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(videos ?? [], { status: 200 });
  } catch (error) {
    console.error("GET /api/videos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();

    // Validate with Zod
    const validationResult = videoUploadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationResult.error.issues.map((issue: ZodIssue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const videoData = {
      title: validationResult.data.title,
      description: validationResult.data.description,
      videoUrl: validationResult.data.videoUrl,
      thumbnailUrl: validationResult.data.thumbnailUrl,
      controls: validationResult.data.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: validationResult.data.transformation?.quality ?? 100,
      },
      // you can also store session.user.id if needed
      // userId: session.user.id
    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/videos error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create video";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
