import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-6 
        justify-items-center   /* center items inside grid cells */
        mx-auto                /* center the grid inside its container */
        w-full 
        max-w-5xl              /* optional: keeps grid nicely centered */
      "
    >
      {videos.map((video) => (
        <VideoComponent key={video._id?.toString()} video={video} />
      ))}

      {videos.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400">No videos found</p>
        </div>
      )}
    </div>
  );
}
