"use client";

import { motion } from "framer-motion";
import { EventCalendar } from "@/components/calendar/calendar";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

export function UpcomingEventsPreviewSection() {
  const { upcomingEvents, loading, addToUserCalendar } = useCalendarEvents();
  const next3Events = upcomingEvents.slice(0, 3);

  return (
    <section id="events" className="section-shell relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
        >
          CALENDAR & CONCLAVES
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Upcoming Events & Interactive Schedule
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-[#9A9A9A]"
        >
          Explore upcoming leadership conclaves, community drives, and
          networking assemblies synced live with our Google Calendar.
        </motion.p>
      </div>

      {/* Featured Event Cards */}
      <div className="mt-14">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="glass-card h-80 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : next3Events.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center space-y-3 p-12 text-center">
            <CalendarDays className="h-10 w-10 text-[#3B82F6]" />
            <h3 className="text-base font-bold text-white">
              No Upcoming Events Scheduled
            </h3>
            <p className="max-w-md text-xs text-[#9A9A9A]">
              Events created in Google Calendar will automatically sync and
              display here in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {next3Events.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card group flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-[#101010]">
                    <Image
                      src={evt.image}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    <span className="shadow-glow absolute top-3 left-3 rounded-md bg-[#3B82F6] px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                      {evt.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-base font-bold text-white group-hover:text-[#3B82F6]">
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
                        <span className="truncate">
                          {evt.venue || evt.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => addToUserCalendar(evt)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <span>Add to My Google Calendar</span>
                    <ExternalLink className="h-3 w-3 text-[#3B82F6]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Dynamic Interactive Event Calendar */}
      <div id="calendar" className="mt-16">
        <EventCalendar />
      </div>
    </section>
  );
}
