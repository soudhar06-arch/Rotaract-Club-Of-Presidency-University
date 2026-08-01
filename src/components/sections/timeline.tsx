"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { Milestone } from "@/services/mock-data";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarDays,
  Award,
  Flag,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

interface TimelineProps {
  milestones?: Milestone[];
}

export function HorizontalTimelineSection({ milestones }: TimelineProps) {
  const { events, loading } = useCalendarEvents();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Dynamic milestone items derived from Google Calendar API or fallback props
  const displayItems =
    events.length > 0
      ? events.map((e) => ({
          year: new Date(e.rawStart).getFullYear().toString() || e.date,
          dateStr: e.date,
          title: e.title,
          category: e.category,
          venue: e.venue,
          description: e.description,
        }))
      : milestones?.map((m) => ({
          year: m.year,
          dateStr: m.year,
          title: m.title,
          category: "Milestone",
          venue: "Presidency University",
          description: m.description,
        })) || [];

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < maxScroll - 10);

      // Estimate active milestone index
      const itemWidth = 360;
      const currentIdx = Math.min(
        Math.floor((scrollLeft + clientWidth / 2) / itemWidth),
        displayItems.length - 1,
      );
      setActiveItemIndex(Math.max(0, currentIdx));
    }
  }, [displayItems.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  const milestoneIcons = [Sparkles, Award, Flag, CheckCircle2, Bookmark];

  return (
    <section
      id="timeline"
      className="section-shell relative z-10 overflow-hidden border-t border-white/[0.06] bg-[#050505] py-24"
    >
      {/* Background Accent Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-[#3B82F6]/10 blur-[140px]" />

      {/* Section Header */}
      <div className="mx-auto max-w-3xl px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
        >
          OUR JOURNEY & CHRONOLOGY
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Interactive Heritage Timeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-[#9A9A9A]"
        >
          Explore key leadership conclaves, service assemblies, and charter
          milestones mapped dynamically from Google Calendar.
        </motion.p>
      </div>

      {/* Controls & Progress Tracker */}
      <div className="container-shell mt-12 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-wider text-white uppercase">
            {displayItems.length} Milestones
          </span>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-xs text-[#9A9A9A]">
            Active: {displayItems[activeItemIndex]?.year || ""}
          </span>
        </div>

        {/* Scroll Progress Bar & Arrow Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden h-1 w-36 overflow-hidden rounded-full bg-white/10 sm:block">
            <div
              className="shadow-glow h-full bg-[#3B82F6] transition-all duration-200 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleScrollLeft}
              disabled={!canScrollLeft}
              aria-label="Scroll Timeline Left"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                canScrollLeft
                  ? "border-white/10 bg-white/[0.04] text-white hover:bg-white/10 active:scale-95"
                  : "cursor-not-allowed border-white/5 bg-white/[0.01] text-[#71717A]"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleScrollRight}
              disabled={!canScrollRight}
              aria-label="Scroll Timeline Right"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                canScrollRight
                  ? "border-white/10 bg-white/[0.04] text-white hover:bg-white/10 active:scale-95"
                  : "cursor-not-allowed border-white/5 bg-white/[0.01] text-[#71717A]"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Horizontal Timeline Track */}
      <div className="relative mt-12 w-full overflow-hidden py-16">
        {loading ? (
          <div className="flex animate-pulse items-center gap-8 px-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 w-80 shrink-0 rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="glass-card mx-auto flex max-w-md flex-col items-center justify-center p-8 text-center text-[#71717A]">
            <CalendarDays className="mb-3 h-10 w-10 text-[#3B82F6]" />
            <h4 className="text-sm font-bold text-white">
              No Milestones Found
            </h4>
            <p className="mt-1 text-xs text-[#9A9A9A]">
              Add events in Google Calendar to automatically display interactive
              timeline milestones.
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex cursor-grab scrollbar-none items-center overflow-x-auto pt-8 pb-8 select-none active:cursor-grabbing"
            style={{ scrollSnapType: "x mandatory" }}
          >
            <div className="relative flex min-w-max items-center gap-12 px-12">
              {/* Continuous Glowing Center Line Axis */}
              <div className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-[#3B82F6]/20 via-[#3B82F6] to-[#3B82F6]/20" />

              {displayItems.map((item, idx) => {
                const isEven = idx % 2 === 0; // Even = Card Above, Odd = Card Below
                const IconComponent =
                  milestoneIcons[idx % milestoneIcons.length];
                const isActive = idx === activeItemIndex;

                return (
                  <div
                    key={idx}
                    className="relative flex h-[480px] w-[320px] shrink-0 flex-col items-center justify-center sm:w-[360px]"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    {/* CENTER NODE DOT (Sits directly on the line) */}
                    <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#050505] transition-all duration-300 ${
                          isActive
                            ? "scale-125 bg-[#3B82F6] text-white shadow-[0_0_25px_rgba(59,130,246,0.9)]"
                            : "bg-[#101010] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                        }`}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {/* CONNECTING VERTICAL LINE (From Node to Card) */}
                    <div
                      className={`absolute left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#3B82F6] to-[#3B82F6]/30 ${
                        isEven ? "bottom-1/2 h-20" : "top-1/2 h-20"
                      }`}
                    />

                    {/* MILESTONE CARD (Alternates Above / Below Line) */}
                    <motion.div
                      initial={{ opacity: 0, y: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className={`glass-card group relative w-full p-6 transition-all duration-300 ${
                        isEven ? "mb-auto" : "mt-auto"
                      } ${
                        isActive
                          ? "scale-[1.02] border-[#3B82F6]/60 bg-white/[0.06] shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                          : "border-white/10 hover:border-[#3B82F6]/40 hover:bg-white/[0.05]"
                      }`}
                    >
                      {/* Year Badge */}
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/15 px-3 py-1 text-xs font-extrabold tracking-wide text-[#3B82F6]">
                          {item.year}
                        </span>
                        <span className="text-[11px] font-medium text-[#9A9A9A]">
                          {item.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-4 line-clamp-1 text-base leading-snug font-bold text-white transition-colors group-hover:text-[#3B82F6]">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#9A9A9A]">
                        {item.description}
                      </p>

                      {/* Venue / Location Footer */}
                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-[#71717A]">
                        <span className="truncate">{item.venue}</span>
                        <span className="font-semibold text-white/40">
                          #{idx + 1}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
