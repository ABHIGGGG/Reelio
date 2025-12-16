"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { videoUploadSchema } from "@/lib/validations";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface VideoUploadFormProps {
  onCreated?: () => void;
}

function VideoUploadForm({ onCreated }: VideoUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validate with Zod
    const validationResult = videoUploadSchema.safeParse({
      title,
      description,
      videoUrl,
      thumbnailUrl,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!videoUrl || !thumbnailUrl) {
      setErrors({ general: "Please upload both video and thumbnail." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error || "Failed to create video" });
        }
        return;
      }

      setTitle("");
      setDesc("");
      setVideoUrl("");
      setThumbUrl("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onCreated) onCreated();
    } catch (error: any) {
      console.error("Create video error:", error);
      setErrors({ general: error.message || "Failed to create video" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.general}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/40 rounded-lg text-green-200 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Video uploaded successfully!
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white/5 text-white placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors
                       ${errors.title ? "border-red-500/70" : "border-white/10"}`}
            placeholder="Enter video title"
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">{title.length}/100 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDesc(e.target.value);
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white/5 text-white placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors resize-none
                       ${errors.description ? "border-red-500/70" : "border-white/10"}`}
            rows={4}
            placeholder="Enter video description"
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">{description.length}/500 characters</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Video File <span className="text-red-500">*</span>
            </label>
            <FileUpload
              fileType="video"
              onSuccess={(res) => {
                setVideoUrl(res.url);
                if (errors.videoUrl) setErrors({ ...errors, videoUrl: "" });
              }}
            />
            {videoUrl && (
              <div className="flex items-center gap-2 text-sm text-green-300 mt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Video uploaded successfully</span>
              </div>
            )}
            {errors.videoUrl && (
              <p className="text-sm text-red-400">{errors.videoUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Thumbnail Image <span className="text-red-500">*</span>
            </label>
            <FileUpload
              fileType="image"
              onSuccess={(res) => {
                setThumbUrl(res.url);
                if (errors.thumbnailUrl) setErrors({ ...errors, thumbnailUrl: "" });
              }}
            />
            {thumbnailUrl && (
              <div className="flex items-center gap-2 text-sm text-green-300 mt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thumbnail uploaded successfully</span>
              </div>
            )}
            {errors.thumbnailUrl && (
              <p className="text-sm text-red-400">{errors.thumbnailUrl}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !videoUrl || !thumbnailUrl}
          className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white py-3 rounded-lg font-semibold
                     hover:from-purple-800 hover:to-fuchsia-800 active:scale-[0.99] transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-700 disabled:hover:to-fuchsia-700 shadow-lg shadow-purple-900/30"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            "Upload Reel"
          )}
        </button>
      </form>
    </div>
  );
}

export default VideoUploadForm;
