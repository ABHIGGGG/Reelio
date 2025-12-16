// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import VideoFeed from "@/app/components/VideoFeed";
import { IVideo } from "@/models/Video";
import Header from "@/app/components/Header";
import { Video } from "lucide-react";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data || []);
    } catch (e) {
      console.error("Failed to fetch videos", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadVideos();
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 flex flex-col">
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-400">Manage your reels and uploads</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="px-6 py-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 w-full sm:w-auto flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs uppercase tracking-wide">
                <Video className="w-4 h-4 text-purple-300" />
                Total Videos
              </div>
              <span className="text-2xl font-bold text-white">
                {videos.length}
              </span>
            </div>
          </div>
        </div>

        <section className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl min-h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Video className="w-6 h-6" />
              Your Reels
            </h2>
            {!loading && videos.length > 0 && (
              <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Loading videos…</p>
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Video className="w-12 h-12 mb-3 opacity-60" />
              <p className="text-lg font-medium">No videos yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Upload your first reel to see it here
              </p>
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <VideoFeed videos={videos} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
