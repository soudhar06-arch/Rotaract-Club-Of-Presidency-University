"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, Save, X, RefreshCw } from "lucide-react";
import { BODMember } from "@/lib/cms-store";

export default function BODAdminPage() {
  const [members, setMembers] = useState<BODMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingMember, setEditingMember] = useState<BODMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<BODMember>>({
    name: "",
    role: "",
    category: "Director",
    bio: "",
    quote: "",
    image: "/gallery/gallery-1.jpeg",
    instagram: "",
    linkedin: "",
    email: "",
  });

  const loadMembers = useCallback(() => {
    setLoading(true);
    fetch("/api/admin?module=bod")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setMembers(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin?module=bod")
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.success) {
          setMembers(res.data);
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
    if (!formData.name || !formData.role) return;

    const action = editingMember ? "update" : "create";
    const payload = editingMember
      ? { ...editingMember, ...formData }
      : formData;

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "bod", action, payload }),
    });

    const data = await res.json();
    if (data.success) {
      setEditingMember(null);
      setIsAdding(false);
      loadMembers();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the BOD list?`)) return;

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "bod", action: "delete", payload: { id } }),
    });

    const data = await res.json();
    if (data.success) loadMembers();
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
            CMS Leadership Management
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Board of Directors ({members.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadMembers}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingMember(null);
              setFormData({
                name: "",
                role: "",
                category: "Director",
                bio: "",
                quote: "",
                image: "/gallery/gallery-1.jpeg",
                instagram: "",
                linkedin: "",
                email: "",
              });
              setIsAdding(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add BOD Member</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search BOD by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Add / Edit Form Modal */}
      {(isAdding || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0F121C] p-6 sm:p-8 space-y-5 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingMember(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white">
              {editingMember ? `Edit Profile — ${editingMember.name}` : "Add New BOD Member"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Deekshitha B"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Position / Role *
                </label>
                <input
                  required
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. President"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={formData.category || "Director"}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as "Executive" | "Director" })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#151922] px-4 py-2.5 text-xs text-white"
                >
                  <option value="Executive">Executive Board</option>
                  <option value="Director">Director / Head</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Profile Photo URL
                </label>
                <input
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/gallery/gallery-1.jpeg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Bio / Role Description
              </label>
              <textarea
                rows={2}
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief summary of duties or accomplishments..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Personal Quote (Optional)
              </label>
              <input
                value={formData.quote || ""}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="Leading with passion and serving with purpose."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingMember(null);
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
                <span>Save Member</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOD Members Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">
          Loading BOD entries...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-[#3B82F6]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                  <Image
                    src={member.image || "/gallery/gallery-1.jpeg"}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-black/60 backdrop-blur-md text-blue-300 border border-white/10 font-bold">
                    {member.category}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#3B82F6] font-bold uppercase tracking-wider block">
                    {member.role}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">{member.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{member.bio}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <button
                  onClick={() => {
                    setEditingMember(member);
                    setFormData(member);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(member.id, member.name)}
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
