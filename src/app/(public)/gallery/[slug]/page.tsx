import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants";

export default function GalleryAlbumPage() {
  const IMAGES = [
    "/images/gallery-youth-summit.png",
    "/images/project-featured.png",
    "/images/hero-community.png",
    "/images/event-blood-drive.png",
  ];

  return (
    <div className="space-y-12 pt-28 pb-20">
      <div className="container-shell space-y-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.GALLERY}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Albums</span>
        </Link>

        <div>
          <span className="font-mono text-xs font-bold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
            Album View
          </span>
          <h1 className="text-display-l mt-1 font-bold text-[color:var(--color-text-primary)]">
            Youth Leadership Summit 2026 Photos
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {IMAGES.map((src, idx) => (
            <div
              key={idx}
              className="shadow-medium group relative aspect-[4/3] overflow-hidden rounded-3xl border border-[color:var(--color-border)]"
            >
              <Image
                src={src}
                alt={`Album item ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
