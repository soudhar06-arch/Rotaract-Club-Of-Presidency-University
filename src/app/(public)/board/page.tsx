"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "@/components/shared/content-image";
import { useCMS } from "@/hooks/use-cms";
import { BackButton } from "@/components/shared/back-button";
import { Search, X, Quote, Sparkles, Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

interface BoardMember {
  id: string;
  name: string;
  role: string;
  category: string;
  bio: string;
  image: string;
  quote?: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
}

export default function BoardPage() {
  const { data: boardMembers, loading, error } = useCMS<BoardMember[]>("bod", []);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeMember, setActiveMember] = useState<BoardMember | null>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = ["All", "Executive", "Director"];

  const filteredMembers = useMemo(() => {
    return boardMembers.filter((member) => {
      const matchesCategory =
        selectedCategory === "All" ||
        member.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [boardMembers, selectedCategory, searchQuery]);

  return (
    <div className="section-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p role="status" className="text-sm text-zinc-400">{loading ? "Loading?" : error || (boardMembers.length === 0 ? "No published records yet." : "")}</p>
        <BackButton fallbackRoute="/#leadership" className="mb-6" />

        {/* Header */}
        <div className="relative border-b border-white/10 pb-10">
          <div className="eyebrow flex items-center gap-2 text-primary font-mono tracking-widest text-xs uppercase">
            <Sparkles className="w-4 h-4 text-[#3B82F6]" />
            Rotaract Club of Presidency University • RID 3192
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase font-sans">
            People With <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400">Purpose.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Meet the visionaries, directors, and executive council driving impact, youth leadership, and community service across Presidency University and District 3192.
          </p>

          {/* Filter and Search Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
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
                  {cat === "All" ? "All Leaders" : cat === "Executive" ? "Executive Board" : "Directors & Heads"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search leaders by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#3B82F6] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Board Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setActiveMember(member)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-[#3B82F6]/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#3B82F6]/10 flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="relative h-72 w-full overflow-hidden bg-zinc-950">
                <Image
                  src={member.image || "/images/no-photo.svg"}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-90" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#3B82F6] border border-[#3B82F6]/30">
                    {member.category}
                  </span>
                </div>
              </div>

              {/* Information Box */}
              <div className="p-6 relative z-10 space-y-2 -mt-10 bg-[#0B0F17]/90 backdrop-blur-xl border-t border-white/5">
                <span className="text-xs font-mono text-[#3B82F6] tracking-wider uppercase font-semibold block">
                  {member.role}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#3B82F6] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>

                <div className="pt-3 flex items-center justify-between text-xs font-semibold text-[#3B82F6] group-hover:translate-x-1 transition-transform">
                  <span>View Leadership Bio</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal View for Selected Member */}
        {activeMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0D111D] p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveMember(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-2xl overflow-hidden border-2 border-[#3B82F6]/40 flex-shrink-0 bg-zinc-950">
                  <Image
                    src={activeMember.image || "/images/no-photo.svg"}
                    alt={activeMember.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 inline-block">
                    {activeMember.category} Board
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeMember.name}
                  </h2>
                  <p className="text-sm font-mono text-[#3B82F6] font-bold">
                    {activeMember.role}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                    {activeMember.email && (
                      <a
                        href={`mailto:${activeMember.email}`}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {activeMember.instagram && (
                      <a
                        href={activeMember.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {activeMember.quote && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm italic text-zinc-300 leading-relaxed">
                    &quot;{activeMember.quote}&quot;
                  </p>
                </div>
              )}

              <div className="space-y-2 border-t border-white/10 pt-4">
                <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
                  Biography & Responsibilities
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeMember.bio}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
