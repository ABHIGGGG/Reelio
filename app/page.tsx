"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Video, Upload, Sparkles, ArrowRight } from "lucide-react";
import Header from "./components/Header";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <Header />
      <main className="px-4 py-16 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col items-center text-center gap-16">
          {/* Hero Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-gray-200 text-sm font-medium border border-white/10">
              <Sparkles className="w-4 h-4" />
              Powered by ImageKit & Next.js
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
              Create & Share
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-300 bg-clip-text text-transparent">
                Amazing Reels
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
              Upload, manage, and share your video reels with the world. Built with modern
              technology for the best experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white rounded-full font-semibold hover:from-purple-800 hover:to-fuchsia-800 transition-all transform hover:scale-105 shadow-lg shadow-purple-900/40"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/upload"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Reel
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white rounded-full font-semibold hover:from-purple-800 hover:to-fuchsia-800 transition-all transform hover:scale-105 shadow-lg shadow-purple-900/40"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="w-full grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-purple-700/40 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-purple-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">High Quality Videos</h3>
              <p className="text-gray-300 text-sm">
                Upload and stream videos in stunning quality with ImageKit&apos;s powerful CDN.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-fuchsia-700/40 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-fuchsia-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Upload</h3>
              <p className="text-gray-300 text-sm">
                Simple drag-and-drop interface makes uploading your reels quick and effortless.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-indigo-700/40 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Secure</h3>
              <p className="text-gray-300 text-sm">
                Built with Next.js and NextAuth for lightning-fast performance and security.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
