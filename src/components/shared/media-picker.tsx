"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-fetch";
import type { MediaItem } from "@/lib/cms-store";

export function MediaPicker({ value, onChange, category = "bod" }: { value?: string; onChange: (url: string) => void; category?: "bod" | "events" | "gallery" | "projects" }) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { adminFetch("/api/admin?module=gallery").then(r => r.json()).then(r => { if (r.success) setMedia(r.data); }); }, []);
  return <div className="space-y-3 rounded-xl border border-white/10 p-3">
    <span className="block text-xs text-zinc-400">Photo</span>
    {value && <div className="relative h-36 w-36"><Image unoptimized src={value} alt="Selected photo preview" fill className="rounded-xl object-cover" /></div>}
    <input aria-label="Photo URL" value={value || ""} onChange={e => onChange(e.target.value)} className="w-full rounded-lg bg-white/5 p-2 text-sm" placeholder="Image URL" />
    <select aria-label="Select from media library" value="" onChange={e => onChange(e.target.value)} className="w-full rounded-lg bg-[#151922] p-2 text-sm"><option value="">Select from media library</option>{media.map(item => <option key={item.id} value={item.url}>{item.name}</option>)}</select>
    <label className="inline-block cursor-pointer rounded-lg bg-blue-500 px-3 py-2 text-sm">{uploading ? "Uploading…" : "Upload photo"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} className="sr-only" onChange={async e => {
      const file = e.target.files?.[0]; if (!file) return;
      setUploading(true);
      const body = new FormData(); body.append("files", file); body.append("category", category);
      try { const result = await (await adminFetch("/api/admin/drive/upload", { method: "POST", body })).json(); if (result.success) onChange(result.urls[0]); }
      finally { setUploading(false); e.target.value = ""; }
    }} /></label>
    {value && <button type="button" onClick={() => onChange("")} className="ml-3 text-sm text-zinc-300">Remove photo</button>}
  </div>;
}
