"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ExternalLink,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Info,
} from "lucide-react";
import { CalendarEvent } from "@/lib/google-calendar";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import Image from "next/image";

export function EventCalendar() {
  const {
    events,
    nextEvent,
    loading,
    diagnostics,
    refresh,
    addToUserCalendar,
  } = useCalendarEvents();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEventState, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const selectedEvent =
    selectedEventState || nextEvent || (events.length > 0 ? events[0] : null);

  const [datePopupOpen, setDatePopupOpen] = useState<boolean>(false);
  const [popupDateStr, setPopupDateStr] = useState<string>("");
  const [popupDayEvents, setPopupDayEvents] = useState<CalendarEvent[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Format today's date YYYY-MM-DD
  const todayStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const todayEvents = useMemo(() => {
    return events.filter((evt) => evt.date === todayStr);
  }, [events, todayStr]);

  // Find events for a specific day cell
  const getEventsForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return events.filter((evt) => {
      const matchesCategory =
        selectedCategory === "All" || evt.category === selectedCategory;
      return evt.date === dateStr && matchesCategory;
    });
  };

  // Handle clicking ANY date cell on calendar
  const handleDateCellClick = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const dayEvts = events.filter((evt) => evt.date === dateStr);
    const readableDate = new Date(year, month, day).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    setPopupDateStr(readableDate);
    setPopupDayEvents(dayEvts);
    if (dayEvts.length > 0) {
      setSelectedEvent(dayEvts[0]);
    }
    setDatePopupOpen(true);
  };

  const categories = [
    "All",
    "Community",
    "Professional",
    "International",
    "Cultural",
    "Sports",
  ];

  return (
    <div className="space-y-8">
      {/* Clean Diagnostic Screen (Renders when environment variables need setup) */}
      {diagnostics?.status === "MISSING_CONFIG" && (
        <div className="glass-card space-y-4 border-amber-500/30 bg-amber-500/10 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Google Calendar API Diagnostic Notice
              </h3>
              <p className="text-xs text-amber-200/90">{diagnostics.message}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 border-t border-amber-500/20 pt-2 text-xs md:grid-cols-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white uppercase">
                Missing Variable
              </span>
              <p className="rounded bg-black/40 p-2 font-mono text-amber-300">
                {diagnostics.missingVariable}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white uppercase">
                Where to Obtain
              </span>
              <p className="leading-relaxed text-amber-200/80">
                {diagnostics.whereToObtain}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white uppercase">
                Where to Paste
              </span>
              <p className="rounded bg-black/40 p-2 font-mono text-amber-300">
                {diagnostics.whereToPlace}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Next Event Highlight */}
      {nextEvent && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card relative overflow-hidden p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#3B82F6]/10 to-transparent" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 animate-ping rounded-full bg-[#3B82F6]" />
                <span className="rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[#3B82F6] uppercase">
                  Next Scheduled Conclave
                </span>
                <span className="text-xs text-[#9A9A9A] uppercase">
                  {nextEvent.category}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {nextEvent.title}
              </h3>
              <p className="line-clamp-2 text-xs text-[#9A9A9A] sm:text-sm">
                {nextEvent.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#D4D4D4]">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-[#3B82F6]" />
                  <span>{nextEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#3B82F6]" />
                  <span>{nextEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#3B82F6]" />
                  <span className="max-w-[200px] truncate">
                    {nextEvent.venue}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setSelectedEvent(nextEvent)}
                className="shadow-glow flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
              >
                <span>View Details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => addToUserCalendar(nextEvent)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-white/10"
              >
                <span>Add to My Google Calendar</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#3B82F6]" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Interactive Calendar Section */}
      <div className="glass-card grid grid-cols-1 overflow-hidden lg:grid-cols-12">
        {/* Left Side: Calendar Grid & Navigation (7 Cols) */}
        <div className="p-6 sm:p-8 lg:col-span-7 lg:border-r lg:border-white/10">
          {/* Header Controls */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/20 text-[#3B82F6]">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wide text-white">
                  {monthNames[month]} {year}
                </h3>
                <p className="text-xs text-[#9A9A9A]">
                  Synced Live via Google Calendar API
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/10"
                title="Sync with Google Calendar"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin text-[#3B82F6]" : ""}`}
                />
              </button>
              <button
                onClick={handleToday}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/10"
                aria-label="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/10"
                aria-label="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "shadow-glow bg-[#3B82F6] text-white"
                    : "border border-white/5 bg-white/[0.03] text-[#9A9A9A] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="mt-8 animate-pulse space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={`sk-h-${i}`} className="h-4 rounded bg-white/10" />
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={`sk-c-${i}`}
                    className="h-12 rounded-xl bg-white/5"
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Weekday Names */}
              <div className="mt-8 grid grid-cols-7 text-center text-xs font-semibold text-[#71717A]">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Days Grid */}
              <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Empty cells before 1st */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 sm:h-12" />
                ))}

                {/* Day Cells - CLICKABLE FOR ALL DATES */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const hasEvents = dayEvents.length > 0;
                  const isSelected =
                    selectedEvent &&
                    dayEvents.some((e) => e.id === selectedEvent.id);

                  const formattedDay = day < 10 ? `0${day}` : `${day}`;
                  const formattedMonth =
                    month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
                  const cellDateStr = `${year}-${formattedMonth}-${formattedDay}`;
                  const isTodayCell = cellDateStr === todayStr;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => handleDateCellClick(day)}
                      title={`Click to view events for ${monthNames[month]} ${day}`}
                      className={`relative flex h-11 flex-col items-center justify-center rounded-xl text-xs font-medium transition-all sm:h-12 ${
                        isSelected
                          ? "shadow-glow bg-[#3B82F6] text-white"
                          : hasEvents
                            ? "border border-[#3B82F6]/50 bg-[#3B82F6]/10 text-white hover:bg-[#3B82F6]/25"
                            : isTodayCell
                              ? "border border-white/20 bg-white/10 text-white"
                              : "text-[#9A9A9A] hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvents && (
                        <div className="mt-1 flex items-center justify-center gap-0.5">
                          {dayEvents.slice(0, 3).map((_, idx) => (
                            <span
                              key={idx}
                              className={`h-1.5 w-1.5 rounded-full ${
                                isSelected ? "bg-white" : "bg-[#3B82F6]"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Today's Events Quick Bar */}
          {todayEvents.length > 0 && !loading && (
            <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                <CheckCircle2 className="h-4 w-4" />
                <span>Happening Today ({todayEvents.length})</span>
              </div>
              <div className="mt-2 space-y-2">
                {todayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-black/30 p-2.5 text-xs text-white hover:bg-black/50"
                  >
                    <span className="truncate font-semibold">{evt.title}</span>
                    <span className="ml-2 shrink-0 text-[11px] text-[#9A9A9A]">
                      {evt.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Event Details Panel (5 Cols) */}
        <div className="flex flex-col justify-between bg-[#0A0A0A]/90 p-6 sm:p-8 lg:col-span-5">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-24 rounded bg-white/10" />
              <div className="h-8 w-3/4 rounded bg-white/10" />
              <div className="h-20 w-full rounded bg-white/5" />
              <div className="h-10 w-full rounded bg-white/10" />
            </div>
          ) : selectedEvent ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Event Image Banner */}
                {selectedEvent.image && (
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
                    <Image
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                    <span className="shadow-glow absolute top-3 left-3 rounded-md bg-[#3B82F6] px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                      {selectedEvent.category}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-[#3B82F6]/40 bg-[#3B82F6]/20 px-3 py-1 text-[11px] font-semibold text-[#3B82F6]">
                    {selectedEvent.category}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase ${
                      selectedEvent.status === "upcoming"
                        ? "text-emerald-400"
                        : "text-[#71717A]"
                    }`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>

                <h4 className="text-xl leading-snug font-bold text-white">
                  {selectedEvent.title}
                </h4>

                <div className="space-y-3 border-y border-white/10 py-4 text-xs text-[#D4D4D4]">
                  <div className="flex items-center gap-2.5">
                    <CalendarIcon className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                    <span className="leading-relaxed">
                      {selectedEvent.venue}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="mb-2 text-xs font-semibold tracking-wider text-white uppercase">
                    About This Event
                  </h5>
                  <p className="line-clamp-6 text-xs leading-relaxed text-[#9A9A9A]">
                    {selectedEvent.fullDescription || selectedEvent.description}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 pt-4">
                  {selectedEvent.registrationLink && (
                    <a
                      href={selectedEvent.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shadow-glow w-full rounded-xl bg-[#3B82F6] py-3 text-center text-xs font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
                    >
                      Register For Event
                    </a>
                  )}

                  <button
                    onClick={() => addToUserCalendar(selectedEvent)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-xs font-semibold text-white transition-all hover:bg-white/[0.08]"
                  >
                    <span>Add to My Google Calendar</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#3B82F6]" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Clean Empty State when Google Calendar has no events or selected date has no event */
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[#71717A]">
              <CalendarDays className="mb-3 h-12 w-12 text-[#3B82F6]/40" />
              <h4 className="text-sm font-semibold text-white">
                No Event Selected
              </h4>
              <p className="mt-1 max-w-xs text-xs text-[#9A9A9A]">
                Click any date cell on the calendar grid to view scheduled
                events or empty date details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Date Click Modal Popup */}
      <AnimatePresence>
        {datePopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDatePopupOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-card relative z-10 max-h-[85vh] w-full max-w-xl space-y-6 overflow-y-auto p-6 sm:p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/20 text-[#3B82F6]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white sm:text-lg">
                      {popupDateStr}
                    </h3>
                    <p className="text-xs text-[#9A9A9A]">
                      {popupDayEvents.length > 0
                        ? `${popupDayEvents.length} event(s) scheduled`
                        : "No events scheduled for this day"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDatePopupOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-[#9A9A9A] hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body: Events list OR Empty state */}
              {popupDayEvents.length > 0 ? (
                <div className="space-y-6">
                  {popupDayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-md border border-[#3B82F6]/40 bg-[#3B82F6]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#3B82F6] uppercase">
                          {evt.category}
                        </span>
                        <span
                          className={`text-xs font-bold uppercase ${
                            evt.status === "upcoming"
                              ? "text-emerald-400"
                              : "text-[#71717A]"
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white">
                        {evt.title}
                      </h4>

                      <div className="space-y-2 text-xs text-[#D4D4D4]">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-[#3B82F6]" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                          <span>{evt.venue}</span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-[#9A9A9A]">
                        {evt.description}
                      </p>

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                        {evt.registrationLink && (
                          <a
                            href={evt.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shadow-glow flex-1 rounded-xl bg-[#3B82F6] py-2.5 text-center text-xs font-semibold text-white"
                          >
                            Register
                          </a>
                        )}
                        <button
                          onClick={() => addToUserCalendar(evt)}
                          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
                        >
                          <span>Add to My Google Calendar</span>
                          <ExternalLink className="h-3.5 w-3.5 text-[#3B82F6]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state when clicked date has no event */
                <div className="flex flex-col items-center justify-center space-y-3 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#71717A]">
                    <Info className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    No Events on this Date
                  </h4>
                  <p className="max-w-sm text-xs text-[#9A9A9A]">
                    There are no scheduled club activities or conclaves for this
                    date in Google Calendar. Check highlighted dates on the
                    calendar grid!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
