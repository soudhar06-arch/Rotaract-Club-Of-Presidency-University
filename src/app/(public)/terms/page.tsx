import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service and code of conduct for student members and visitors.",
};

export default function TermsPage() {
  return (
    <div className="container-shell max-w-3xl space-y-6 px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
        Terms of Service & Code of Conduct
      </h1>
      <p className="font-mono text-xs text-[color:var(--color-text-muted)]">
        Last updated: July 2026
      </p>

      <div className="text-body-small space-y-4 leading-relaxed text-[color:var(--color-text-secondary)]">
        <p>
          By accessing this website and participating in Rotaract Club of
          Presidency University events, members and visitors agree to abide by
          Rotary International ethics, university student conduct guidelines,
          and respectful community engagement.
        </p>
        <h2 className="text-heading-s pt-2 font-bold text-[color:var(--color-text-primary)]">
          Member Responsibilities
        </h2>
        <p>
          Members must maintain integrity, represent the university and Rotary
          brand professionally, and contribute positively to community service
          initiatives.
        </p>
      </div>
    </div>
  );
}
