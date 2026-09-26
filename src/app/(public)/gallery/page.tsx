"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "@/components/shared/content-image";
import { useCMS } from "@/hooks/use-cms";
import { BackButton } from "@/components/shared/back-button";
import { ChevronLeft, ChevronRight, Images, Sparkles, X } from "lucide-react";

interface MediaItem { id: string; url: string; name: string; category: string; uploadedAt: string }
interface Album { title: string; category: string; photos: MediaItem[] }
const albumTitle = (name: string) => name.split(/\s+(?:—|â€”|-)\s+photo\s+\d+$/i)[0] || "Club Gallery";

export default function GalleryPage() {
  const { data: media, loading, error } = useCMS<MediaItem[]>("gallery", []);
  const albums = useMemo<Album[]>(() => {
    const grouped = new Map<string, MediaItem[]>();
    for (const item of media) { const title = albumTitle(item.name); grouped.set(title, [...(grouped.get(title) || []), item]); }
    return [...grouped.entries()].map(([title, photos]) => ({ title, category: photos[0]?.category || "Event", photos }));
  }, [media]);
  const categories = useMemo(() => ["All", ...new Set(albums.map(album => album.category))], [albums]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const filteredAlbums = albums.filter(album => selectedCategory === "All" || album.category === selectedCategory);
  const close = () => { setSelectedAlbum(null); setPhotoIndex(0); };
  const previous = useCallback(() => setPhotoIndex(index => selectedAlbum ? (index - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length : 0), [selectedAlbum]);
  const next = useCallback(() => setPhotoIndex(index => selectedAlbum ? (index + 1) % selectedAlbum.photos.length : 0), [selectedAlbum]);
  useEffect(() => {
    if (!selectedAlbum) return;
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") close(); if (event.key === "ArrowLeft") previous(); if (event.key === "ArrowRight") next(); };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [selectedAlbum, previous, next]);

  return <div className="section-shell min-h-screen pt-32 pb-24"><div className="mx-auto max-w-7xl px-4 sm:px-6">
    <p role="status" className="text-sm text-zinc-400">{loading ? "Loading…" : error || (!albums.length ? "No published albums yet." : "")}</p>
    <BackButton fallbackRoute="/" className="mb-6" />
    <div className="border-b border-white/10 pb-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-xs font-semibold text-[#3B82F6]"><Sparkles className="h-3.5 w-3.5" />Media & Event Gallery</div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-white uppercase sm:text-6xl">Impact in <span className="bg-gradient-to-r from-[#3B82F6] to-indigo-400 bg-clip-text text-transparent">Pictures.</span></h1>
      <p className="mt-4 max-w-2xl text-zinc-400">Browse each event as a combined photo collection. Open an album to view every image from that event.</p>
      <div className="mt-8 flex flex-wrap gap-2">{categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase ${selectedCategory === category ? "border-[#3B82F6] bg-[#3B82F6] text-white" : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"}`}>{category}</button>)}</div>
    </div>
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredAlbums.map(album => <button key={album.title} type="button" onClick={() => { setSelectedAlbum(album); setPhotoIndex(0); }} className="group text-left">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition-all group-hover:-translate-y-1 group-hover:border-[#3B82F6]/50">
        <Image src={album.photos[0].url} alt={album.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"><Images className="h-4 w-4 text-[#3B82F6]" />+{album.photos.length} photos</div>
        <div className="absolute inset-x-0 bottom-0 p-5"><span className="text-[10px] font-bold tracking-widest text-[#3B82F6] uppercase">Combined collection</span><h2 className="mt-1 text-base font-bold text-white">{album.title}</h2></div>
      </div>
    </button>)}</div>
    {selectedAlbum && selectedAlbum.photos[photoIndex] && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
      <button onClick={close} className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-3 text-white"><X /></button>
      <button onClick={previous} className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white sm:left-8"><ChevronLeft /></button>
      <button onClick={next} className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white sm:right-8"><ChevronRight /></button>
      <div className="relative h-[75vh] w-full max-w-6xl"><Image src={selectedAlbum.photos[photoIndex].url} alt={`${selectedAlbum.title} photo ${photoIndex + 1}`} fill sizes="100vw" className="object-contain" /></div>
      <div className="absolute inset-x-0 bottom-5 text-center text-white"><h2 className="font-bold">{selectedAlbum.title}</h2><p className="text-xs text-zinc-400">{photoIndex + 1} of {selectedAlbum.photos.length}</p></div>
    </div>}
  </div></div>;
}
