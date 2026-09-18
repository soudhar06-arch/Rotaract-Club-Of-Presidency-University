import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and code of conduct for student members and visitors.",
};

export default function TermsPage() {
  return (
    <div className="section-shell pt-32 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow">Terms</div>
        <h1 className="mt-4 text-5xl md:text-7xl tracking-[-0.07em] uppercase">Code of conduct.</h1>
        <div className="mt-10 space-y-6 border border-[color:var(--line)] bg-[rgba(255,255,255,0.02)] p-6 text-[color:var(--text-soft)]">
          <p>By using this website or participating in Rotaract Club of Presidency University activities, members and visitors agree to uphold respectful engagement, professionalism and student conduct expectations.</p>
          <p>All club operations should reflect Rotary values, university policies and a commitment to inclusive, ethical community service. We reserve the right to review or decline participation where conduct conflicts with these principles.</p>
        </div>
      </div>
    </div>
  );
}
