"use client";
import { use, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Share2, CalendarPlus } from "lucide-react";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { BackButton } from "@/components/shared/back-button";
import { ProjectSlideshow } from "@/components/shared/project-slideshow";

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { events, loading, error, addToUserCalendar } = useCalendarEvents();
  const [shareStatus, setShareStatus] = useState("");
  const event = events.find(item => item.id === slug || item.slug === slug);
  if (loading) return <div className="section-shell pt-32 text-zinc-400">Loading event?</div>;
  if (!event) return <div className="section-shell space-y-4 pt-32"><BackButton fallbackRoute="/events" /><h1 className="text-3xl text-white">{error ? "Events are temporarily unavailable." : "Event not found"}</h1><Link href="/events" className="text-blue-400">Browse events</Link></div>;
  return <div className="space-y-12 pb-20 pt-28"><div className="container-shell max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
    <BackButton fallbackRoute="/events" label="Back to all events" />
    <div className="space-y-3">{event.category && <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs uppercase text-blue-400">{event.category}</span>}<h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">{event.title}</h1></div>
    <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-white/10 bg-[#101010]/80 p-5 text-sm text-zinc-300">
      {event.date && <span className="flex items-center gap-2"><Calendar size={16} />{new Date(`${event.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>}
      {event.time && <span className="flex items-center gap-2"><Clock size={16} />{event.time}</span>}
      {event.venue && <span className="flex items-center gap-2"><MapPin size={16} />{event.venue}</span>}
      <button className="ml-auto flex items-center gap-2" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setShareStatus("Link copied"); } catch { setShareStatus("Could not copy link"); } }}><Share2 size={16} />{shareStatus || "Share"}</button>
    </div>
    <ProjectSlideshow title={event.title} coverImage={event.image} images={event.images} className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950" />
    {event.shortDescription && <p className="text-lg leading-relaxed text-zinc-200">{event.shortDescription}</p>}
    <section className="space-y-4"><h2 className="text-xl font-bold text-white">About the event</h2><div className="whitespace-pre-line leading-relaxed text-zinc-300">{event.fullDescription || event.description || "Event details have not been published yet."}</div></section>
    {(event.participants !== undefined || event.beneficiaries !== undefined || !!event.collaborators?.length) && <section className="grid gap-4 rounded-2xl border border-white/10 p-5 text-zinc-300 sm:grid-cols-2">{event.participants !== undefined && <p>Participants: {event.participants}</p>}{event.beneficiaries !== undefined && <p>Beneficiaries: {event.beneficiaries}</p>}{!!event.collaborators?.length && <p>Collaborators: {event.collaborators.join(", ")}</p>}</section>}
    <div className="flex flex-wrap gap-4">{event.source === "calendar" && <button onClick={() => addToUserCalendar(event)} className="flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm text-white"><CalendarPlus size={18} />Add to Google Calendar</button>}{event.registrationLink && <a href={event.registrationLink} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-5 py-3 text-sm text-white">Register for event</a>}</div>
  </div></div>;
}
