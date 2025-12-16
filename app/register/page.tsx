"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { registerSchema } from "@/lib/validations";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

interface ApiErrorDetail {
  field: string;
  message: string;
}

interface ApiErrorResponse {
  error?: string;
  details?: ApiErrorDetail[];
}

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validate with Zod
    const validationResult = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
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
          setErrors({ general: data.error ?? "Registration failed" });
        }
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setErrors({ general: message });
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black p-4">
      <div className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
          <p className="text-gray-400">Sign up to get started with ReelsPro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {errors.general && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`w-full px-4 py-3 border rounded-lg bg-white/5 text-white placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors
                         ${errors.email ? "border-red-500" : "border-white/20"}`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              className={`w-full px-4 py-3 border rounded-lg bg-white/5 text-white placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors
                         ${errors.password ? "border-red-500" : "border-white/20"}`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-400">{errors.password}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
              }}
              className={`w-full px-4 py-3 border rounded-lg bg-white/5 text-white placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors
                         ${errors.confirmPassword ? "border-red-500" : "border-white/20"}`}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold
                       hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-black/60 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons - Below form */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/20 rounded-lg font-medium text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/20 rounded-lg font-medium text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
