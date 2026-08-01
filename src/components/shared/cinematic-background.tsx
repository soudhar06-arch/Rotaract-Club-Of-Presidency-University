"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  // Scroll responsive atmospheric shifts
  const bgOpacity1 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.35, 0.5, 0.3],
  );
  const bgOpacity2 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.25, 0.45, 0.3, 0.4],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const { clientX, clientY } = e;
      spotlightRef.current.style.background = `radial-gradient(600px circle at ${clientX}px ${clientY}px, rgba(59, 130, 246, 0.08), transparent 80%)`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]"
      aria-hidden="true"
    >
      {/* Matte Black Base */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Mouse Reactive Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(600px circle at 50% 30%, rgba(59, 130, 246, 0.08), transparent 80%)",
        }}
      />

      {/* Radial Light Orbs */}
      <motion.div
        style={{ opacity: bgOpacity1 }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[140px]"
      />

      <motion.div
        style={{ opacity: bgOpacity2 }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[40%] right-[5%] h-[700px] w-[700px] rounded-full bg-blue-800/15 blur-[160px]"
      />

      <motion.div
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[10%] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-900/15 blur-[150px]"
      />

      {/* Subtle Micro-Grid Overlay */}
      <div className="bg-micro-grid absolute inset-0 opacity-[0.4]" />

      {/* Noise Texture Canvas Filter */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
