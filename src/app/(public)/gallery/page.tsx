"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import initialGalleryData from "@/data/gallery.json";
import { BackButton } from "@/components/shared/back-button";
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";

interface GalleryItem {
  id: string | number;
  src: string;
  title: string;
  category: string;
  date: string;
}

const DEFAULT_ITEMS: GalleryItem[] = (initialGalleryData as Array<Record<string, unknown>>).map((g, idx) => ({
  id: String(g.id || idx + 1),
  src: String(g.url || g.src || "/gallery/gallery-1.jpeg"),
  title: String(g.name || g.title || "Rotaract Event Photo"),
  category: String(g.category || "Events"),
  date: String(g.uploadedAt || g.date || "2026"),
}));

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Live fetch from CMS API
  useEffect(() => {
    let active = true;
    fetch("/api/cms?module=gallery")
      .then((res) => res.json())
      .then((res) => {
        if (active && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setItems(
            res.data.map((g: Record<string, unknown>, idx: number) => ({
              id: String(g.id || idx + 1),
              src: String(g.url || g.src || "/gallery/gallery-1.jpeg"),
              title: String(g.name || g.title || "Rotaract Event Media"),
              category: String(g.category || "Events"),
              date: String(g.uploadedAt || g.date || "2026"),
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const categories = ["All", "Events", "Community", "Project", "Event", "BOD", "Hero", "International", "Campus"];

  const filteredItems = items.filter(
    (item) =>
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredItems.length - 1 : prev - 1;
    });
  }, [filteredItems.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredItems.length - 1 ? 0 : prev + 1;
    });
  }, [filteredItems.length]);

  // Keyboard navigation & escape listener for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <div className="section-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <BackButton fallbackRoute="/" className="mb-6" />

        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Media & Event Gallery
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase font-sans">
            Impact in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400">Pictures.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            High-resolution visual archives of community projects, installation ceremonies, youth leadership bootcamps, and international exchanges.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25 border border-[#3B82F6]"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-[#3B82F6]/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#3B82F6]/10 aspect-[4/3]"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-[#3B82F6] font-bold uppercase tracking-widest block mb-1">
                  {item.category} • {item.date}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white/80">
                  <Maximize2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Enlarge Photo</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="relative max-w-5xl w-full max-h-[80vh] aspect-[16/10] overflow-hidden rounded-3xl border border-white/20">
              <Image
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].title}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-6 inset-x-0 text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 inline-block">
                {filteredItems[lightboxIndex].category}
              </span>
              <h2 className="text-lg font-bold text-white">{filteredItems[lightboxIndex].title}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
