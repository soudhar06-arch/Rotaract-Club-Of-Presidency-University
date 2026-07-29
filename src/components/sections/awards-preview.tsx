"use client";

import { motion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";

const AWARDS_TIMELINE = [
  {
    year: "2025-2026",
    title: "Best Outstanding Rotaract Club (District 3191)",
    category: "District Excellence",
    description:
      "Awarded for exceptional community impact, financial transparency, and active membership engagement across all chapter avenues.",
  },
  {
    year: "2024-2025",
    title: "Best Community Service Initiative",
    category: "Project Honor",
    description:
      "Recognized for the Green Campus Revolution ecological campaign planting over 1,000 native trees.",
  },
  {
    year: "2023-2024",
    title: "Excellence in Youth Leadership & Literacy",
    category: "Leadership Recognition",
    description:
      "Honored for conducting over 15 digital literacy workshops in rural public schools.",
  },
];

export function AwardsPreviewSection() {
  return (
    <section className="section-shell border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/30 py-20">
      <div className="mx-auto mb-16 max-w-xl space-y-3 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-accent-blue)] uppercase dark:text-[color:var(--color-brand-rotary-gold)]">
          Honors & Recognition
        </span>
        <h2 className="text-heading-xl font-bold text-[color:var(--color-text-primary)]">
          A Legacy of Excellence
        </h2>
        <p className="text-body text-[color:var(--color-text-secondary)]">
          Our chapter continuously earns recognition across Rotary District 3191
          for impactful service and leadership.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Timeline Line */}
        <div className="absolute top-0 bottom-0 left-4 w-0.5 -translate-x-1/2 bg-[color:var(--color-border)] sm:left-1/2" />

        <div className="space-y-12">
          {AWARDS_TIMELINE.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.08 }}
                className={`relative flex flex-col items-start sm:flex-row ${
                  isEven ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="shadow-small absolute top-0 left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[color:var(--color-brand-rotary-gold)] bg-[color:var(--color-surface)] text-[color:var(--color-brand-rotary-gold)] sm:left-1/2">
                  <Sparkles className="h-4 w-4" />
                </div>

                {/* Content Card */}
                <div
                  className={`ml-12 sm:ml-0 sm:w-1/2 ${isEven ? "sm:pr-10" : "sm:pl-10"}`}
                >
                  <div className="shadow-medium hover-lift rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[color:var(--color-bg-secondary)] px-2.5 py-1 font-mono text-xs font-bold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                        {item.year}
                      </span>
                      <span className="text-[11px] font-semibold text-[color:var(--color-text-muted)] uppercase">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-heading-s mb-2 flex items-center gap-2 font-bold text-[color:var(--color-text-primary)]">
                      <Award className="h-4 w-4 shrink-0 text-[color:var(--color-brand-rotary-gold)]" />
                      <span>{item.title}</span>
                    </h3>
                    <p className="text-body-small text-[color:var(--color-text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
