"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Save,
  X,
  RefreshCw,
  Star,
  ArrowUp,
  ArrowDown,
  Upload,
  ImageIcon,
} from "lucide-react";
import { ProjectItem } from "@/lib/cms-store";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<ProjectItem>>({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    category: "Community Service",
    date: new Date().toISOString().split("T")[0],
    venue: "Presidency University Campus",
    coverImage: "/gallery/gallery-1.jpeg",
    images: ["/gallery/gallery-1.jpeg"],
    featured: false,
    published: true,
  });

  const loadProjects = useCallback(() => {
    setLoading(true);
    fetch("/api/admin?module=projects")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setProjects(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin?module=projects")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.success) {
          setProjects(res.data);
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

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      category: "Community Service",
      date: new Date().toISOString().split("T")[0],
      venue: "Presidency University Campus",
      coverImage: "/gallery/gallery-1.jpeg",
      images: ["/gallery/gallery-1.jpeg"],
      featured: false,
      published: true,
    });
    setNewImageUrl("");
    setIsAdding(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    const imagesList = Array.isArray(proj.images) && proj.images.length > 0
      ? proj.images
      : [proj.coverImage || proj.image || "/gallery/gallery-1.jpeg"];
    const cover = proj.coverImage || proj.image || imagesList[0];

    setEditingProject(proj);
    setFormData({
      ...proj,
      coverImage: cover,
      images: imagesList.includes(cover) ? imagesList : [cover, ...imagesList],
    });
    setNewImageUrl("");
  };

  // Image Gallery Handlers
  const handleAddImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;

    const currentImages = formData.images || [];
    if (currentImages.includes(url)) return;

    const updatedImages = [...currentImages, url];
    setFormData({
      ...formData,
      images: updatedImages,
      coverImage: formData.coverImage || url,
    });
    setNewImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append("files", files[i]);
      }

      const res = await fetch("/api/admin/drive/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        const currentImages = formData.images || [];
        const combined = Array.from(new Set([...currentImages, ...data.urls]));
        setFormData({
          ...formData,
          images: combined,
          coverImage: formData.coverImage || combined[0],
        });
      }
    } catch {
      alert("File upload error. Local static fallback retained.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imgToRemove: string) => {
    const currentImages = formData.images || [];
    if (currentImages.length <= 1) {
      alert("Projects must contain at least one visual image.");
      return;
    }

    const updatedImages = currentImages.filter((img) => img !== imgToRemove);
    let updatedCover = formData.coverImage;

    if (updatedCover === imgToRemove) {
      updatedCover = updatedImages[0];
    }

    setFormData({
      ...formData,
      images: updatedImages,
      coverImage: updatedCover,
    });
  };

  const handleSetCover = (imgToCover: string) => {
    const currentImages = formData.images || [];
    const reordered = [imgToCover, ...currentImages.filter((i) => i !== imgToCover)];
    setFormData({
      ...formData,
      coverImage: imgToCover,
      images: reordered,
    });
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const currentImages = [...(formData.images || [])];
    if (direction === "up" && index > 0) {
      const temp = currentImages[index];
      currentImages[index] = currentImages[index - 1];
      currentImages[index - 1] = temp;
    } else if (direction === "down" && index < currentImages.length - 1) {
      const temp = currentImages[index];
      currentImages[index] = currentImages[index + 1];
      currentImages[index + 1] = temp;
    }
    setFormData({ ...formData, images: currentImages });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    const action = editingProject ? "update" : "create";
    const payload = editingProject
      ? { ...editingProject, ...formData }
      : { ...formData, slug: formData.slug || formData.title?.toLowerCase().replace(/\s+/g, "-") };

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "projects", action, payload }),
    });

    const data = await res.json();
    if (data.success) {
      setEditingProject(null);
      setIsAdding(false);
      loadProjects();
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project: ${title}?`)) return;

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "projects", action: "delete", payload: { id } }),
    });

    const data = await res.json();
    if (data.success) loadProjects();
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            CMS Project & Impact Archive
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Projects ({projects.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProjects}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search projects by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Multi-Image Add / Edit Form Modal */}
      {(isAdding || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0F121C] p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingProject(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white">
              {editingProject ? `Edit Project — ${editingProject.title}` : "Create New Project"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Project Title *
                </label>
                <input
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Petals of Power"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category || "Community Service"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#151922] px-4 py-2.5 text-xs text-white"
                >
                  <option value="Community Service">Community Service</option>
                  <option value="Professional Development">Professional Development</option>
                  <option value="Health Awareness">Health Awareness</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Cultural">Cultural</option>
                  <option value="International Service">International Service</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Conducted Date
                </label>
                <input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Venue / Location
                </label>
                <input
                  value={formData.venue || ""}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Presidency University Campus"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* MULTI-IMAGE PROJECT GALLERY EDITOR */}
            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#3B82F6]" />
                    <span>Project Image Gallery ({formData.images?.length || 0})</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Upload or add multiple gallery images. Reorder or select any image as the cover.
                  </p>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30 border border-[#3B82F6]/30 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? "Uploading..." : "Upload Files"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Add Image via URL input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or enter image path / Google Drive URL (/gallery/gallery-1.jpeg)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Add Image
                </button>
              </div>

              {/* Thumbnails Gallery Manager */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                {(formData.images || []).map((imgUrl, idx) => {
                  const isCover = imgUrl === formData.coverImage || idx === 0;
                  return (
                    <div
                      key={`${imgUrl}-${idx}`}
                      className={`relative p-2 rounded-xl border ${
                        isCover ? "border-[#3B82F6] bg-[#3B82F6]/10" : "border-white/10 bg-black/40"
                      } flex flex-col justify-between space-y-2`}
                    >
                      <div className="relative h-28 w-full rounded-lg overflow-hidden bg-zinc-950 border border-white/5">
                        <Image src={imgUrl} alt={`Gallery ${idx}`} fill className="object-cover" />

                        {isCover && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-[#3B82F6] text-white flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-white" />
                            <span>COVER</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span className="truncate max-w-[120px]" title={imgUrl}>
                          #{idx + 1} {imgUrl.split("/").pop()}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, "down")}
                            disabled={idx === (formData.images?.length || 0) - 1}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(imgUrl)}
                              className="px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30 font-semibold"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Short Overview / Case Study Summary
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription || ""}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary displayed on project cards..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Full Description / Impact Details
              </label>
              <textarea
                rows={4}
                value={formData.fullDescription || ""}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Detailed case study explanation..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-white/10 bg-white/5 text-[#3B82F6]"
                />
                <span>Feature on Homepage Story Section</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingProject(null);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 shadow-lg shadow-[#3B82F6]/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading project archive...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-[#3B82F6]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                  <Image
                    src={proj.coverImage || proj.image || "/gallery/gallery-1.jpeg"}
                    alt={proj.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-black/70 backdrop-blur-md text-[#3B82F6] border border-[#3B82F6]/30 font-bold">
                      {proj.category}
                    </span>
                    {proj.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-300" />
                        Featured
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-black/70 backdrop-blur-md text-white border border-white/10">
                    📷 {proj.images?.length || 1} photos
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{proj.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {proj.shortDescription || proj.fullDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <button
                  onClick={() => openEditModal(proj)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Edit Gallery ({proj.images?.length || 1})</span>
                </button>

                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
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
