"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "@/components/shared/content-image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ProjectSlideshowProps {
  coverImage?: string;
  images?: string[];
  title: string;
  className?: string;
  autoPlayInterval?: number;
  sizes?: string;
}

export function ProjectSlideshow({
  coverImage,
  images = [],
  title,
  className = "relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/10",
  autoPlayInterval = 5000,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px",
}: ProjectSlideshowProps) {
  // Normalize gallery list: Ensure coverImage is first
  const primaryCover = coverImage || (images.length > 0 ? images[0] : "/images/no-photo.svg");

  // Client-side deterministic ordering of non-cover images using useMemo
  const slides = useMemo(() => {
    const rawList = images.length > 0 ? images : [primaryCover];
    const rest = rawList.filter((img) => img !== primaryCover);

    if (rest.length <= 1) {
      return Array.from(new Set([primaryCover, ...rest]));
    }

    // Deterministic sort based on image string hash to satisfy purity rules
    const hash = (str: string) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
      }
      return h;
    };

    const shuffledRest = [...rest].sort((a, b) => hash(a) - hash(b));
    return Array.from(new Set([primaryCover, ...shuffledRest]));
  }, [images, primaryCover]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay functionality: pauses when hovered/interacted with
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slides.length, isHovered, autoPlayInterval, handleNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 40) handlePrev();
    else if (diffX < -40) handleNext();
    touchStartX.current = null;
  };

  // Keyboard navigation when focused/hovered
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  if (slides.length <= 1) {
    return (
      <div className={className}>
        <Image
          src={slides[0] || primaryCover}
          alt={title}
          fill
          sizes={sizes}
          className="object-cover"
        />
        {slides[0] === primaryCover && (
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-black/70 text-[#3B82F6] border border-[#3B82F6]/30 backdrop-blur-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#3B82F6]" />
            <span>Cover</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`group ${className} focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 select-none`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentIndex]}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.3 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentIndex % slides.length]}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Cover Image Indicator */}
      {slides[currentIndex] === primaryCover && (
        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-black/70 text-[#3B82F6] border border-[#3B82F6]/30 backdrop-blur-md flex items-center gap-1">
          <Star className="w-3 h-3 fill-[#3B82F6]" />
          <span>Cover Visual</span>
        </div>
      )}

      {/* Slide Index Counter */}
      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-black/70 text-white/90 border border-white/10 backdrop-blur-md">
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-all border border-white/10 backdrop-blur-md"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-all border border-white/10 backdrop-blur-md"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-6 bg-[#3B82F6]"
                : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
