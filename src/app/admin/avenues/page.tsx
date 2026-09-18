"use client";

import { Layers } from "lucide-react";

export default function AvenuesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
          CMS Core Structure
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Avenues Management
        </h1>
      </div>

      <div className="p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl text-center space-y-4">
        <Layers className="w-10 h-10 text-[#3B82F6] mx-auto" />
        <h2 className="text-xl font-bold text-white">6 Core Club Avenues Configured</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Community Service, Professional Development, Fellowship, International Service, Club Service, and Public Relations narratives and imagery.
        </p>
      </div>
    </div>
  );
}
