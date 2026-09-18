"use client";

import { motion } from "framer-motion";
import ExpandableProfileCard from "@/components/ui/expandable-profile-card";
import { MOCK_BOARD, BoardMember } from "@/services/mock-data";
import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/shared/social-icons";

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
          EXECUTIVE LEADERSHIP
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Board of Directors
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-[#9A9A9A]"
        >
          Steered by visionary student leaders committed to service, strategic
          growth, and institutional excellence. Click any card to expand full profile.
        </motion.p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_BOARD.map((member: BoardMember, idx: number) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex justify-center"
          >
            <ExpandableProfileCard
              imageSrc={member.image}
              title={member.name}
              subtitle={member.role}
              content={
                <div className="flex flex-col gap-5 text-left text-white">
                  <div>
                    <span className="inline-block rounded-md border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-3 py-1 text-xs font-bold text-[#3B82F6] uppercase mb-2">
                      {member.role}
                    </span>
                    <p className="text-xs text-[#9A9A9A]">{member.department}</p>
                  </div>

                  {member.bio && (
                    <div>
                      <h4 className="text-[#D4D4D4] font-semibold text-xs tracking-wider uppercase mb-1">
                        Biography
                      </h4>
                      <p className="text-xs leading-relaxed text-[#9A9A9A]">{member.bio}</p>
                    </div>
                  )}

                  {member.quote && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <h4 className="text-xs font-semibold text-[#3B82F6] uppercase mb-1">
                        Leadership Motto
                      </h4>
                      <p className="text-xs italic text-white">&ldquo;{member.quote}&rdquo;</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3B82F6]"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3B82F6]"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Contact Email</span>
                      </a>
                    )}
                  </div>
                </div>
              }
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
