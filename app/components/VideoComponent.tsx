"use client";

import { Video } from "@imagekit/next";
import Link from "next/link";
import type { IVideo } from "@/models/Video";
import { Play } from "lucide-react";

interface VideoComponentProps {
  video: IVideo;
}

export default function VideoComponent({ video }: VideoComponentProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 group shadow-lg shadow-black/30">
      <figure className="relative">
        <Link href={`/videos/${video._id}`} className="relative block w-full">
          <div
            className="rounded-t-xl overflow-hidden relative w-full bg-black/40"
            style={{ aspectRatio: "9/16", maxHeight: "400px" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Video
                src={video.videoUrl}
                controls={video.controls}
                className="w-full h-full object-contain max-h-full"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <Play className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          </div>
        </Link>
      </figure>

      <div className="p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:text-purple-300 transition-colors"
        >
          <h2 className="text-lg font-semibold text-white line-clamp-1">{video.title}</h2>
        </Link>

        <p className="text-sm text-gray-300 line-clamp-2 mt-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}
