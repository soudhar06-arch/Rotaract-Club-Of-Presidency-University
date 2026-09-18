import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy regarding user data and student membership applications.",
};

export default function PrivacyPage() {
  return (
    <div className="section-shell pt-32 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow">Privacy policy</div>
        <h1 className="mt-4 text-5xl md:text-7xl tracking-[-0.07em] uppercase">Privacy.</h1>
        <div className="mt-10 space-y-6 border border-[color:var(--line)] bg-[rgba(255,255,255,0.02)] p-6 text-[color:var(--text-soft)]">
          <p>We respect the privacy of visitors, applicants and members. Information submitted through membership or contact forms is used strictly for club administration, communication and related operational needs.</p>
          <p>We do not sell or lease personal information. Only authorized club leadership and relevant administrative stakeholders may access submitted information when required for membership review, communication or event coordination.</p>
        </div>
      </div>
    </div>
  );
}
