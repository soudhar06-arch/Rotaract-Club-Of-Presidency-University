"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, ChevronDown } from "lucide-react";
import { HERO_GALLERY_IMAGES } from "@/services/mock-data";
import { ROUTES } from "@/constants";

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background gallery slow crossfade timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_GALLERY_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden pt-28 pb-12"
    >
      {/* Animated Hero Background Gallery Layer with Ken Burns Scale Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.3, scale: [1.08, 1.02, 1] }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_GALLERY_IMAGES[currentImageIndex]}
              alt="Rotaract Activity Background"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center brightness-90 contrast-105 filter"
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layer Overlays: Noise Texture, Glass Overlay, Dark Gradient & Cinematic Vignette */}
        <div className="absolute inset-0 bg-[#050505]/65 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/75 to-[#050505]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/70 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      {/* Main Hero Content Container */}
      <div className="container-shell relative z-10 flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Official Rotary District Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="shadow-glow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-xl"
          >
            <ShieldCheck className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-xs font-semibold tracking-wider text-[#D4D4D4] uppercase">
              Chartered under Rotary District 3191
            </span>
          </motion.div>

          {/* Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-display-xl mt-8 font-extrabold tracking-tight text-white drop-shadow-md"
          >
            ROTARACT CLUB OF <br />
            <span className="bg-gradient-to-r from-white via-white to-[#3B82F6] bg-clip-text text-transparent">
              PRESIDENCY UNIVERSITY
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#9A9A9A] drop-shadow sm:text-lg lg:text-xl"
          >
            Architecting impact through leadership development, community
            empowerment, global service, and innovation. Experience the flagship
            youth initiative of Presidency University.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href={ROUTES.JOIN}
              className="group inline-flex items-center gap-3 rounded-xl bg-[#3B82F6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all hover:scale-105 hover:bg-blue-600 active:scale-95"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/[0.08]"
            >
              <span>Explore Our Impact</span>
              <Sparkles className="h-4 w-4 text-[#3B82F6]" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 flex flex-col items-center pt-8"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-xs font-medium text-[#71717A] transition-colors hover:text-white"
        >
          <span>Scroll to Discover</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-4 w-4 text-[#3B82F6]" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
