"use client";

import { Share2 } from "lucide-react";

export default function SocialAdminPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
          CMS Social Networks
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Social Links & Handles
        </h1>
      </div>

      <div className="p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl text-center space-y-4">
        <Share2 className="w-10 h-10 text-[#3B82F6] mx-auto" />
        <h2 className="text-xl font-bold text-white">Centralized Social Media URLs</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Manage Instagram (@rotaract_presidency), LinkedIn, WhatsApp, YouTube, and Discord handles globally.
        </p>
      </div>
    </div>
  );
}
