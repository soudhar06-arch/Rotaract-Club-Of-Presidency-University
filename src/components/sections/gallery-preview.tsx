"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { GalleryItem, MOCK_GALLERY } from "@/services/mock-data";

export function GalleryPreviewSection() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Events", "Community", "Leadership", "Cultural"];

  const filteredPhotos =
    activeCategory === "All"
      ? MOCK_GALLERY
      : MOCK_GALLERY.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="section-shell relative z-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
          >
            VISUAL ARCHIVE
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-heading-xl mt-3 font-bold tracking-tight text-white"
          >
            Capturing Moments of Service & Fellowship
          </motion.h2>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "shadow-glow bg-[#3B82F6] text-white"
                  : "border border-white/10 bg-white/[0.04] text-[#9A9A9A] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Masonry Grid */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPhotos.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            onClick={() => setSelectedPhoto(item)}
            className="glass-card group relative h-72 cursor-pointer overflow-hidden"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />

            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <span className="text-[10px] font-semibold text-[#3B82F6] uppercase">
                {item.category} • {item.date}
              </span>
              <h3 className="mt-1 text-base font-bold text-white transition-transform group-hover:-translate-y-1">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-[#9A9A9A] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.description}
              </p>
            </div>

            <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-[#0A0A0A]/60 p-2 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-4 w-4" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="shadow-large relative z-10 max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-2"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2.5 text-white backdrop-blur-md hover:bg-black"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative h-[65vh] w-full">
                <Image
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain"
                />
              </div>

              <div className="bg-[#0A0A0A] p-4 text-center">
                <h4 className="text-lg font-bold text-white">
                  {selectedPhoto.title}
                </h4>
                <p className="mt-1 text-xs text-[#9A9A9A]">
                  {selectedPhoto.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
