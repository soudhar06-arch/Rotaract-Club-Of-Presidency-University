"use client";
import { useCMS } from "@/hooks/use-cms";

import { motion } from "framer-motion";

export function SponsorsSection() {
  const { data: records } = useCMS<{ name: string; description: string }[]>("partners", []);
  const SPONSORS = records.map(r => ({ ...r, category: r.description }));
  return (
    <section className="section-shell border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] py-16">
      <div className="mb-10 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-text-muted)] uppercase">
          Trusted Partners & Institutional Sponsors
        </span>
      </div>

      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:gap-12">
        {SPONSORS.map((sponsor, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="shadow-small flex flex-col items-center rounded-2xl border border-[color:var(--color-border)]/50 bg-[color:var(--color-surface)]/60 p-3 opacity-80 transition-opacity hover:opacity-100"
          >
            <span className="font-geist text-sm font-bold text-[color:var(--color-text-primary)]">
              {sponsor.name}
            </span>
            <span className="font-mono text-[10px] text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
              {sponsor.category}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
