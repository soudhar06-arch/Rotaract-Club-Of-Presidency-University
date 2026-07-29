"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Users,
  Award,
  Heart,
} from "lucide-react";
import { ROUTES } from "@/constants";

const HERO_STATS = [
  { icon: Users, value: "1,200+", label: "Lives Impacted" },
  { icon: Award, value: "45+", label: "Community Initiatives" },
  { icon: Heart, value: "10,000+", label: "Volunteer Hours" },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-b from-[color:var(--color-bg-primary)] via-[color:var(--color-bg-secondary)]/30 to-[color:var(--color-bg-primary)] pt-32 pb-20"
    >
      {/* Subtle Atmospheric Background Accents */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[color:var(--color-brand-accent-blue)]/10 to-[color:var(--color-brand-rotary-gold)]/15 blur-3xl" />

      <div className="container-shell relative z-10 my-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Narrative Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="space-y-6 text-center lg:col-span-7 lg:text-left"
          >
            {/* Pill Tag */}
            <div className="shadow-small inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-glass)] px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-brand-rotary-gold)]" />
              <span className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
                Fellowship • Service • Youth Leadership
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-display-xl font-bold tracking-tight text-balance text-[color:var(--color-text-primary)]">
              Empowering Youth. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[color:var(--color-brand-accent-blue)] via-[color:var(--color-brand-accent-blue)] to-[color:var(--color-brand-rotary-gold)] bg-clip-text text-transparent">
                Transforming Communities.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-body-large mx-auto max-w-2xl font-normal text-[color:var(--color-text-secondary)] lg:mx-0">
              The Rotaract Club of Presidency University brings together
              passionate students and young professionals to drive meaningful
              social impact, develop leadership, and build lifelong connections.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <Link
                href={ROUTES.JOIN}
                className="shadow-medium inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[color:var(--color-brand-accent-blue)] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <span>Become a Member</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#projects"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-7 py-3.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-all hover:bg-[color:var(--color-bg-secondary)] active:scale-[0.98] sm:w-auto"
              >
                <span>Explore Initiatives</span>
              </Link>
            </div>

            {/* Animated Stat Badges */}
            <div className="mx-auto grid max-w-xl grid-cols-3 gap-4 border-t border-[color:var(--color-border)]/60 pt-8 lg:mx-0">
              {HERO_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center lg:items-start"
                >
                  <div className="flex items-center gap-1.5 text-xl font-bold text-[color:var(--color-brand-accent-blue)] sm:text-2xl dark:text-[color:var(--color-brand-rotary-gold)]">
                    <stat.icon className="hidden h-4 w-4 sm:inline" />
                    <span>{stat.value}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[color:var(--color-text-muted)] sm:text-xs">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
            className="relative lg:col-span-5"
          >
            <div className="shadow-hero relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero-community.png"
                  alt="Rotaract members engaged in community service"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 p-2 text-white">
                  <p className="font-mono text-xs tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
                    Leadership in Action
                  </p>
                  <p className="text-sm font-semibold">
                    Youth leaders collaborating on community education &
                    service.
                  </p>
                </div>
              </div>

              {/* Floating Feature Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="shadow-large absolute -bottom-6 -left-6 hidden max-w-xs items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-glass)] p-3.5 backdrop-blur-md sm:flex"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-rotary-gold)]/20 font-bold text-[color:var(--color-brand-rotary-gold)]">
                  ★
                </div>
                <div>
                  <p className="text-xs font-bold text-[color:var(--color-text-primary)]">
                    Rotary District 3191
                  </p>
                  <p className="text-[11px] text-[color:var(--color-text-muted)]">
                    Chartered Chapter Excellence
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mouse Scroll Indicator */}
      <div className="flex flex-col items-center justify-center pt-10 text-[color:var(--color-text-muted)]">
        <span className="mb-1 font-mono text-[10px] tracking-widest uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </div>
    </section>
  );
}
