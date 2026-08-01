"use client";

import { useState, useEffect } from "react";
import {
  CalendarEvent,
  GoogleCalendarDiagnostics,
  fetchGoogleCalendarEventsWithDiagnostics,
  addToUserGoogleCalendar,
} from "@/lib/google-calendar";

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [diagnostics, setDiagnostics] =
    useState<GoogleCalendarDiagnostics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function executeFetch() {
      try {
        const result = await fetchGoogleCalendarEventsWithDiagnostics();
        if (!isMounted) return;
        setEvents(result.events);
        setDiagnostics(result.diagnostics);
        if (
          result.diagnostics.status !== "OK" &&
          result.diagnostics.status !== "EMPTY_CALENDAR"
        ) {
          setError(result.diagnostics.message);
        } else {
          setError(null);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const errMsg =
          err instanceof Error
            ? err.message
            : "Failed to sync with Google Calendar API";
        setError(errMsg);
        setEvents([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGoogleCalendarEventsWithDiagnostics();
      setEvents(result.events);
      setDiagnostics(result.diagnostics);
      if (
        result.diagnostics.status !== "OK" &&
        result.diagnostics.status !== "EMPTY_CALENDAR"
      ) {
        setError(result.diagnostics.message);
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to refresh Google Calendar events";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events
    .filter((e) => e.status === "upcoming")
    .sort(
      (a, b) => new Date(a.rawStart).getTime() - new Date(b.rawStart).getTime(),
    );

  const pastEvents = events
    .filter((e) => e.status === "past")
    .sort(
      (a, b) => new Date(b.rawStart).getTime() - new Date(a.rawStart).getTime(),
    );

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return {
    events,
    upcomingEvents,
    pastEvents,
    nextEvent,
    loading,
    error,
    diagnostics,
    refresh,
    addToUserCalendar: addToUserGoogleCalendar,
  };
}
