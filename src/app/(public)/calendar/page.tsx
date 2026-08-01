import { Metadata } from "next";
import { EventCalendar } from "@/components/calendar/calendar";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Official Calendar & Interactive Schedule | Rotaract Club of Presidency University",
  description:
    "Explore upcoming leadership conclaves, community drives, professional workshops, and global fellowship assemblies hosted by Rotaract Club of Presidency University.",
};

export default function CalendarPage() {
  return (
    <div className="space-y-12 pt-28 pb-20">
      <div className="container-shell px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-1.5 text-xs font-semibold text-[#3B82F6]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>LIVE GOOGLE CALENDAR INTEGRATION</span>
          </div>

          <h1 className="text-display-l font-bold tracking-tight text-white">
            Official Club Calendar & Interactive Schedule
          </h1>

          <p className="text-base leading-relaxed text-[#9A9A9A]">
            Stay synced with all community health drives, youth leadership
            summits, skill workshops, and cultural assemblies organized by
            Rotaract Club of Presidency University.
          </p>
        </div>

        {/* Dynamic Calendar Component */}
        <div className="mt-12">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
}
