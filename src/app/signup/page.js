"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function SignupForm() {
  const { user, isLoading, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(searchParams.get("redirect") || "/");
    }
  }, [isLoading, user, router, searchParams]);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter your email address.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.password) return "Please enter a password.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (form.phone && !/^\+?[0-9\s-]{9,15}$/.test(form.phone.trim())) {
      return "Please enter a valid phone number.";
    }
    if (!agreed) return "Please accept the Terms of Service and Privacy Policy.";
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
      await signup(form.name.trim(), form.email.trim(), form.phone.trim(), form.password);
      router.replace(searchParams.get("redirect") || "/");
    } catch (err) {
      setError(err.message || "Could not create account. Please try again.");
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

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-sans text-white placeholder-white/25 outline-none transition-all duration-300";
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-12"
      style={{ background: "linear-gradient(135deg, #1E3A2F 0%, #2d2d3f 50%, #1a1a2e 100%)" }}
    >
      <div
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-25"
        style={{ background: "radial-gradient(circle, #C27D38 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-20"
        style={{ background: "radial-gradient(circle, #E5A93B 0%, transparent 70%)" }}
      />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div
          className="rounded-3xl p-8 sm:p-10 space-y-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 32px 64px -12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-center space-y-2">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto"
              style={{
                background: "linear-gradient(135deg, #C27D38 0%, #E5A93B 100%)",
                boxShadow: "0 8px 24px rgba(194,125,56,0.35)",
              }}
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-white/50 font-sans">
              Join Anera Foods for faster checkout and order tracking
            </p>
          </div>

          {error && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans animate-fade-in"
              style={{
                background: "rgba(211,47,47,0.12)",
                border: "1px solid rgba(211,47,47,0.25)",
                color: "#ff8a80",
              }}
            >
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: "name", label: "Full Name", type: "text", placeholder: "Your name", auto: "name" },
              { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com", auto: "email" },
              { id: "phone", label: "Phone (optional)", type: "tel", placeholder: "+94 77 123 4567", auto: "tel" },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.id]}
                  onChange={update(field.id)}
                  placeholder={field.placeholder}
                  autoComplete={field.auto}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 font-sans">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
                className="mt-1 rounded border-white/20"
              />
              <span className="text-xs text-white/50 font-sans leading-relaxed group-hover:text-white/70 transition-colors">
                I agree to the{" "}
                <Link href="/privacy" className="text-[#E5A93B] hover:underline">
                  Privacy Policy
                </Link>{" "}
                and Terms of Service
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-sm font-semibold font-sans tracking-wide text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: submitting
                  ? "rgba(194,125,56,0.5)"
                  : "linear-gradient(135deg, #C27D38 0%, #E5A93B 100%)",
                boxShadow: submitting ? "none" : "0 8px 24px rgba(194,125,56,0.3)",
              }}
            >
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-white/50 font-sans">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E5A93B] font-semibold hover:text-[#f0c060] transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center min-h-[92vh]"
          style={{ background: "linear-gradient(135deg, #1E3A2F 0%, #2d2d3f 50%, #1a1a2e 100%)" }}
        >
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C27D38]" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
