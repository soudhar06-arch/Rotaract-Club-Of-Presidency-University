import { readPublicCollection } from "@/lib/public-content";
import type { Metadata } from "next";
import { Award, Sparkles } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";

export const metadata: Metadata = {
  title: "Awards & Recognitions",
  description:
    "Honors and district awards conferred upon the Rotaract Club of Presidency University.",
};

export default async function AwardsPage() {
  const awards = await readPublicCollection("awards").catch(() => []);
  return (
    <div className="space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 sm:px-6 lg:px-8">
        <BackButton fallbackRoute="/" className="mb-6" />
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
        {awards.length === 0 && <p className="text-zinc-400">No published awards are available.</p>}
        {awards.map((award, idx) => (
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
                {award.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
