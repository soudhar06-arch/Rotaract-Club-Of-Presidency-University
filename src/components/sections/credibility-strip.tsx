"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Rotary International", logo: "/logos/rotary-international.svg" },
  { name: "Rotaract Emblem", logo: "/logos/rotaract-emblem.svg" },
  { name: "Presidency University", logo: "/logos/presidency-university.svg" },
  { name: "Rotary District 3191", logo: "/logos/district-3191.svg" },
];

export function CredibilityStrip() {
  return (
    <section className="relative z-20 w-full border-y border-white/10 bg-[#050505]/90 py-8">
      <div className="container-shell px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Label */}
          <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-widest text-[color:var(--color-text-muted)] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-accent-blue)]" />
            <span>Chartered Affiliations & Partners</span>
          </div>

          {/* Logo Strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:justify-end md:gap-12">
            {PARTNERS.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="group flex cursor-pointer items-center gap-2.5 opacity-40 transition-opacity hover:opacity-100"
              >
                <div className="relative h-7 w-7 text-white">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain brightness-200 invert filter"
                  />
                </div>
                <span className="hidden font-mono text-xs font-medium tracking-tight text-white sm:inline">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
