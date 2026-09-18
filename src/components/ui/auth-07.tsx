"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Auth7() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      if (email && password) {
        // Admin redirect logic
        router.push("/admin/dashboard");
      } else {
        setError("Please enter valid credentials.");
      }
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#050505] font-sans text-white antialiased selection:bg-[#3B82F6] selection:text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#3B82F6]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      {/* Left Form Section */}
      <div className="relative z-10 flex w-full flex-col justify-between lg:w-1/2 p-6 md:p-12">
        {/* Header Branding */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#3B82F6] text-white shadow-glow">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block">ROTARACT ADMIN</span>
              <span className="text-xs text-[#9A9A9A] tracking-wider uppercase">Presidency University</span>
            </div>
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto flex flex-1 items-center justify-center py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-2xl"
          >
            {/* Titles */}
            <motion.div variants={itemVariants} className="mb-6 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10 text-[#3B82F6]">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="mb-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Admin Panel Access
              </h1>
              <p className="text-xs text-[#9A9A9A]">
                Authorized Rotaract Board Members & Administrators
              </p>
            </motion.div>

            {error && (
              <motion.div
                variants={itemVariants}
                className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-[#D4D4D4]">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[#71717A]" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@presidencyuniversity.in"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3 text-xs text-white placeholder:text-[#71717A] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-medium text-[#D4D4D4]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#71717A]" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3 text-xs text-white placeholder:text-[#71717A] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3.5 text-xs font-semibold text-white shadow-glow transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-6 text-center text-xs text-[#71717A]">
              Protected security boundary. All authentication attempts are logged.
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#71717A]">
          &copy; {new Date().getFullYear()} Rotaract Club of Presidency University. All Rights Reserved.
        </div>
      </div>

      {/* Right Visual Image Section */}
      <div className="hidden lg:block lg:w-1/2 p-6">
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          <Image
            src="/gallery/gallery-1.jpeg"
            alt="Rotaract Leadership"
            fill
            sizes="50vw"
            className="object-cover brightness-75 filter"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12">
            <span className="inline-block rounded-full bg-[#3B82F6]/20 px-3 py-1 text-xs font-semibold text-[#3B82F6] border border-[#3B82F6]/30 mb-3">
              LEADERSHIP & MANAGEMENT
            </span>
            <h2 className="text-2xl font-bold text-white">Rotaract Presidency Admin Dashboard</h2>
            <p className="mt-2 text-xs text-[#9A9A9A]">
              Manage Google Calendar events, member applications, board directory, and awards tracking in one unified interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
