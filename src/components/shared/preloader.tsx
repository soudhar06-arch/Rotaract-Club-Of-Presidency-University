"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasSeen = typeof window !== "undefined" && sessionStorage.getItem("hasSeenPreloader");
    if (hasSeen) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    // Smooth ~1.8 second progress animation
    const startTime = performance.now();
    const duration = 1800;

    const updateProgress = () => {
      const elapsed = performance.now() - startTime;
      const calculated = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(calculated);

      if (calculated < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setLoading(false);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("hasSeenPreloader", "true");
          }
        }, 200);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="spylt-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white selection:bg-[#3B82F6]"
        >
          {/* Animated Background Radial Glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.15, 0.35, 0.15],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-[500px] w-[500px] rounded-full bg-[#3B82F6]/10"
            />
          </div>

          {/* Central Logo & Visual Container */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-white/15 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-md sm:h-44 sm:w-44">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                  <Image
                    src="/logos/club_logo.svg"
                    alt="Rotaract Club Logo"
                    fill
                    sizes="112px"
                    className="object-contain p-1"
                    priority
                  />
                </div>

                <motion.div
                  style={{ height: `${progress}%` }}
                  className="absolute bottom-0 left-0 right-0 rounded-b-3xl bg-[#3B82F6]/20 transition-all duration-100 ease-out"
                />
              </div>
            </motion.div>

            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base font-extrabold tracking-widest text-white uppercase sm:text-lg"
              >
                ROTARACT CLUB
              </motion.h2>
              <p className="mt-1 text-xs font-semibold tracking-widest text-[#3B82F6] uppercase">
                PRESIDENCY UNIVERSITY
              </p>
            </div>

            <div className="flex w-56 flex-col items-center gap-2 sm:w-64">
              <div className="flex w-full justify-between text-xs font-mono text-[#3B82F6]">
                <span>INITIALIZING</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-[#3B82F6] via-blue-400 to-[#3B82F6]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
