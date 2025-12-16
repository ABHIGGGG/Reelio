"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { videoUploadSchema } from "@/lib/validations";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface VideoUploadFormProps {
  onCreated?: () => void;
}

interface ApiErrorDetail {
  field: string;
  message: string;
}

interface ApiErrorResponse {
  error?: string;
  details?: ApiErrorDetail[];
}

function VideoUploadForm({ onCreated }: VideoUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const validationResult = videoUploadSchema.safeParse({
      title,
      description,
      videoUrl,
      thumbnailUrl,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = err.message;
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

      const data: ApiErrorResponse = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error ?? "Failed to create video" });
        }
        return;
      }

      setTitle("");
      setDesc("");
      setVideoUrl("");
      setThumbUrl("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onCreated?.();
    } catch (err: unknown) {
      console.error("Create video error:", err);
      if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "Failed to create video" });
      }
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
            focus:outline-none focus:ring-2 focus:ring-purple-600
            ${errors.title ? "border-red-500/70" : "border-white/10"}`}
            maxLength={100}
            placeholder="Enter video title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {title.length}/100 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDesc(e.target.value);
              if (errors.description)
                setErrors({ ...errors, description: "" });
            }}
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white/5 text-white
            ${errors.description ? "border-red-500/70" : "border-white/10"}`}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FileUpload
            fileType="video"
            onSuccess={(res) => setVideoUrl(res.url)}
          />
          <FileUpload
            fileType="image"
            onSuccess={(res) => setThumbUrl(res.url)}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !videoUrl || !thumbnailUrl}
          className="w-full bg-gradient-to-r from-purple-700 to-fuchsia-700 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Reel"}
        </button>
      </form>
    </div>
  );
}

export default VideoUploadForm;
