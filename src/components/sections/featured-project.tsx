"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Tag, X } from "lucide-react";
import { Project, MOCK_PROJECTS } from "@/services/mock-data";

export function FeaturedProjectSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = [
    "All",
    "Community Service",
    "Youth Empowerment",
    "Environment",
    "Professional Growth",
  ];

  const filteredProjects =
    activeFilter === "All"
      ? MOCK_PROJECTS
      : MOCK_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="section-shell relative z-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
          >
            FLAGSHIP INITIATIVES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-heading-xl mt-3 font-bold tracking-tight text-white"
          >
            Featured Projects & Impact
          </motion.h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeFilter === cat
                  ? "shadow-glow bg-[#3B82F6] text-white"
                  : "border border-white/10 bg-white/[0.04] text-[#9A9A9A] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card group overflow-hidden"
          >
            {/* Project Image Box */}
            <div className="relative h-64 w-full overflow-hidden bg-[#101010]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="rounded-md border border-white/20 bg-[#0A0A0A]/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  {project.category}
                </span>
                <span className="rounded-md border border-[#3B82F6]/40 bg-[#3B82F6]/20 px-3 py-1 text-[11px] font-semibold text-[#3B82F6] backdrop-blur-md">
                  {project.impactMetric}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#3B82F6]">
                {project.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#9A9A9A]">
                {project.summary}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-[#3B82F6]" />
                  <div className="flex gap-1.5">
                    {project.tags.map((t, i) => (
                      <span key={i} className="text-[10px] text-[#71717A]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] hover:underline"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 rounded-lg bg-white/10 p-2 text-[#9A9A9A] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
              </div>

              <span className="mt-6 inline-block text-xs font-semibold text-[#3B82F6] uppercase">
                {selectedProject.category} • {selectedProject.year}
              </span>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {selectedProject.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#D4D4D4]">
                {selectedProject.description}
              </p>

              <div className="mt-6 rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 p-4">
                <p className="text-xs font-semibold text-[#3B82F6]">
                  Key Achievement Metric
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {selectedProject.impactMetric}
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-xl bg-[#3B82F6] px-6 py-2.5 text-xs font-semibold text-white"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
