"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, ChevronDown, CalendarPlus, Info } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import localArchive from "@/data/event-archive.json";
const HERO_GALLERY_IMAGES = localArchive.flatMap(event => event.images.slice(0, 1));
import { ROUTES } from "@/constants";

const GOOGLE_CALENDAR_SUBSCRIBE_URL =
  "https://calendar.google.com/calendar/render?cid=eeb75d6bf01f26062e450bd636e8754def7c93a45bba4f7be07a862e49db8745%40group.calendar.google.com";

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);
      }
    });

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => {
        cancelAnimationFrame(handle);
        mediaQuery.removeEventListener("change", listener);
      };
    }
    return () => cancelAnimationFrame(handle);
  }, []);

  // Background gallery slow crossfade timer
  useEffect(() => {
    if (!isMounted || prefersReducedMotion) return;
    const timer = setInterval(() => {
      if (!document.hidden) {
        setCurrentImageIndex((prev) => (prev + 1) % HERO_GALLERY_IMAGES.length);
      }
    }, 6500);
    return () => clearInterval(timer);
  }, [isMounted, prefersReducedMotion]);

  const handleSubscribeCalendar = () => {
    if (typeof window !== "undefined") {
      window.open(GOOGLE_CALENDAR_SUBSCRIBE_URL, "_blank", "noopener,noreferrer");
    }
  };

  const stats = [
    { value: "500+", label: "Active Rotaractors" },
    { value: "50+", label: "Projects Executed" },
    { value: "10K+", label: "Lives Impacted" },
  ];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden pt-28 pb-12"
    >
      {/* Background Gallery Layer with Eager Load for First Image, Lazy for Subsequent */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
            animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0.65, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_GALLERY_IMAGES[currentImageIndex]}
              alt="Rotaract Activity Background"
              fill
              sizes="100vw"
              priority={currentImageIndex === 0}
              className="object-cover object-center brightness-105 contrast-100 filter"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/40 to-[#050505]/80" />
      </div>

      {/* Main Hero Content Container */}
      <div className="container-shell relative z-10 flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Rotary District Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="shadow-glow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-xl"
          >
            <ShieldCheck className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-xs font-semibold tracking-wider text-[#D4D4D4] uppercase">
              Chartered under Rotary District 3192
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-display-xl mt-8 font-extrabold tracking-tight text-white drop-shadow-md"
          >
            ROTARACT CLUB OF <br />
            <span className="bg-gradient-to-r from-white via-white to-[#3B82F6] bg-clip-text text-transparent">
              PRESIDENCY UNIVERSITY
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#9A9A9A] drop-shadow sm:text-lg lg:text-xl"
          >
            Architecting impact through leadership development, community
            empowerment, global service, and innovation. Experience the flagship
            youth initiative of Presidency University.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
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

            {/* Compact Secondary CTA for Official Google Calendar Subscription */}
            <button
              onClick={handleSubscribeCalendar}
              className="inline-flex items-center gap-2 rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-5 py-3.5 text-xs font-semibold text-[#3B82F6] backdrop-blur-xl transition-all hover:bg-[#3B82F6] hover:text-white"
              title="Add Rotaract Calendar to Google Calendar"
            >
              <CalendarPlus className="h-4 w-4" />
              <span>Add Club Calendar</span>
            </button>
          </motion.div>

          {/* Notification Guidance Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#71717A]"
          >
            <Info className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>Subscribing adds club events to your Google Calendar where you can configure mobile alerts.</span>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center px-4">
                <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  <CountUp value={stat.value} once={false} />
                </span>
                <span className="mt-1 text-xs text-[#9A9A9A]">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
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
