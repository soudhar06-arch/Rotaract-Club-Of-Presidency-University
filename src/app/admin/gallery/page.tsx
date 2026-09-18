"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Search, Save, X, RefreshCw } from "lucide-react";
import { MediaItem } from "@/lib/cms-store";

export default function GalleryAdminPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<MediaItem>>({
    name: "",
    url: "/gallery/gallery-1.jpeg",
    category: "Gallery",
    uploadedAt: new Date().toISOString().split("T")[0],
  });

  const loadGallery = useCallback(() => {
    setLoading(true);
    fetch("/api/admin?module=gallery")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setItems(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin?module=gallery")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.success) {
          setItems(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "gallery", action: "create", payload: formData }),
    });

    const data = await res.json();
    if (data.success) {
      setIsAdding(false);
      loadGallery();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete media item: "${name}"?`)) return;

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "gallery", action: "delete", payload: { id } }),
    });

    const data = await res.json();
    if (data.success) loadGallery();
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            CMS Media Manager
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Media Library & Gallery ({items.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadGallery}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setFormData({
                name: "",
                url: "/gallery/gallery-1.jpeg",
                category: "Gallery",
                uploadedAt: new Date().toISOString().split("T")[0],
              });
              setIsAdding(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Asset</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search media by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Add Media Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0F121C] p-6 sm:p-8 space-y-5 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white">Add New Media Asset</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Asset Title / Caption *
                </label>
                <input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Annual Youth Conclave Group Photo"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Image Path / URL *
                </label>
                <input
                  required
                  value={formData.url || ""}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/gallery/gallery-1.jpeg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={formData.category || "Gallery"}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as MediaItem["category"] })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#151922] px-4 py-2.5 text-xs text-white"
                >
                  <option value="Gallery">Gallery</option>
                  <option value="Project">Project</option>
                  <option value="Event">Event</option>
                  <option value="BOD">BOD</option>
                  <option value="Hero">Hero</option>
                  <option value="Award">Award</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 shadow-lg shadow-[#3B82F6]/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Asset</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading gallery assets...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl space-y-3 flex flex-col justify-between hover:border-[#3B82F6]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                  <Image src={item.url} alt={item.name} fill className="object-cover" />
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-black/60 backdrop-blur-md text-blue-300 border border-white/10 font-bold">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{item.url}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] font-mono text-zinc-500">{item.uploadedAt}</span>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
