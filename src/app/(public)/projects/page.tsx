"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, MoveRight, X } from "lucide-react";
import initialProjectsData from "@/data/projects.json";
import { ProjectSlideshow } from "@/components/shared/project-slideshow";
import { BackButton } from "@/components/shared/back-button";

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  shortDescription?: string;
  fullDescription?: string;
  objective?: string;
  featured?: boolean;
  image?: string;
  coverImage?: string;
  images?: string[];
  collaborators?: string[];
  participants?: number;
  beneficiaries?: number;
  volunteers?: number;
  platform?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(
    (initialProjectsData as Array<Record<string, unknown>>).map((p) => ({
      id: String(p.id || ""),
      title: String(p.title || ""),
      category: String(p.category || "General"),
      date: String(p.date || ""),
      venue: String(p.venue || ""),
      description: String(p.description || p.shortDescription || ""),
      shortDescription: String(p.shortDescription || p.description || ""),
      fullDescription: String(p.fullDescription || p.description || ""),
      image: String(p.image || "/gallery/gallery-1.jpeg"),
      featured: Boolean(p.featured),
      participants: typeof p.participants === "number" ? p.participants : undefined,
      beneficiaries: typeof p.beneficiaries === "number" ? p.beneficiaries : undefined,
      volunteers: typeof p.volunteers === "number" ? p.volunteers : undefined,
    }))
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Fetch live CMS data
  useEffect(() => {
    let active = true;
    fetch("/api/cms?module=projects")
      .then((res) => res.json())
      .then((res) => {
        if (active && res.success && Array.isArray(res.data)) {
          setProjects(
            res.data.map((p: Record<string, unknown>) => ({
              id: String(p.id || ""),
              title: String(p.title || ""),
              category: String(p.category || "General"),
              date: String(p.date || ""),
              venue: String(p.venue || ""),
              description: String(p.shortDescription || p.description || ""),
              shortDescription: String(p.shortDescription || p.description || ""),
              fullDescription: String(p.fullDescription || p.description || ""),
              image: String(p.image || "/gallery/gallery-1.jpeg"),
              featured: Boolean(p.featured),
              participants: typeof p.participants === "number" ? p.participants : undefined,
              beneficiaries: typeof p.beneficiaries === "number" ? p.beneficiaries : undefined,
              volunteers: typeof p.volunteers === "number" ? p.volunteers : undefined,
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const categories = [
    "All",
    "Community Service",
    "Professional Development",
    "Health Awareness",
    "Environmental",
    "Cultural",
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
        );

  // Global ESC Key Handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="section-shell pt-32 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <BackButton fallbackRoute="/#projects" className="mb-2" />

        {/* Page Hero */}
        <div className="space-y-4">
          <span className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase">
            PROJECT ARCHIVE & CASE STUDIES
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white uppercase">
            Impact, documented.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#9A9A9A]">
            Explore our complete archive of community healthcare drives, skill development bootcamps, environmental conservation initiatives, and fellowship programs.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    : "border border-white/10 bg-white/[0.04] text-[#9A9A9A] hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Editorial Archive */}
        <div className="mt-10 space-y-8">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 hover:border-[#3B82F6]/50 hover:bg-[#0F1117] hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
            >
              <div className="grid gap-8 md:grid-cols-12 md:items-center">
                {/* Visual Cover / Gallery Slideshow */}
                <div className="md:col-span-5">
                  <ProjectSlideshow
                    coverImage={project.coverImage || project.image}
                    images={project.images}
                    title={project.title}
                  />
                </div>

                {/* Content Block */}
                <div className="space-y-4 md:col-span-7">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#9A9A9A]">
                    {project.date && (
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                        {project.date}
                      </span>
                    )}
                    {project.venue && (
                      <span className="flex items-center gap-1.5 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                        {project.venue}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#3B82F6] transition-colors">
                    {project.title}
                  </h2>

                  <p className="text-sm text-[#9A9A9A] leading-relaxed line-clamp-3">
                    {project.description || project.shortDescription || project.fullDescription}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#3B82F6]">
                    <span>Read Case Study</span>
                    <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Modal Detailed View */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0D111D] p-6 sm:p-10 space-y-6 shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <ProjectSlideshow
                  coverImage={selectedProject.coverImage || selectedProject.image}
                  images={selectedProject.images}
                  title={selectedProject.title}
                />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                    {selectedProject.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#3B82F6]" />
                        {selectedProject.date}
                      </span>
                    )}
                    {selectedProject.venue && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#3B82F6]" />
                        {selectedProject.venue}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-zinc-300">
                  <p>{selectedProject.fullDescription || selectedProject.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
