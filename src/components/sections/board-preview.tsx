"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/shared/social-icons";
import { MOCK_BOARD } from "@/services/mock-data";

export function BoardPreviewSection() {
  return (
    <section id="leadership" className="section-shell relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
        >
          EXECUTIVE GOVERNANCE
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Board of Directors 2026–2027
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-[#9A9A9A]"
        >
          Steered by visionary student leaders committed to service, strategic
          growth, and institutional excellence.
        </motion.p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_BOARD.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card group flex flex-col justify-between overflow-hidden p-6 text-center"
          >
            <div>
              <div className="shadow-medium relative mx-auto h-32 w-32 overflow-hidden rounded-2xl border-2 border-white/10 bg-[#101010] transition-transform duration-500 group-hover:scale-105 group-hover:border-[#3B82F6]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <div className="mt-6">
                <span className="inline-block rounded-md border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-3 py-1 text-[11px] font-bold text-[#3B82F6] uppercase">
                  {member.role}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white group-hover:text-[#3B82F6]">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs text-[#9A9A9A]">
                  {member.department}
                </p>
              </div>

              {member.quote && (
                <p className="mt-4 text-xs leading-relaxed text-[#71717A] italic">
                  &ldquo;{member.quote}&rdquo;
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 border-t border-white/10 pt-4">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-[#9A9A9A] transition-colors hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-[#9A9A9A] transition-colors hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
