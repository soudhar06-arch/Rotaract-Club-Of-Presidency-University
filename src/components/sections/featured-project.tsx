"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants";

export function FeaturedProjectSection() {
  return (
    <section
      id="projects"
      className="section-shell scroll-mt-24 bg-[color:var(--color-bg-primary)] py-20"
    >
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
            Flagship Initiative
          </span>
          <h2 className="text-heading-xl mt-1 font-bold text-[color:var(--color-text-primary)]">
            Featured Project: Green Campus Revolution
          </h2>
        </div>
        <Link
          href={ROUTES.EVENTS}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-accent-blue)] hover:underline dark:text-[color:var(--color-brand-rotary-gold)]"
        >
          <span>View All Projects</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="shadow-large overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Image Container */}
          <div className="shadow-medium relative aspect-[16/10] overflow-hidden rounded-2xl border border-[color:var(--color-border)]/60 lg:col-span-7">
            <Image
              src="/images/project-featured.png"
              alt="Green Campus Revolution tree planting drive"
              fill
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-[color:var(--color-surface-glass)] px-3.5 py-1.5 text-xs font-semibold text-[color:var(--color-text-primary)] backdrop-blur-md">
              <Leaf className="h-3.5 w-3.5 text-emerald-500" />
              <span>Environmental Sustainability</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-3">
              <span className="font-mono text-xs text-[color:var(--color-text-muted)]">
                Phase III • Ongoing Impact
              </span>
              <h3 className="text-heading-l font-bold text-[color:var(--color-text-primary)]">
                Planted 1,000+ Native Saplings Across Urban Spaces
              </h3>
              <p className="text-body text-[color:var(--color-text-secondary)]">
                A student-led ecological drive aimed at expanding campus green
                canopy, reducing urban heat islands, and training youth in
                environmental stewardship.
              </p>
            </div>

            {/* Impact Highlights */}
            <div className="space-y-2 border-t border-[color:var(--color-border)] pt-2">
              {[
                "1,000+ trees planted & geotagged for survival tracking",
                "300+ university student volunteers engaged",
                "Partnership with Karnataka State Forest Department",
              ].map((highlight, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-secondary)]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* CTA Link */}
            <div className="pt-4">
              <Link
                href={ROUTES.JOIN}
                className="shadow-small inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-accent-blue)] px-6 py-3 text-xs font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Participate in Next Drive</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
