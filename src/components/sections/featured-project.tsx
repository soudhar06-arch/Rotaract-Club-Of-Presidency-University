"use client";
import type { ProjectItem } from "@/lib/cms-store";
import { useCMS } from "@/hooks/use-cms";

import { useState } from "react";
import { motion } from "framer-motion";
import ExpandableProfileCard from "@/components/ui/expandable-profile-card";
import { Tag, Trophy } from "lucide-react";

export function FeaturedProjectSection() {
  const { data: records } = useCMS<ProjectItem[]>("projects", []);
  const projects = records.map((p) => ({
    ...p,
    summary: p.shortDescription || "",
    description: p.fullDescription || p.description || "",
    image: p.image || "/images/no-photo.svg",
    impactMetric:
      p.participants !== undefined ? `${p.participants} participants` : "",
    tags: [p.category],
    year: p.date?.slice(0, 4) || "",
  }));
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
      ? projects
      : projects.filter((p) => p.category === activeFilter);

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
            Events That Happened
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

      {/* Side-by-Side Project Tiles Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="flex w-full justify-center"
          >
            <ExpandableProfileCard
              imageSrc={project.image}
              title={project.title}
              subtitle={`#${String(idx + 1).padStart(2, "0")} • ${project.category} • ${project.year}`}
              content={
                <div className="flex flex-col gap-6 text-left text-white">
                  <div>
                    <span className="mb-2 inline-block rounded-md border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-3 py-1 text-xs font-bold text-[#3B82F6] uppercase">
                      {project.category}
                    </span>
                    <p className="text-xs text-[#9A9A9A]">
                      Year: {project.year}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 text-xs font-semibold tracking-wider text-[#D4D4D4] uppercase">
                      Project Summary
                    </h4>
                    <p className="text-xs leading-relaxed text-[#9A9A9A]">
                      {project.description || project.summary}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-[#3B82F6]" />
                      <p className="text-xs font-semibold text-[#3B82F6] uppercase">
                        Key Impact Metric
                      </p>
                    </div>
                    <p className="text-base font-bold text-white">
                      {project.impactMetric}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                    <Tag className="h-4 w-4 text-[#3B82F6]" />
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-[#D4D4D4]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
