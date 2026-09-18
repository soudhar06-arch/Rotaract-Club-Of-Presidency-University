"use client";

import { Handshake } from "lucide-react";

export default function PartnersAdminPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
          CMS Data Store
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Partner Organizations Data
        </h1>
      </div>

      <div className="p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl text-center space-y-4">
        <Handshake className="w-10 h-10 text-[#3B82F6] mx-auto" />
        <h2 className="text-xl font-bold text-white">Partner & Sponsor Records</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Partner data remains stored in the CMS for future usage (currently hidden from homepage per Change #4).
        </p>
      </div>
    </div>
  );
}
