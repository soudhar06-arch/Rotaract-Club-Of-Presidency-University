"use client";

import { Handshake, Building, Heart, ArrowRight } from "lucide-react";

const PARTNERSHIP_TYPES = [
  {
    icon: Building,
    title: "Corporate CSR Partnerships",
    desc: "Sponsor community environmental drives, health camps, or student literacy labs.",
  },
  {
    icon: Handshake,
    title: "University & NGO Joint Drives",
    desc: "Collaborate on joint campus summits, blood drives, and social welfare programs.",
  },
  {
    icon: Heart,
    title: "Community & Civic Alliances",
    desc: "Work with local government bodies and Rotary clubs to maximize local impact.",
  },
];

export default function CollaboratePage() {
  return (
    <div className="space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Strategic Alliances
        </span>
        <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
          Partner & Collaborate With Us
        </h1>
        <p className="text-body-large text-[color:var(--color-text-secondary)]">
          We welcome institutional sponsors, non-profit partners, and campus
          organizations to create joint community impact.
        </p>
      </section>

      <section className="container-shell grid grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {PARTNERSHIP_TYPES.map((type, idx) => (
          <div
            key={idx}
            className="shadow-medium hover-lift space-y-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-accent-blue)]/10 text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
              <type.icon className="h-6 w-6" />
            </div>
            <h2 className="text-heading-s font-bold text-[color:var(--color-text-primary)]">
              {type.title}
            </h2>
            <p className="text-body-small text-[color:var(--color-text-secondary)]">
              {type.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="container-shell max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="shadow-large space-y-6 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-10">
          <h2 className="text-heading-m font-bold">
            Inquire About Partnership
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 text-left text-xs"
          >
            <div>
              <label className="mb-1 block font-semibold">
                Organization / Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rotary District 3191 / ABC Corp"
                required
                className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] px-4 py-2.5"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">Contact Email</label>
              <input
                type="email"
                placeholder="contact@org.com"
                required
                className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] px-4 py-2.5"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">
                Proposal / Inquiry Details
              </label>
              <textarea
                rows={4}
                placeholder="Describe your partnership vision..."
                className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] px-4 py-2.5"
              />
            </div>
            <button
              type="submit"
              className="shadow-small inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-accent-blue)] py-3 text-xs font-semibold text-white hover:opacity-90"
            >
              <span>Send Partnership Proposal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
