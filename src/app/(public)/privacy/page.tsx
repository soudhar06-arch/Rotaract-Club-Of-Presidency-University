import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy regarding user data and student membership applications.",
};

export default function PrivacyPage() {
  return (
    <div className="container-shell max-w-3xl space-y-6 px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
        Privacy Policy
      </h1>
      <p className="font-mono text-xs text-[color:var(--color-text-muted)]">
        Last updated: July 2026
      </p>

      <div className="text-body-small space-y-4 leading-relaxed text-[color:var(--color-text-secondary)]">
        <p>
          The Rotaract Club of Presidency University respects student and site
          visitor privacy. Personal information collected through membership
          forms, contact inquiries, or event registrations is strictly used for
          chapter operations and communication.
        </p>
        <h2 className="text-heading-s pt-2 font-bold text-[color:var(--color-text-primary)]">
          Data Collection & Usage
        </h2>
        <p>
          We do not sell or lease personal data to third parties. Data submitted
          is accessible only to authorized board members and faculty
          coordinators for university compliance and Rotary District 3191
          reporting.
        </p>
      </div>
    </div>
  );
}
