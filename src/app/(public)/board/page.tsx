import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/shared";

export const metadata: Metadata = {
  title: "Board of Directors",
  description:
    "Meet the executive board and student officers leading the Rotaract Club of Presidency University.",
};

const BOARD_MEMBERS = [
  {
    name: "Rtn. Sourav Sharma",
    role: "President (2025-26)",
    dept: "School of Engineering",
    initials: "SS",
  },
  {
    name: "Rtr. Ananya Rao",
    role: "Vice President",
    dept: "School of Management",
    initials: "AR",
  },
  {
    name: "Rtr. Rohan Kulkarni",
    role: "Secretary",
    dept: "School of Computer Science",
    initials: "RK",
  },
  {
    name: "Rtr. Priya Nair",
    role: "Treasurer",
    dept: "School of Commerce",
    initials: "PN",
  },
  {
    name: "Rtr. Rahul Varma",
    role: "Community Service Director",
    dept: "School of Engineering",
    initials: "RV",
  },
  {
    name: "Rtr. Sneha Iyer",
    role: "Club Service Director",
    dept: "School of Design",
    initials: "SI",
  },
];

export default function BoardPage() {
  return (
    <div className="space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Chapter Leadership
        </span>
        <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
          Board of Directors & Officers
        </h1>
        <p className="text-body-large text-[color:var(--color-text-secondary)]">
          Dedicated student leaders guiding governance, community initiatives,
          and chapter expansion.
        </p>
      </section>

      <section className="container-shell px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BOARD_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="shadow-medium hover-lift space-y-3 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 text-center"
            >
              <div className="shadow-small mx-auto h-20 w-20 rounded-full bg-gradient-to-tr from-[color:var(--color-brand-accent-blue)] to-[color:var(--color-brand-rotary-gold)] p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[color:var(--color-surface)] text-lg font-bold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                  {member.initials}
                </div>
              </div>
              <span className="inline-block rounded-full bg-[color:var(--color-bg-secondary)] px-3 py-1 font-mono text-[10px] font-bold text-[color:var(--color-brand-rotary-gold)] uppercase">
                {member.role}
              </span>
              <h2 className="text-heading-s font-bold text-[color:var(--color-text-primary)]">
                {member.name}
              </h2>
              <p className="text-xs font-medium text-[color:var(--color-text-muted)]">
                {member.dept}
              </p>
              <div className="flex justify-center gap-3 border-t border-[color:var(--color-border)] pt-3 text-[color:var(--color-text-muted)]">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[color:var(--color-brand-accent-blue)]"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <a
                  href="mailto:info@rotaract-presidency.org"
                  className="hover:text-[color:var(--color-brand-accent-blue)]"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
