"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { ROUTES } from "@/constants";

const GALLERY_PHOTOS = [
  {
    id: 1,
    title: "Youth Leadership Summit Stage",
    tag: "Leadership",
    src: "/images/gallery-youth-summit.png",
    aspect: "aspect-[4/3]",
  },
  {
    id: 2,
    title: "Eco Tree Planting Volunteers",
    tag: "Environment",
    src: "/images/project-featured.png",
    aspect: "aspect-[3/4]",
  },
  {
    id: 3,
    title: "Community Service Drive",
    tag: "Community",
    src: "/images/hero-community.png",
    aspect: "aspect-[16/10]",
  },
  {
    id: 4,
    title: "Campus Blood Donation Desk",
    tag: "Health",
    src: "/images/event-blood-drive.png",
    aspect: "aspect-[4/3]",
  },
];

export function GalleryPreviewSection() {
  return (
    <section
      id="gallery"
      className="section-shell scroll-mt-24 bg-[color:var(--color-bg-primary)] py-20"
    >
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
            Community Moments
          </span>
          <h2 className="text-heading-xl mt-1 font-bold text-[color:var(--color-text-primary)]">
            Life at Rotaract Presidency
          </h2>
        </div>
        <Link
          href={ROUTES.GALLERY}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-accent-blue)] hover:underline dark:text-[color:var(--color-brand-rotary-gold)]"
        >
          <span>Explore Full Gallery</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {GALLERY_PHOTOS.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.06 }}
            className={`group shadow-medium relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] ${photo.aspect}`}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

            <div className="absolute right-4 bottom-4 left-4 flex flex-col justify-end text-white">
              <span className="mb-1 inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
                <ImageIcon className="h-3 w-3" />
                <span>{photo.tag}</span>
              </span>
              <h3 className="text-sm leading-snug font-semibold text-white">
                {photo.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
