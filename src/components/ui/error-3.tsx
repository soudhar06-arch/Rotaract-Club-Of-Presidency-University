"use client";

import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export interface ErrorPageProps {
  code?: string;
  title?: string;
  description?: string;
  reset?: () => void;
}

export default function ErrorPage({
  code = "404",
  title = "Connection Severed",
  description = "Critical routing failure. The endpoint you requested has been redacted, moved, or never existed in the main sequence.",
  reset,
}: ErrorPageProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] font-mono text-white selection:bg-[#3B82F6]/30">
      {/* Background Grid & Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-[#050505]/80 to-[#050505]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="relative z-10 max-w-2xl space-y-8 text-center">
          {/* Animated Glitch 404 Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative inline-block"
          >
            <h1
              className="text-8xl font-black tracking-tighter text-transparent select-none md:text-[10rem]"
              style={{ WebkitTextStroke: "2px rgba(59, 130, 246, 0.2)" }}
            >
              {code}
            </h1>
            <motion.h1
              animate={{ x: [-3, 3, -3], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="absolute inset-0 text-8xl font-black tracking-tighter text-[#3B82F6] mix-blend-screen select-none md:text-[10rem]"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
            >
              {code}
            </motion.h1>
            <motion.h1
              animate={{ x: [3, -3, 3], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 0.25,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="absolute inset-0 text-8xl font-black tracking-tighter text-blue-400 mix-blend-screen select-none md:text-[10rem]"
              style={{
                clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
              }}
            >
              {code}
            </motion.h1>
            <h1 className="absolute inset-0 text-8xl font-black tracking-tighter text-white select-none md:text-[10rem]">
              {code}
            </h1>
          </motion.div>

          {/* Description Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
          >
            <div className="mb-3 flex items-center justify-center gap-3">
              <h2 className="text-xl font-bold tracking-[0.2em] text-[#3B82F6] uppercase md:text-2xl">
                {title}
              </h2>
            </div>

            <p className="leading-relaxed text-[#9A9A9A] text-xs sm:text-sm md:text-base">
              {description}
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row"
          >
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#3B82F6] px-8 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-blue-600 shadow-glow"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Return Home</span>
            </Link>

            {reset ? (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 text-[#3B82F6]" />
                <span>Retry System</span>
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 text-[#3B82F6]" />
                <span>Reload Uplink</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
