"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const getSafeRedirectUrl = (user, searchParams) => {
  // 1. Force admin/superadmin to their panel — no exceptions
  const role = user?.roleId?.toString().toLowerCase();
  if (role === "admin" || role === "superadmin") {
    return "/admin";
  }

  // 2. Safe redirect for customers/staff only
  const targetRedirect = searchParams.get("redirect");
  const isSafeRedirect =
    targetRedirect &&
    targetRedirect.startsWith("/") &&
    !targetRedirect.startsWith("//");

  return isSafeRedirect ? targetRedirect : "/";
};
function LoginForm() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Secure auto-redirect when user is already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      const destination = getSafeRedirectUrl(user, searchParams);
      router.replace(destination);
    }
  }, [isLoading, user, router, searchParams]);

  const validate = () => {
    if (!email.trim()) return "Please enter your email address.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter your password.";
    return null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password); // ← fresh user
      const destination = getSafeRedirectUrl(loggedInUser, searchParams);
      router.replace(destination);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E3A2F]" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1E3A2F 0%, #2d2d3f 50%, #1a1a2e 100%)",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-25"
        style={{
          background: "radial-gradient(circle, #C27D38 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-20"
        style={{
          background: "radial-gradient(circle, #E5A93B 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[60%] left-[60%] w-[250px] h-[250px] rounded-full blur-[80px] opacity-15"
        style={{
          background: "radial-gradient(circle, #8ecae6 0%, transparent 70%)",
        }}
      />

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div
          className="rounded-3xl p-8 sm:p-10 space-y-7"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 32px 64px -12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo / Brand */}
          <div className="text-center space-y-2">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto"
              style={{
                background: "linear-gradient(135deg, #C27D38 0%, #E5A93B 100%)",
                boxShadow: "0 8px 24px rgba(194,125,56,0.35)",
              }}
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-white/50 font-sans">
              Sign in to your Anera Foods account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans animate-fade-in"
              style={{
                background: "rgba(211,47,47,0.12)",
                border: "1px solid rgba(211,47,47,0.25)",
                color: "#ff8a80",
              }}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-sans text-white placeholder-white/25 outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(194,125,56,0.6)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(194,125,56,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-sans text-white placeholder-white/25 outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(194,125,56,0.6)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(194,125,56,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-sm font-semibold font-sans tracking-wide text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: submitting
                  ? "rgba(194,125,56,0.5)"
                  : "linear-gradient(135deg, #C27D38 0%, #E5A93B 100%)",
                boxShadow: submitting
                  ? "none"
                  : "0 8px 24px rgba(194,125,56,0.3)",
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 12px 32px rgba(194,125,56,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = submitting
                  ? "none"
                  : "0 8px 24px rgba(194,125,56,0.3)";
              }}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-sans">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-white/50 font-sans">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#E5A93B] font-semibold hover:text-[#f0c060] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page wrapper – Suspense boundary for
   useSearchParams.
───────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center min-h-[92vh]"
          style={{
            background:
              "linear-gradient(135deg, #1E3A2F 0%, #2d2d3f 50%, #1a1a2e 100%)",
          }}
        >
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C27D38]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
