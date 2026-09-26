"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "@/components/shared/content-image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  History,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { CalendarEvent } from "@/lib/google-calendar";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { BackButton } from "@/components/shared/back-button";

export default function EventsPage() {
  const { upcomingEvents, pastEvents, loading, error, addToUserCalendar } =
    useCalendarEvents();
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">(
    "all",
  );
  const avenues = ["All", "Club Service", "Community Service", "Professional Development", "International Service", "Public Relations", "Fellowship"];
  const [activeAvenue, setActiveAvenue] = useState("All");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("avenue");
    const match = avenues.find(item => item.toLowerCase() === requested?.toLowerCase());
    if (match) setActiveAvenue(match);
  }, []);
  const normalized = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const matchesAvenue = (event: CalendarEvent) => activeAvenue === "All" || normalized(event.category) === normalized(activeAvenue);
  const filteredUpcoming = useMemo(() => upcomingEvents.filter(matchesAvenue), [upcomingEvents, activeAvenue]);
  const filteredPast = useMemo(() => pastEvents.filter(matchesAvenue), [pastEvents, activeAvenue]);

  const totalCount = filteredUpcoming.length + filteredPast.length;

  return (
    <div className="space-y-16 pt-28 pb-20">
      <div className="container-shell px-4 sm:px-6 lg:px-8">
        <BackButton fallbackRoute="/#events" className="mb-6" />
        {/* Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase">
            CLUB EVENTS
          </span>
          <h1 className="text-display-l font-bold tracking-tight text-white">
            Events & Conclaves
          </h1>
          <p className="text-base leading-relaxed text-[#9A9A9A]">
            Browse all upcoming flagship conclaves, community drives, and past
            event archives from our club photo collections.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "shadow-glow bg-[#3B82F6] text-white"
                  : "border border-white/10 bg-white/[0.04] text-[#9A9A9A] hover:text-white"
              }`}
            >
              All Events ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "shadow-glow bg-[#3B82F6] text-white"
                  : "border border-white/10 bg-white/[0.04] text-[#9A9A9A] hover:text-white"
              }`}
            >
              Upcoming ({filteredUpcoming.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === "past"
                  ? "shadow-glow bg-[#3B82F6] text-white"
                  : "border border-white/10 bg-white/[0.04] text-[#9A9A9A] hover:text-white"
              }`}
            >
              Past Events ({filteredPast.length})
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4" aria-label="Filter events by avenue">
            {avenues.map(avenue => <button key={avenue} type="button" onClick={() => setActiveAvenue(avenue)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${activeAvenue === avenue ? "border-[#3B82F6] bg-[#3B82F6]/20 text-white" : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"}`}>
              {avenue}
            </button>)}
          </div>
        </div>

        {error && totalCount > 0 && <p role="status" className="mt-6 text-center text-sm text-zinc-400">Some events are temporarily unavailable.</p>}
        {/* Content Sections */}
        {loading ? (
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass-card h-80 animate-pulse rounded-2xl bg-white/5 p-4"
              />
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div className="glass-card mt-16 flex flex-col items-center justify-center space-y-3 p-12 text-center">
            <CalendarDays className="h-12 w-12 text-[#3B82F6]" />
            <h3 className="text-lg font-bold text-white">
              No Events Available
            </h3>
            <p className="max-w-md text-xs text-[#9A9A9A]">
              {error ? "Events are temporarily unavailable." : "No published events yet. Please check back soon."}
            </p>
          </div>
        ) : (
          <div className="mt-14 space-y-16">
            {/* Upcoming Events Section */}
            {(activeTab === "all" || activeTab === "upcoming") && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <Calendar className="h-5 w-5 text-[#3B82F6]" />
                  <h2 className="text-xl font-bold tracking-wide text-white">
                    Upcoming Events ({filteredUpcoming.length})
                  </h2>
                </div>

                {filteredUpcoming.length === 0 ? (
                  <p className="py-8 text-center text-xs text-[#9A9A9A]">
                    No upcoming events scheduled right now.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {filteredUpcoming.map((evt, idx) => (
                      <EventCard
                        key={evt.id}
                        evt={evt}
                        idx={idx}
                        onAddCalendar={addToUserCalendar}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Past Events Section */}
            {(activeTab === "all" || activeTab === "past") && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <History className="h-5 w-5 text-[#71717A]" />
                  <h2 className="text-xl font-bold tracking-wide text-white">
                    Past Events & Archives ({filteredPast.length})
                  </h2>
                </div>

                {filteredPast.length === 0 ? (
                  <p className="py-8 text-center text-xs text-[#9A9A9A]">
                    No historical events have been published yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {filteredPast.map((evt, idx) => (
                      <EventCard
                        key={evt.id}
                        evt={evt}
                        idx={idx}
                        isPast
                        onAddCalendar={addToUserCalendar}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({
  evt,
  idx,
  isPast,
  onAddCalendar,
}: {
  evt: CalendarEvent;
  idx: number;
  isPast?: boolean;
  onAddCalendar: (evt: CalendarEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
      className="glass-card group flex flex-col justify-between overflow-hidden"
    >
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-[#101010]">
          <Image
            src={evt.image}
            alt={evt.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          <span
            className={`shadow-glow absolute top-3 left-3 rounded-md px-2.5 py-1 text-[10px] font-bold text-white uppercase ${
              isPast ? "bg-[#71717A]" : "bg-[#3B82F6]"
            }`}
          >
            {evt.category}
          </span>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-2 text-base font-bold text-white transition-colors group-hover:text-[#3B82F6]">
            {evt.title}
          </h3>

          <div className="mt-4 space-y-2 text-xs text-[#9A9A9A]">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#3B82F6]" />
              <span>{evt.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#3B82F6]" />
              <span>{evt.time}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
              <span className="truncate">{evt.venue || evt.location}</span>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#9A9A9A]">
            {evt.shortDescription || evt.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5 pt-0">
        {/* Primary CTA row */}
        <div className="flex gap-2">
          {evt.registrationLink && !isPast && (
            <a
              href={evt.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-glow flex-1 rounded-xl bg-[#3B82F6] py-2.5 text-center text-xs font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
            >
              Register
            </a>
          )}

          <button
            onClick={() => onAddCalendar(evt)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
            title="Add to My Google Calendar"
          >
            <span className="text-xs">Add to Calendar</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#3B82F6]" />
          </button>
        </div>

        {/* View Details link */}
        <Link
          href={`/events/${evt.slug || evt.id}`}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/[0.07] py-2.5 text-xs font-semibold text-[#3B82F6] transition-all hover:bg-[#3B82F6]/15 hover:border-[#3B82F6]/60 active:scale-95"
        >
          <span>View Event Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
