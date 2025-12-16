import { Video } from "@imagekit/next";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getVideo(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/videos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const video = await getVideo(id);

  if (!video) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Reel</p>
            <h1 className="text-3xl font-bold">{video.title}</h1>
          </div>

          <Link
            href="/dashboard"
            className="text-sm text-gray-300 hover:text-white underline underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div
            className="relative w-full bg-black flex items-center justify-center"
            style={{ aspectRatio: "9 / 16", maxHeight: "80vh" }}
          >
            <Video
              src={video.videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>

          <div className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">{video.title}</h2>
            <p className="text-gray-300">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
