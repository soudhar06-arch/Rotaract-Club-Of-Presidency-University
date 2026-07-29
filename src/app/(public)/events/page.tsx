import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "View upcoming events, action drives, workshops, and community meetings hosted by Rotaract.",
};

const EVENTS = [
  {
    title: "Annual Mega Blood Donation Drive 2026",
    category: "Public Health",
    date: "AUG 15, 2026",
    time: "09:00 AM - 04:00 PM",
    location: "Auditorium Block A, Presidency University",
    image: "/images/event-blood-drive.png",
    slug: "mega-blood-donation-2026",
    desc: "Join us in saving lives. Free health checkup and blood donation certificate provided by Red Cross.",
  },
  {
    title: "Youth Leadership & Innovation Summit",
    category: "Professional Development",
    date: "SEP 02, 2026",
    time: "10:00 AM - 05:00 PM",
    location: "Main Convention Center, Bengaluru",
    image: "/images/gallery-youth-summit.png",
    slug: "youth-leadership-summit-2026",
    desc: "A flagship university summit featuring keynote speeches, panel debates, and networking sessions.",
  },
  {
    title: "Community Literacy & Book Distribution",
    category: "Community Service",
    date: "SEP 20, 2026",
    time: "11:00 AM - 02:00 PM",
    location: "Primary Govt School, Yelahanka",
    image: "/images/hero-community.png",
    slug: "community-literacy-drive",
    desc: "Distributing books, stationery, and holding digital learning workshops for young learners.",
  },
];

export default function EventsPage() {
  return (
    <div className="space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Chapter Calendar
        </span>
        <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
          Upcoming Events & Meetings
        </h1>
        <p className="text-body-large text-[color:var(--color-text-secondary)]">
          Participate in our upcoming community drives, professional workshops,
          and fellowship gatherings.
        </p>
      </section>

      <section className="container-shell px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {EVENTS.map((event, idx) => (
            <div
              key={idx}
              className="shadow-medium hover-lift group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-full border border-white/20 bg-[color:var(--color-surface-glass)] px-3 py-1 text-[11px] font-semibold text-[color:var(--color-text-primary)] backdrop-blur-md">
                  {event.category}
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs font-semibold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1 font-normal text-[color:var(--color-text-muted)]">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <h2 className="text-heading-s line-clamp-2 font-bold text-[color:var(--color-text-primary)]">
                    {event.title}
                  </h2>

                  <p className="text-body-small line-clamp-2 text-[color:var(--color-text-secondary)]">
                    {event.desc}
                  </p>

                  <div className="flex items-start gap-1.5 text-xs text-[color:var(--color-text-muted)]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="border-t border-[color:var(--color-border)] pt-3">
                  <Link
                    href={`${ROUTES.EVENTS}/${event.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-accent-blue)] hover:underline dark:text-[color:var(--color-brand-rotary-gold)]"
                  >
                    <span>View Event & Register</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
