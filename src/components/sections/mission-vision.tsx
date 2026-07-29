"use client";

import { motion } from "framer-motion";
import { Target, Eye, Compass, ShieldCheck } from "lucide-react";

const PILLARS = [
  {
    icon: Target,
    title: "Our Mission",
    subtitle: "Service Above Self",
    description:
      "To empower young adults with skills, opportunities, and leadership capacity to drive sustainable community growth, professional excellence, and international understanding.",
    accent: "border-l-4 border-l-[color:var(--color-brand-accent-blue)]",
  },
  {
    icon: Eye,
    title: "Our Vision",
    subtitle: "A World of Impact",
    description:
      "To be the premier university youth institution recognized for ethical leadership, civic engagement, social innovation, and building compassionate global leaders.",
    accent: "border-l-4 border-l-[color:var(--color-brand-rotary-gold)]",
  },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    text: "Upholding high ethical standards in all service endeavors.",
  },
  {
    icon: Compass,
    title: "Fellowship",
    text: "Fostering lifelong friendships and collaborative networks.",
  },
];

export function MissionVisionSection() {
  return (
    <section
      id="mission"
      className="section-shell relative scroll-mt-24 bg-[color:var(--color-bg-primary)] py-20"
    >
      <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Purpose & Principles
        </span>
        <h2 className="text-heading-xl font-bold text-[color:var(--color-text-primary)]">
          Guided by Service, Driven by Innovation
        </h2>
        <p className="text-body text-[color:var(--color-text-secondary)]">
          Rotaract brings together student leaders to address real-world
          community challenges with purpose, warmth, and modern execution.
        </p>
      </div>

      {/* Split Mission & Vision Cards */}
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {PILLARS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.1 }}
            className={`shadow-medium transition-smooth hover-lift rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 ${item.accent}`}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-bg-secondary)] text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
              <item.icon className="h-6 w-6" />
            </div>
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[color:var(--color-text-muted)] uppercase">
              {item.subtitle}
            </span>
            <h3 className="text-heading-l mb-4 font-bold text-[color:var(--color-text-primary)]">
              {item.title}
            </h3>
            <p className="text-body leading-relaxed text-[color:var(--color-text-secondary)]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Core Values Strip */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {CORE_VALUES.map((val, i) => (
          <div
            key={i}
            className="shadow-small flex items-start gap-4 rounded-2xl border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-brand-rotary-gold)]/10 text-[color:var(--color-brand-rotary-gold)]">
              <val.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-heading-s mb-1 font-semibold text-[color:var(--color-text-primary)]">
                {val.title}
              </h4>
              <p className="text-body-small text-[color:var(--color-text-secondary)]">
                {val.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
