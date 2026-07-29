import type { Metadata } from "next";
import { Award, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Awards & Recognitions",
  description:
    "Honors and district awards conferred upon the Rotaract Club of Presidency University.",
};

const AWARDS = [
  {
    year: "2025-2026",
    title: "Best Outstanding Rotaract Club",
    body: "Conferred by Rotary District 3191 for overall chapter excellence, service impact, and active membership.",
  },
  {
    year: "2024-2025",
    title: "Best Community Service Project",
    body: "Awarded for the Green Campus Revolution tree planting initiative.",
  },
  {
    year: "2023-2024",
    title: "Excellence in Digital Literacy",
    body: "Honored for building computer learning labs in rural schools.",
  },
];

export default function AwardsPage() {
  return (
    <div className="space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          District Honors
        </span>
        <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
          Awards & Recognition
        </h1>
        <p className="text-body-large text-[color:var(--color-text-secondary)]">
          Recognizing chapter milestones, institutional awards, and community
          service honors.
        </p>
      </section>

      <section className="container-shell max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
        {AWARDS.map((award, idx) => (
          <div
            key={idx}
            className="shadow-medium hover-lift flex items-start gap-5 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--color-brand-rotary-gold)]/20 text-[color:var(--color-brand-rotary-gold)]">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                  {award.year}
                </span>
                <Sparkles className="h-3 w-3 text-[color:var(--color-brand-rotary-gold)]" />
              </div>
              <h2 className="text-heading-s font-bold text-[color:var(--color-text-primary)]">
                {award.title}
              </h2>
              <p className="text-body-small text-[color:var(--color-text-secondary)]">
                {award.body}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
