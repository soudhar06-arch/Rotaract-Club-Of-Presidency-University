"use client";

import { motion } from "framer-motion";
import { Users, FolderCheck, Calendar, Trophy } from "lucide-react";

const STATS = [
  {
    icon: Users,
    count: "250+",
    label: "Active Members",
    desc: "Passionate university leaders driving civic initiatives.",
  },
  {
    icon: FolderCheck,
    count: "40+",
    label: "Projects Executed",
    desc: "Spanning environment, health, education, and literacy.",
  },
  {
    icon: Calendar,
    count: "15,000+",
    label: "Beneficiaries Served",
    desc: "Direct positive impact across local urban & rural communities.",
  },
  {
    icon: Trophy,
    count: "12",
    label: "District Awards",
    desc: "Recognized for chapter excellence and community service.",
  },
];

export function ImpactStatsSection() {
  return (
    <section className="section-shell border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/50 py-20">
      <div className="mx-auto mb-16 max-w-xl space-y-3 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-accent-blue)] uppercase dark:text-[color:var(--color-brand-rotary-gold)]">
          Real Evidence of Service
        </span>
        <h2 className="text-heading-xl font-bold text-[color:var(--color-text-primary)]">
          Impact by the Numbers
        </h2>
        <p className="text-body text-[color:var(--color-text-secondary)]">
          Every project, event, and initiative creates measurable change for our
          campus and society.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.08 }}
            className="shadow-small hover:shadow-medium group rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 transition-all hover:-translate-y-1"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-accent-blue)]/10 text-[color:var(--color-brand-accent-blue)] transition-transform group-hover:scale-110 dark:text-[color:var(--color-brand-rotary-gold)]">
              <stat.icon className="h-6 w-6" />
            </div>
            <span className="font-geist mb-1 block text-3xl font-extrabold text-[color:var(--color-text-primary)] sm:text-4xl">
              {stat.count}
            </span>
            <h3 className="text-heading-s mb-2 font-semibold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
              {stat.label}
            </h3>
            <p className="text-body-small leading-normal text-[color:var(--color-text-muted)]">
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
