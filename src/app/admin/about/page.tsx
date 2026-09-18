"use client";

import { Info } from "lucide-react";

export default function AboutCMSAdminPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
          CMS Governance
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          About & Mission CMS
        </h1>
      </div>

      <div className="p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl text-center space-y-4">
        <Info className="w-10 h-10 text-[#3B82F6] mx-auto" />
        <h2 className="text-xl font-bold text-white">About & Mission Details</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Manage Rotary District 3192 affiliation details, charter info, club history, mission, vision, and university parameters.
        </p>
      </div>
    </div>
  );
}
