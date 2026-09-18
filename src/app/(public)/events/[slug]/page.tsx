"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  CalendarPlus,
  Share2,
} from "lucide-react";
import { ROUTES } from "@/constants";
import projectsData from "@/data/projects.json";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { BackButton } from "@/components/shared/back-button";


function normalizeDescription(value: unknown): string {
  if (value == null) return "";
  if (typeof value !== "string") return "";
  return value.trim();
}

function pickDescription(event: Record<string, unknown>): string {
  return (
    normalizeDescription(event.fullDescription) ||
    normalizeDescription(event.eventDescription) ||
    normalizeDescription(event.details) ||
    normalizeDescription(event.content) ||
    normalizeDescription(event.body) ||
    normalizeDescription(event.description)
  );
}

type EventRecord = Record<string, unknown>;

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const { upcomingEvents, pastEvents } = useCalendarEvents();
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Match event across calendar & historical projects data
  const event = useMemo(() => {
    const allCalendar = [...upcomingEvents, ...pastEvents];
    const matchedCal = allCalendar.find(
      (e) => e.id === slug || e.title.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug || e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
    );
    if (matchedCal) return matchedCal as unknown as EventRecord;

    const matchedProject = projectsData.find(
      (p) => p.id === slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug
    );
    if (matchedProject) {
      return {
        id: matchedProject.id,
        title: matchedProject.title,
        category: matchedProject.category,
        date: matchedProject.date || "2026-04-15",
        time: matchedProject.time || "10:00 AM – 04:00 PM",
        venue: matchedProject.venue || "Presidency University Campus",
        description: pickDescription(matchedProject),
        image: matchedProject.image || "/gallery/gallery-1.jpeg",
        objective: matchedProject.objective,
        collaborators: matchedProject.collaborators,
        participants: matchedProject.participants,
        beneficiaries: matchedProject.beneficiaries,
        highlights: (matchedProject as unknown as EventRecord).highlights,
        gallery: matchedProject.images,
      } as EventRecord;
    }

    // Default Fallback Event (only used when no matching event is found)
    return {
      id: "default-event",
      title: "Rotaract Event",
      category: "Community Service",
      date: "2026-08-15",
      time: "09:00 AM – 04:00 PM",
      venue: "Presidency University Campus",
      description: "Event details will be updated soon.",
      image: "/gallery/gallery-1.jpeg",
    } as EventRecord;
  }, [slug, upcomingEvents, pastEvents]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    (event as EventRecord).title as string
  )}&details=${encodeURIComponent((event as EventRecord).description as string)}&location=${encodeURIComponent(
    (event as EventRecord).venue as string
  )}`;

  return (
    <div className="space-y-12 pt-28 pb-20">
      <div className="container-shell max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
        <BackButton fallbackRoute={ROUTES.EVENTS} label="Back to All Events" className="mb-2" />

        {/* Title Header */}
        <div className="space-y-3">
          <span className="inline-block rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-[#3B82F6] uppercase">
            {(event as EventRecord).category as string}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white uppercase">
            {(event as EventRecord).title as string}
          </h1>
        </div>

        {/* Event Fact Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#101010]/80 p-5 text-xs text-[#9A9A9A] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#3B82F6]" />
              <span className="font-semibold text-white">
                {new Date((event as EventRecord).date as string).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            {typeof (event as EventRecord).time === "string" && Boolean((event as EventRecord).time) && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#3B82F6]" />
                <span className="font-semibold text-white">{(event as EventRecord).time as string}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#3B82F6]" />
              <span className="font-semibold text-white">{(event as EventRecord).venue as string}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white hover:bg-white/10"
          >
            <Share2 className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>{copiedLink ? "Link Copied!" : "Share"}</span>
          </button>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#050505] shadow-2xl">
          <Image
            src={(event as EventRecord).image as string || "/gallery/gallery-1.jpeg"}
            alt={(event as EventRecord).title as string}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-12">
          <div className="space-y-6 text-sm leading-relaxed text-[#9A9A9A] lg:col-span-8 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                About the Event
              </h2>
              {/* Render multi-paragraph descriptions (split on newlines) */}
              <div className="space-y-3 text-base text-white/90 leading-relaxed">
                {pickDescription(event).split(/\n+/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="mb-3 last:mb-0">{para}</p>
                  ))}
              </div>
            </div>

            {typeof (event as EventRecord).objective === "string" && Boolean((event as EventRecord).objective) && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
                  Event Objective
                </h3>
                <p className="mt-1 text-sm font-semibold text-white">{((event as EventRecord).objective as unknown) as string}</p>
              </div>
            )}

            {Array.isArray((event as EventRecord).collaborators) && ((event as EventRecord).collaborators as string[]).length > 0 && (
              <div className="space-y-2 border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                  Partner Organizations
                </span>
                <div className="flex flex-wrap gap-2">
                  {(((event as EventRecord).collaborators as unknown) as string[]).map((c, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs text-white"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray((event as EventRecord).highlights) && ((event as EventRecord).highlights as string[]).length > 0 && (
              <div className="space-y-2 border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                  Key Highlights
                </span>
                <ul className="space-y-1.5">
                  {(((event as EventRecord).highlights as unknown) as string[]).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {typeof (event as EventRecord).participants === "number" && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs text-white">
                  Participants: {((event as EventRecord).participants as unknown) as number}
                </span>
              </div>
            )}

            {typeof (event as EventRecord).beneficiaries === "number" && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs text-white">
                  Beneficiaries: {((event as EventRecord).beneficiaries as unknown) as number}
                </span>
              </div>
            )}

            {Array.isArray((event as EventRecord).gallery) && ((event as EventRecord).gallery as string[]).length > 0 && (
              <div className="space-y-3 border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                  Event Gallery
                </span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(((event as EventRecord).gallery as unknown) as string[]).map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
                      <Image src={img as string} alt={`Gallery ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 200px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {typeof (event as EventRecord).registrationLink === "string" && Boolean((event as EventRecord).registrationLink) && (
              <a
                href={((event as EventRecord).registrationLink as unknown) as string}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/10 py-3 text-xs font-semibold text-[#3B82F6] transition-all hover:bg-[#3B82F6]/20"
              >
                Register for This Event
              </a>
            )}

            {typeof (event as EventRecord).objective !== "string" &&
             !Array.isArray((event as EventRecord).collaborators) && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-xs text-[#9A9A9A]">
                  Additional event details — schedule, speakers, and partner organizations — will be published closer to the event date.
                </p>
              </div>
            )}
          </div>

          {/* Action Sidebar Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-5 rounded-3xl border border-white/10 bg-[#101010]/90 p-6 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Event RSVP & Sync
              </h3>

              <p className="text-xs leading-relaxed text-[#9A9A9A]">
                Registration is free for all Presidency University students, faculty, and Rotary District members.
              </p>

              {rsvpConfirmed ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-xs text-emerald-400">
                  <CheckCircle className="mx-auto mb-1.5 h-6 w-6 text-emerald-400" />
                  <strong>RSVP Confirmed!</strong>
                  <p className="mt-1 text-[11px] text-emerald-300/80">
                    We look forward to seeing you at the event.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRsvpConfirmed(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3 text-xs font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-600 active:scale-95"
                >
                  <span>Confirm RSVP</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-3 text-xs font-semibold text-white transition-all hover:bg-white/10"
              >
                <CalendarPlus className="h-4 w-4 text-[#3B82F6]" />
                <span>Add to My Google Calendar</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
