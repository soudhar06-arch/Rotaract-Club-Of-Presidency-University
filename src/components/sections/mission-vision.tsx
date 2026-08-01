"use client";

import { motion } from "framer-motion";
import {
  Award,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Leadership Development",
    description:
      "Empowering university students with real-world executive management experience, public governance, and team leading competencies.",
  },
  {
    icon: HeartHandshake,
    title: "Community Impact",
    description:
      "Organizing sustainable service initiatives across health, education, and environmental restoration in Bengaluru and beyond.",
  },
  {
    icon: Globe,
    title: "Global Fellowship",
    description:
      "Fostering international understanding through youth exchanges and collaborative projects across Rotary International District 3191.",
  },
  {
    icon: Zap,
    title: "Professional Growth",
    description:
      "Curating masterclasses, corporate networking events, and skill bootcamps led by industry executives.",
  },
  {
    icon: Award,
    title: "Distinction & Recognition",
    description:
      "Earning prestigious Rotary International citations, district awards, and institutional accolades.",
  },
  {
    icon: Users,
    title: "Lifelong Alumni Network",
    description:
      "Connecting members with a network of distinguished alumni working across premier global organizations.",
  },
];

export function MissionVisionSection() {
  return (
    <section id="about" className="section-shell relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
        >
          ABOUT OUR ORGANIZATION
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Driven by Purpose. Defined by Excellence.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-[#9A9A9A] sm:text-lg"
        >
          The Rotaract Club of Presidency University brings together young
          visionaries to take action, develop leadership skills, and deliver
          sustainable solutions to society&apos;s most pressing challenges.
        </motion.p>
      </div>

      {/* 6 Luxury Glass Cards Grid */}
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass-card group relative p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#3B82F6] transition-colors group-hover:border-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white transition-colors group-hover:text-[#3B82F6]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#9A9A9A]">
                {pillar.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
