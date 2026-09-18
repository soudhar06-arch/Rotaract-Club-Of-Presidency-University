"use client";

import { Calendar, ExternalLink } from "lucide-react";

export default function CalendarCMSAdminPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest block font-bold">
          Google Integration
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Google Calendar Status
        </h1>
      </div>

      <div className="p-8 rounded-3xl border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl text-center space-y-4">
        <Calendar className="w-10 h-10 text-[#3B82F6] mx-auto" />
        <h2 className="text-xl font-bold text-white">Live Scheduled Events Source</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Upcoming events are directly synchronized from the official Google Calendar.
        </p>
        <div className="pt-4">
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors"
          >
            <span>Open Google Calendar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
