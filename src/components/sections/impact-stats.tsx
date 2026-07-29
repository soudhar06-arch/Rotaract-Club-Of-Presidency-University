"use client";

import { motion } from "framer-motion";
import { Users, FolderCheck, Calendar, Trophy } from "lucide-react";
import { CountUp } from "@/components/shared";

const STATS = [
  {
    icon: Users,
    value: 350,
    suffix: "+",
    label: "Active Members",
    desc: "Passionate university student leaders driving community welfare.",
  },
  {
    icon: FolderCheck,
    value: 120,
    suffix: "+",
    label: "Projects Delivered",
    desc: "Spanning reforestation, blood donation, and digital literacy.",
  },
  {
    icon: Calendar,
    value: 20000,
    suffix: "+",
    label: "Volunteer Hours",
    desc: "Direct hands-on community service across urban & rural hubs.",
  },
  {
    icon: Trophy,
    value: 15,
    suffix: "",
    label: "District Awards",
    desc: "Recognized for service impact and organizational governance.",
  },
];

export function ImpactStatsSection() {
  return (
    <section className="section-shell border-y border-white/10 py-24">
      <div className="mx-auto mb-16 max-w-xl space-y-3 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Real Evidence of Service
        </span>
        <h2 className="text-heading-xl font-bold text-white">
          Impact by the Numbers
        </h2>
        <p className="text-body text-[color:var(--color-text-muted)]">
          Every project, drive, and meeting creates measurable change for our
          campus and society.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="glass-card group relative overflow-hidden p-8"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-accent-blue)]/10 text-[color:var(--color-brand-accent-blue)] transition-transform group-hover:scale-110">
              <stat.icon className="h-6 w-6" />
            </div>
            <span className="font-geist mb-2 block text-4xl font-extrabold text-white">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </span>
            <h3 className="text-heading-s mb-2 font-semibold text-[color:var(--color-brand-accent-blue)]">
              {stat.label}
            </h3>
            <p className="text-body-small leading-relaxed text-[color:var(--color-text-muted)]">
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
