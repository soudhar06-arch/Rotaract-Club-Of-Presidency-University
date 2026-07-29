import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Explore photo albums capturing community drives, youth summits, and chapter fellowship.",
};

const ALBUMS = [
  {
    title: "Youth Leadership Summit 2026",
    category: "Leadership",
    photoCount: "24 Photos",
    image: "/images/gallery-youth-summit.png",
    slug: "youth-leadership-summit-2026",
  },
  {
    title: "Green Campus Planting Drive",
    category: "Environment",
    photoCount: "38 Photos",
    image: "/images/project-featured.png",
    slug: "green-campus-drive",
  },
  {
    title: "Community Literacy & Book Drive",
    category: "Education",
    photoCount: "19 Photos",
    image: "/images/hero-community.png",
    slug: "community-literacy",
  },
  {
    title: "Mega Blood Donation Campaign",
    category: "Health",
    photoCount: "45 Photos",
    image: "/images/event-blood-drive.png",
    slug: "blood-donation-2026",
  },
];

export default function GalleryPage() {
  return (
    <div className="space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Chapter Memories
        </span>
        <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
          Photo Gallery & Event Albums
        </h1>
        <p className="text-body-large text-[color:var(--color-text-secondary)]">
          Visual stories of community action, youth fellowship, and service
          excellence.
        </p>
      </section>

      <section className="container-shell px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ALBUMS.map((album, idx) => (
            <Link
              key={idx}
              href={`${ROUTES.GALLERY}/${album.slug}`}
              className="group shadow-medium hover-lift flex flex-col overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-[color:var(--color-surface-glass)] px-3 py-1 text-[11px] font-semibold text-[color:var(--color-text-primary)] backdrop-blur-md">
                  <ImageIcon className="h-3 w-3" />
                  <span>{album.photoCount}</span>
                </div>
              </div>

              <div className="space-y-2 p-5">
                <span className="font-mono text-[10px] font-semibold text-[color:var(--color-brand-rotary-gold)] uppercase">
                  {album.category}
                </span>
                <h2 className="text-heading-s font-bold text-[color:var(--color-text-primary)] transition-colors group-hover:text-[color:var(--color-brand-accent-blue)]">
                  {album.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
