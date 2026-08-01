"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { ROUTES } from "@/constants";

const REASONS = [
  "Executive leadership experience & governance",
  "International fellowship across Rotary District 3191",
  "Mentorship from Rotary Club of Bangalore industry leaders",
  "Certificate of Merit & Rotary International citations",
  "High-impact community service & social innovation",
  "Lifelong alumni network & corporate career opportunities",
];

export function JoinCtaSection() {
  return (
    <section id="why-join" className="section-shell relative z-10">
      <div className="glass-card relative overflow-hidden p-8 sm:p-12 lg:p-16">
        {/* Background Accent Glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#3B82F6]/20 blur-[120px]" />

        <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1 text-xs font-semibold text-[#3B82F6]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>MEMBERSHIP RECRUITMENT 2026–2027</span>
            </div>

            <h2 className="text-display-l font-bold tracking-tight text-white">
              Why Join the Rotaract Movement?
            </h2>

            <p className="text-base leading-relaxed text-[#9A9A9A]">
              Position yourself at the forefront of campus leadership,
              high-impact social service, and personal development at Presidency
              University.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              {REASONS.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-[#D4D4D4]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center lg:col-span-5 lg:items-end">
            <div className="shadow-large w-full max-w-sm rounded-2xl border border-white/10 bg-[#0A0A0A]/90 p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-[#3B82F6]" />
              <h3 className="mt-4 text-xl font-bold text-white">
                Become a Rotaractor
              </h3>
              <p className="mt-2 text-xs text-[#9A9A9A]">
                Applications open for all Presidency University students across
                all disciplines.
              </p>

              <Link
                href={ROUTES.JOIN}
                className="shadow-glow mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3.5 text-xs font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
              >
                <span>Complete Application</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-4 text-[10px] text-[#71717A]">
                Takes less than 3 minutes to apply online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
