"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { ROUTES } from "@/constants";

const UPCOMING_EVENTS = [
  {
    id: "1",
    title: "Annual Mega Blood Donation Drive 2026",
    category: "Health & Wellness",
    date: "AUG 15, 2026",
    time: "09:00 AM - 04:00 PM",
    location: "Auditorium Block A, Presidency University",
    image: "/images/event-blood-drive.png",
    slug: "mega-blood-donation-2026",
  },
  {
    id: "2",
    title: "Youth Leadership & Innovation Summit",
    category: "Professional Development",
    date: "SEP 02, 2026",
    time: "10:00 AM - 05:00 PM",
    location: "Main Convention Center, Bengaluru",
    image: "/images/gallery-youth-summit.png",
    slug: "youth-leadership-summit-2026",
  },
  {
    id: "3",
    title: "Community Literacy & Book Distribution",
    category: "Community Service",
    date: "SEP 20, 2026",
    time: "11:00 AM - 02:00 PM",
    location: "Primary Govt School, Yelahanka",
    image: "/images/hero-community.png",
    slug: "community-literacy-drive",
  },
];

export function UpcomingEventsPreviewSection() {
  return (
    <section
      id="events"
      className="section-shell scroll-mt-24 border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/40 py-20"
    >
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-accent-blue)] uppercase dark:text-[color:var(--color-brand-rotary-gold)]">
            Mark Your Calendar
          </span>
          <h2 className="text-heading-xl mt-1 font-bold text-[color:var(--color-text-primary)]">
            Upcoming Events & Action Drives
          </h2>
        </div>
        <Link
          href={ROUTES.EVENTS}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-accent-blue)] hover:underline dark:text-[color:var(--color-brand-rotary-gold)]"
        >
          <span>View Full Calendar</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {UPCOMING_EVENTS.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: idx * 0.08 }}
            className="shadow-medium transition-smooth hover-lift group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
          >
            {/* Image Header */}
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

            {/* Content Body */}
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

                <h3 className="text-heading-s line-clamp-2 font-bold text-[color:var(--color-text-primary)] transition-colors group-hover:text-[color:var(--color-brand-accent-blue)]">
                  {event.title}
                </h3>

                <div className="flex items-start gap-1.5 text-xs text-[color:var(--color-text-muted)]">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-[color:var(--color-border)]/60 pt-3">
                <Link
                  href={`${ROUTES.EVENTS}/${event.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-text-primary)] transition-colors hover:text-[color:var(--color-brand-accent-blue)]"
                >
                  <span>Event Details & RSVP</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
