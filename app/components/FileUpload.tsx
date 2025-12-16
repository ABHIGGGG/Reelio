"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";

interface ImageKitUploadResponse {
  url: string;
  [key: string]: unknown;
}

interface FileUploadProps {
  onSuccess: (res: ImageKitUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a valid video file");
      return false;
    }

    if (fileType === "image" && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return false;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }

    return true;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      // 👇 make sure this matches your route path
      const authRes = await fetch("/api/auth/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Failed to get upload auth");
      }

      // expected: { token, expire, signature, publicKey }
      const { token, expire, signature, publicKey } = await authRes.json();

      const res = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      onSuccess(res);
    } catch (err) {
      console.error("Upload failed", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <input
          type="file"
          accept={fileType === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-200
                     file:mr-4 file:py-2.5 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-gradient-to-r file:from-purple-700 file:to-fuchsia-700 file:text-white
                     file:hover:from-purple-800 file:hover:to-fuchsia-800
                     file:cursor-pointer file:transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     cursor-pointer bg-white/5 border border-white/10 rounded-lg p-2"
        />
      </label>
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-purple-200">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/40 p-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
