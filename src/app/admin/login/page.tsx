"use client";
import { adminFetch } from "@/lib/admin-fetch";

import { useState } from "react";
import Image from "@/components/shared/content-image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/admin/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await adminFetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(data.error || "Authentication failed. Access denied.");
      }
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Identity Header */}
        <div className="text-center space-y-3">
          <div className="inline-relative h-16 w-16 mx-auto relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E121E] p-2.5 shadow-2xl">
            <Image
              src="/logos/club_logo.svg"
              alt="Rotaract Logo"
              fill
              sizes="64px"
              className="object-contain p-1"
            />
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#3B82F6] font-bold uppercase tracking-widest block">
              ROTARACT CLUB OF PRESIDENCY UNIVERSITY
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              Secretariat Admin Portal
            </h1>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl border border-white/10 bg-[#0F121C]/90 backdrop-blur-xl space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
            <span>Authorized Personnel Authentication</span>
          </div>

          {error && (
            <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[#3B82F6] text-white hover:bg-blue-600 transition-all shadow-lg shadow-[#3B82F6]/25 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-zinc-600 font-mono">
          Rotaract Club of Presidency University • RID 3192 Security System
        </p>
      </div>
    </div>
  );
}
