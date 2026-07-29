"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { LinkedinIcon } from "@/components/shared";
import { ROUTES } from "@/constants";

const BOARD_MEMBERS = [
  {
    name: "Rtn. Sourav Sharma",
    role: "President (2025-26)",
    department: "School of Engineering",
    bio: "Passionate about youth governance, community welfare, and sustainable social impact.",
    initials: "SS",
    linkedin: "https://linkedin.com",
    email: "president@rotaract-presidency.org",
  },
  {
    name: "Rtr. Ananya Rao",
    role: "Vice President",
    department: "School of Management",
    bio: "Specializes in project operations, partner relations, and strategic execution.",
    initials: "AR",
    linkedin: "https://linkedin.com",
    email: "vp@rotaract-presidency.org",
  },
  {
    name: "Rtr. Rohan Kulkarni",
    role: "Secretary",
    department: "School of Computer Science",
    bio: "Drives chapter communications, documentation, and digital innovation.",
    initials: "RK",
    linkedin: "https://linkedin.com",
    email: "secretary@rotaract-presidency.org",
  },
  {
    name: "Rtr. Priya Nair",
    role: "Treasurer",
    department: "School of Commerce",
    bio: "Oversees financial management, audit compliance, and fundraising initiatives.",
    initials: "PN",
    linkedin: "https://linkedin.com",
    email: "treasurer@rotaract-presidency.org",
  },
];

export function BoardPreviewSection() {
  return (
    <section
      id="board"
      className="section-shell scroll-mt-24 bg-[color:var(--color-bg-primary)] py-20"
    >
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
            Leadership & Governance
          </span>
          <h2 className="text-heading-xl mt-1 font-bold text-[color:var(--color-text-primary)]">
            Board of Directors (2025-26)
          </h2>
        </div>
        <Link
          href={ROUTES.ABOUT}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-accent-blue)] hover:underline dark:text-[color:var(--color-brand-rotary-gold)]"
        >
          <span>View Full Team</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BOARD_MEMBERS.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.06 }}
            className="shadow-medium transition-smooth hover-lift group flex flex-col items-center rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 text-center"
          >
            {/* Avatar Circle */}
            <div className="shadow-medium relative mb-4 h-24 w-24 rounded-full bg-gradient-to-tr from-[color:var(--color-brand-accent-blue)] to-[color:var(--color-brand-rotary-gold)] p-1">
              <div className="font-geist flex h-full w-full items-center justify-center rounded-full bg-[color:var(--color-surface)] text-xl font-bold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                {member.initials}
              </div>
            </div>

            {/* Member Info */}
            <span className="mb-2 rounded-full bg-[color:var(--color-bg-secondary)] px-3 py-1 font-mono text-[11px] font-semibold text-[color:var(--color-brand-rotary-gold)] uppercase">
              {member.role}
            </span>
            <h3 className="text-heading-s mb-1 font-bold text-[color:var(--color-text-primary)]">
              {member.name}
            </h3>
            <span className="mb-3 text-xs font-medium text-[color:var(--color-text-muted)]">
              {member.department}
            </span>
            <p className="text-body-small mb-6 line-clamp-3 text-[color:var(--color-text-secondary)]">
              {member.bio}
            </p>

            {/* Social Links */}
            <div className="mt-auto flex w-full items-center justify-center gap-3 border-t border-[color:var(--color-border)]/60 pt-3">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl p-2 text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                aria-label={`LinkedIn profile of ${member.name}`}
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${member.email}`}
                className="rounded-xl p-2 text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
