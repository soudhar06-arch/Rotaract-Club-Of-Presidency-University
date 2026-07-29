"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CinematicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
      {/* Layer 1: Matte Black Foundation */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Layer 2 & 3: Ambient Radial Lighting & Atmospheric Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[20%] h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-[#3B82F6]/20 via-transparent to-[#F5A623]/10 blur-[150px]"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#3B82F6]/15 to-transparent blur-[140px]"
      />

      {/* Layer 4: Micro Grid Pattern */}
      <div className="bg-micro-grid absolute inset-0 opacity-60" />

      {/* Layer 5: Subtle Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 6: Slow Floating Micro Particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i + 1) * 15}%`,
              y: "105vh",
              opacity: 0.1,
            }}
            animate={{
              y: "-5vh",
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3,
            }}
            className="absolute h-1 w-1 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]"
          />
        ))}
      </div>

      {/* Layer 7: Mouse-Reactive Soft Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.06), transparent 80%)`,
        }}
      />
    </div>
  );
}
