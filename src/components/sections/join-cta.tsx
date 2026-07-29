"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ROUTES } from "@/constants";

export function JoinCtaSection() {
  return (
    <section className="section-shell bg-[color:var(--color-bg-primary)] py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="shadow-hero relative overflow-hidden rounded-3xl bg-gradient-to-r from-[color:var(--color-brand-accent-blue)] to-[#002f68] p-10 text-center text-white sm:p-16"
      >
        {/* Glowing Background Overlay */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[color:var(--color-brand-rotary-gold)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <div className="shadow-small inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-[color:var(--color-brand-rotary-gold)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join 250+ Campus Leaders</span>
          </div>

          <h2 className="text-display-l font-geist font-extrabold tracking-tight text-balance text-white">
            Ready to Make Your Mark?
          </h2>

          <p className="text-body-large font-normal text-slate-200">
            Become a part of the Rotaract Club of Presidency University. Build
            leadership skills, connect with global networks, and serve society.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href={ROUTES.JOIN}
              className="shadow-large inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[color:var(--color-brand-rotary-gold)] px-8 py-4 text-sm font-bold text-slate-950 transition-all hover:scale-[1.02] hover:bg-[color:var(--color-brand-rotary-gold)]/90 active:scale-[0.98] sm:w-auto"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
