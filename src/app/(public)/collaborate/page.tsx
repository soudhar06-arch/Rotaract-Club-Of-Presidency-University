"use client";

import { useState } from "react";
import { Handshake, Building, Heart, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";

const PARTNERSHIP_TYPES = [
  {
    icon: Building,
    title: "Corporate CSR Partnerships",
    desc: "Sponsor community environmental drives, health camps, literacy labs, or social welfare programs.",
  },
  {
    icon: Handshake,
    title: "University & NGO Joint Drives",
    desc: "Collaborate on joint campus summits, blood donation drives, and inter-university youth dialogues.",
  },
  {
    icon: Heart,
    title: "Community & Civic Alliances",
    desc: "Work with local government bodies and Rotary clubs across District 3192 to maximize ground impact.",
  },
];

export default function CollaboratePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ orgName: "", email: "", proposal: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orgName || !formData.email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="section-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <BackButton fallbackRoute="/" className="mb-6" />

        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Strategic Alliances
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase font-sans">
            Partner & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400">Collaborate.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            We welcome corporate sponsors, non-profit institutions, Rotary clubs, and campus organizations to create joint community impact with RCPU.
          </p>
        </div>

        {/* Partnership Types Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {PARTNERSHIP_TYPES.map((type, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl p-8 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                <type.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-lg font-bold text-white tracking-tight">
                {type.title}
              </h2>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                {type.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Proposal Form Section */}
        <div className="mt-16 max-w-2xl mx-auto rounded-3xl border border-white/15 bg-[#0F1117]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Proposal Received!</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                Thank you for your interest in collaborating with RCPU. Our Secretariat team will review your partnership vision and connect with you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ orgName: "", email: "", proposal: "" });
                }}
                className="mt-6 px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Submit Another Proposal
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight text-center">
                Inquire About Partnership
              </h2>
              <p className="mt-1 text-xs text-zinc-400 text-center">
                Tell us about your organization and how we can collaborate.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="mb-1.5 block font-mono uppercase tracking-wider text-zinc-400 text-[10px]">
                    Organization / Corporate Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    placeholder="e.g. Rotary District 3192 / Tech Corp"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#3B82F6] transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono uppercase tracking-wider text-zinc-400 text-[10px]">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partnerships@organization.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#3B82F6] transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono uppercase tracking-wider text-zinc-400 text-[10px]">
                    Proposal / Partnership Vision
                  </label>
                  <textarea
                    rows={4}
                    value={formData.proposal}
                    onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                    placeholder="Describe your initiative, expected impact, and timeline..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#3B82F6] transition-colors text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-600 shadow-lg shadow-[#3B82F6]/30 disabled:opacity-50"
                >
                  <span>{loading ? "Submitting Proposal..." : "Send Partnership Proposal"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

