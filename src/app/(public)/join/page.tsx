"use client";

import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Award,
  Users,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { BackButton } from "@/components/shared/back-button";

const DEFAULT_FORM_URL =
  process.env.NEXT_PUBLIC_MEMBERSHIP_FORM_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSe-RotaractCPU-Membership/viewform?embedded=true";

const VALUE_PILLARS = [
  {
    icon: Award,
    title: "Leadership Development",
    desc: "Take direct charge of high-impact university drives, lead teams, and develop executive decision-making skills.",
  },
  {
    icon: Users,
    title: "Community Impact",
    desc: "Coordinate literacy labs, blood donation drives, environmental cleanups, and local hunger relief programs.",
  },
  {
    icon: Globe2,
    title: "Global & District Network",
    desc: "Connect with thousands of Rotaractors across Rotary District 3192, India, and international partner clubs.",
  },
];

export default function JoinPage() {
  const [iframeError, setIframeError] = useState(false);
  const membershipFormUrl = DEFAULT_FORM_URL;

  return (
    <div className="section-shell pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <BackButton fallbackRoute="/" label="Return to homepage" className="mb-6" />

        {/* Value Proposition Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Official Membership Registration
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase font-sans">
            Become a Part of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400">
              RCPU.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Fill out the official Rotaract Club of Presidency University membership form below. Develop leadership capabilities, create real community change, and build lifelong professional connections.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {VALUE_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl"
              >
                <pillar.icon className="w-6 h-6 text-[#3B82F6]" />
                <h3 className="mt-3 text-sm font-bold text-white">{pillar.title}</h3>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Google Form Container */}
        <div className="mt-12 rounded-3xl border border-white/15 bg-[#0F1117]/90 backdrop-blur-xl p-4 sm:p-8 shadow-2xl overflow-hidden">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="eyebrow flex items-center gap-2 text-xs font-mono text-[#3B82F6] uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                Presidency University Registration Portal
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white tracking-tight">
                Official Google Membership Form
              </h2>
            </div>

            <a
              href={membershipFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25 shrink-0"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {!iframeError ? (
            <div className="relative w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 min-h-[700px]">
              <iframe
                src={membershipFormUrl}
                width="100%"
                height="800"
                className="w-full h-[750px] border-0"
                title="RCPU Membership Form"
                onError={() => setIframeError(true)}
              >
                Loading membership form...
              </iframe>
            </div>
          ) : (
            <div className="py-16 text-center">
              <h3 className="text-xl font-bold text-white">Direct Form Access</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
                If the form does not load directly inside your browser window, please click below to complete your application.
              </p>
              <a
                href={membershipFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/30"
              >
                <span>Continue to Official Membership Form</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
