"use client";
import { useCMS } from "@/hooks/use-cms";

import Image from "@/components/shared/content-image";
import { motion } from "framer-motion";

export function CredibilityStrip() {
  const { data: records } = useCMS<{ name: string; logo_url: string }[]>("partners", []);
  const ENTITIES = records.map(r => ({ ...r, logo: r.logo_url || "/images/no-photo.svg" }));
  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[#0A0A0A]/60 py-6 backdrop-blur-xl">
      <div className="container-shell px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
          <p className="shrink-0 text-[11px] font-semibold tracking-widest text-[#71717A] uppercase">
            OFFICIAL AFFILIATIONS & PARTNERSHIPS
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
            {ENTITIES.map((entity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="group flex cursor-pointer items-center gap-2.5 transition-all"
              >
                <div className="relative h-6 w-6 opacity-75 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0">
                  <Image
                    src={entity.logo}
                    alt={entity.name}
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-[#9A9A9A] transition-colors group-hover:text-white">
                  {entity.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
