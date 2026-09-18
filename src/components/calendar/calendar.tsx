"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { CalendarEvent } from "@/lib/google-calendar";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import Card5 from "@/components/ui/card-5";
import { ScheduleDate } from "@/components/ui/schedule-date";

export function EventCalendar() {
  const {
    events,
    nextEvent,
    loading,
    diagnostics,
    refresh,
  } = useCalendarEvents();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEventState, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showSchedulePicker, setShowSchedulePicker] = useState<boolean>(false);
  const [datePopupOpen, setDatePopupOpen] = useState<boolean>(false);
  const [popupDateStr, setPopupDateStr] = useState<string>("");
  const [popupDayEvents, setPopupDayEvents] = useState<CalendarEvent[]>([]);

  const selectedEvent =
    selectedEventState || nextEvent || (events.length > 0 ? events[0] : null);

  // Close popup on ESC key
  useEffect(() => {
    if (!datePopupOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setDatePopupOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [datePopupOpen]);

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
      {/* Clean Diagnostic Screen */}
      {diagnostics?.status === "MISSING_CONFIG" && (
        <div className="glass-card space-y-4 border-amber-500/30 bg-amber-500/10 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Google Calendar API Diagnostic Notice
              </h3>
              <p className="text-xs text-amber-200/80">
                {diagnostics.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Control Header & Schedule Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSchedulePicker(!showSchedulePicker)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#3B82F6]" />
            <span>{showSchedulePicker ? "Hide Date Range Filter" : "Filter Schedule Date"}</span>
          </button>

          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-[#9A9A9A] hover:text-white"
            title="Refresh Google Calendar sync"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#3B82F6]" : ""}`} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#3B82F6] text-white shadow-glow"
                  : "border border-white/10 bg-white/[0.04] text-[#9A9A9A] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Picker Dropdown */}
      <AnimatePresence>
        {showSchedulePicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden py-2"
          >
            <ScheduleDate
              onApply={(range) => {
                if (range.start) setCurrentDate(range.start);
                setShowSchedulePicker(false);
              }}
              onCancel={() => setShowSchedulePicker(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid & Highlight Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Calendar Grid (7 Cols) */}
        <div className="glass-card p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToday}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-[#9A9A9A] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-[#9A9A9A] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="mt-6 grid grid-cols-7 text-center text-xs font-semibold text-[#71717A]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 rounded-xl bg-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateCellClick(day)}
                  className={`group relative flex h-16 flex-col items-center justify-between rounded-xl border p-2 text-left transition-all ${
                    hasEvents
                      ? "border-[#3B82F6]/60 bg-[#3B82F6]/10 text-white hover:border-[#3B82F6] hover:bg-[#3B82F6]/20"
                      : "border-white/5 bg-white/[0.02] text-[#9A9A9A] hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="text-xs font-semibold">{day}</span>
                  {hasEvents && (
                    <div className="flex w-full items-center justify-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] shadow-glow" />
                      <span className="text-[10px] font-bold text-[#3B82F6]">
                        {dayEvents.length}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Event Detail Popup Media Card (5 Cols) */}
        <div className="flex flex-col justify-start lg:col-span-5">
          {selectedEvent ? (
            <Card5 event={selectedEvent} />
          ) : (
            <div className="glass-card flex flex-col items-center justify-center p-8 text-center text-[#71717A]">
              <CalendarIcon className="mb-3 h-10 w-10 text-[#3B82F6]" />
              <h4 className="text-sm font-bold text-white">Select a Date or Event</h4>
              <p className="mt-1 text-xs text-[#9A9A9A]">
                Click any day on the calendar grid to inspect live Google Calendar event details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Date Popup Card Modal */}
      <AnimatePresence>
        {datePopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setDatePopupOpen(false);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto"
            >
              {popupDayEvents.length > 0 ? (
                <div className="space-y-4">
                  {popupDayEvents.map((evt) => (
                    <Card5 key={evt.id} event={evt} onClose={() => setDatePopupOpen(false)} />
                  ))}
                </div>
              ) : (
                <div className="glass-card flex flex-col items-center justify-center space-y-4 p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#71717A]">
                    <Info className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">{popupDateStr}</h4>
                  <p className="max-w-sm text-xs text-[#9A9A9A]">
                    No scheduled club activities or conclaves on this date in Google Calendar.
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
