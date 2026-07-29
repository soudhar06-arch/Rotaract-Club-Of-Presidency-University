"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Joining Rotaract transformed my college journey. I gained confidence, real project leadership experience, and lifelong friends who share a passion for service.",
    author: "Sneha Reddy",
    role: "Past President & Alumna",
    year: "Batch of 2024",
  },
  {
    quote:
      "The Rotaract Club of Presidency University is a beacon of student initiative. Their community service drives demonstrate genuine organization and leadership maturity.",
    author: "Dr. Ramesh Babu",
    role: "Faculty Coordinator",
    year: "Presidency University",
  },
  {
    quote:
      "Collaborating on environmental and blood donation drives with Rotaract showed me how youth action can deliver immediate impact for families in need.",
    author: "Vikram Mehta",
    role: "Community Partner Lead",
    year: "Rotary District 3191",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-shell border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/40 py-20">
      <div className="mx-auto mb-16 max-w-xl space-y-3 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-accent-blue)] uppercase dark:text-[color:var(--color-brand-rotary-gold)]">
          Member Voices
        </span>
        <h2 className="text-heading-xl font-bold text-[color:var(--color-text-primary)]">
          Stories of Growth & Community
        </h2>
        <p className="text-body text-[color:var(--color-text-secondary)]">
          Hear from student leaders, alumni, and faculty advisors about their
          experience with Rotaract.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.08 }}
            className="shadow-medium transition-smooth hover-lift flex flex-col justify-between rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8"
          >
            <div className="space-y-4">
              <Quote className="h-8 w-8 text-[color:var(--color-brand-rotary-gold)]/60" />
              <p className="text-body leading-relaxed text-[color:var(--color-text-secondary)] italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[color:var(--color-border)]/60 pt-6">
              <div>
                <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]">
                  {item.author}
                </h3>
                <p className="text-xs text-[color:var(--color-text-muted)]">
                  {item.role}
                </p>
              </div>
              <span className="font-mono text-[11px] font-medium text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                {item.year}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
