"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { ROUTES } from "@/constants";
import { CountUp } from "@/components/shared";

const HERO_IMAGES = [
  {
    src: "/images/hero-community.png",
    caption: "Community Development & Youth Service",
  },
  {
    src: "/images/project-featured.png",
    caption: "Green Campus Sustainability Drive",
  },
  {
    src: "/images/event-blood-drive.png",
    caption: "Annual Voluntary Blood Donation Drive",
  },
  {
    src: "/images/gallery-youth-summit.png",
    caption: "Youth Leadership & Innovation Summit",
  },
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[92vh] flex-col justify-between overflow-hidden pt-32 pb-20"
    >
      {/* Background Gallery Image Crossfade with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGES[currentImageIndex].src}
              alt={HERO_IMAGES[currentImageIndex].caption}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Keynote Overlay & Glass Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/50" />
        <div className="bg-radial-gradient(circle at 50% 50%, transparent 40%, #050505 100%) absolute inset-0" />
      </div>

      {/* Main Narrative Fixed Content */}
      <div className="container-shell relative z-10 my-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {/* Pill Tag & Dynamic Image Caption */}
          <div className="shadow-small inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-2xl">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-[color:var(--color-brand-rotary-gold)]" />
            <span className="font-mono text-xs font-semibold text-[color:var(--color-text-secondary)]">
              {HERO_IMAGES[currentImageIndex].caption}
            </span>
          </div>

          {/* Massive Keynote Headline */}
          <h1 className="text-display-xl leading-none font-bold tracking-tight text-balance text-white">
            Building Leaders. <br className="hidden sm:inline" />
            Creating Impact. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#3B82F6] via-blue-400 to-[color:var(--color-brand-rotary-gold)] bg-clip-text text-transparent">
              Changing Communities.
            </span>
          </h1>

          {/* Minimal Copy */}
          <p className="text-body-large mx-auto max-w-2xl leading-relaxed font-normal text-[color:var(--color-text-muted)]">
            The Rotaract Club of Presidency University brings together motivated
            student leaders to drive civic innovation, public health drives, and
            youth governance across Karnataka.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <Link
              href={ROUTES.JOIN}
              className="shadow-glow inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-[#3B82F6] px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-blue-600 active:scale-95 sm:w-auto"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#projects"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white backdrop-blur-2xl transition-all hover:bg-white/[0.08] active:scale-95 sm:w-auto"
            >
              <span>Explore Initiatives</span>
            </Link>
          </div>

          {/* Live Count-Up Stats Strip */}
          <div className="mx-auto grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-10">
            <div className="flex flex-col items-center">
              <span className="font-geist text-2xl font-extrabold text-white sm:text-3xl">
                <CountUp to={1250} suffix="+" />
              </span>
              <span className="mt-1 font-mono text-[11px] tracking-wider text-[color:var(--color-text-muted)] uppercase">
                Lives Touched
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-geist text-2xl font-extrabold text-white sm:text-3xl">
                <CountUp to={45} suffix="+" />
              </span>
              <span className="mt-1 font-mono text-[11px] tracking-wider text-[color:var(--color-text-muted)] uppercase">
                Action Drives
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-geist text-2xl font-extrabold text-white sm:text-3xl">
                <CountUp to={15000} suffix="+" />
              </span>
              <span className="mt-1 font-mono text-[11px] tracking-wider text-[color:var(--color-text-muted)] uppercase">
                Volunteer Hours
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mouse Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8 text-[color:var(--color-text-muted)]">
        <span className="mb-1 font-mono text-[10px] tracking-widest uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ChevronDown className="h-4 w-4 text-[#3B82F6]" />
        </motion.div>
      </div>
    </section>
  );
}
