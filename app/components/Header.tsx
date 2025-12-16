"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Upload, LogOut, LogIn, Video } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <nav className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold text-white hover:text-purple-400 transition-colors"
          >
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
              <Video className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Reelio
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-white hover:text-purple-400 transition-colors font-medium rounded-lg hover:bg-white/5"
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/upload"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-white hover:text-purple-400 transition-colors font-medium rounded-lg hover:bg-white/5"
                >
                  <Upload className="w-5 h-5" />
                  Upload
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline font-medium">{session.user?.email?.split("@")[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-2">
                      <div className="px-4 py-3 text-sm text-gray-300 border-b border-white/10">
                        {session.user?.email}
                      </div>
                      <Link
                        href="/dashboard"
                        className="sm:hidden flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/upload"
                        className="sm:hidden flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 text-white hover:text-purple-400 transition-colors font-medium rounded-lg hover:bg-white/5"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
