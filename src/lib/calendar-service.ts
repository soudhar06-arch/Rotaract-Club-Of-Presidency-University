import "server-only";
import type { CalendarEvent, GoogleCalendarDiagnostics } from "./google-calendar";
import { cached, clearDataCache } from "./server-cache";
import { configuredValue } from "./google-auth";

interface CalendarItem {
  id?: string; summary?: string; description?: string; location?: string; htmlLink?: string; status?: string;
  start?: { date?: string; dateTime?: string }; end?: { date?: string; dateTime?: string };
}
const time = (date: Date) => date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });
export function normalizeCalendarItem(item: CalendarItem, now = new Date()): CalendarEvent | null {
  const rawStart = item.start?.dateTime || (item.start?.date ? `${item.start.date}T00:00:00+05:30` : "");
  const rawEnd = item.end?.dateTime || (item.end?.date ? `${item.end.date}T00:00:00+05:30` : rawStart);
  if (!item.id || !item.summary || item.status === "cancelled" || !rawStart || !Number.isFinite(Date.parse(rawStart)) || !Number.isFinite(Date.parse(rawEnd))) return null;
  const raw = item.description || "";
  const description = raw.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").replace(/\[(?:category|avenue|registration|image):[^\]]+\]/gi, "").trim();
  const image = raw.match(/\[image:\s*(https?:\/\/[^\s\]]+)\]/i)?.[1] || "";
  const category = raw.match(/\[(?:avenue|category):\s*([^\]]+)\]/i)?.[1]?.trim() || "";
  const registrationLink = raw.match(/\[registration:\s*(https?:\/\/[^\s\]]+)\]/i)?.[1];
  const startTime = item.start?.date ? "All day" : time(new Date(rawStart));
  const endTime = item.start?.date ? "" : time(new Date(rawEnd));
  return {
    id: item.id, slug: item.id, source: "calendar", title: item.summary, category,
    date: item.start?.date || new Date(rawStart).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
    rawStart, rawEnd, startTime, endTime, time: endTime ? `${startTime} – ${endTime}` : startTime,
    venue: item.location || "", location: item.location || "", description, fullDescription: description,
    shortDescription: description, image, images: image ? [image] : [], registrationLink,
    googleCalendarLink: item.htmlLink, status: new Date(rawEnd) > now ? "upcoming" : "past",
  };
}

export async function getCalendarFeed(): Promise<{ events: CalendarEvent[]; diagnostics: GoogleCalendarDiagnostics }> {
  return cached("calendar", 60000, async () => {
    const calendarId = configuredValue(process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID) || "";
    const apiKey = configuredValue(process.env.GOOGLE_CALENDAR_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    const base = { calendarId, hasApiKey: Boolean(apiKey), itemCount: 0 };
    if (!calendarId || !apiKey) return { events: [], diagnostics: { ...base, status: "MISSING_CONFIG", message: "Set GOOGLE_CALENDAR_API_KEY and GOOGLE_CALENDAR_ID (legacy NEXT_PUBLIC_GOOGLE_* names are supported server-side)." } };
    try {
      const items: CalendarItem[] = [];
      let pageToken: string | undefined;
      do {
        const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
        url.search = new URLSearchParams({ key: apiKey, singleEvents: "true", orderBy: "startTime", maxResults: "250", timeMin: new Date(Date.now() - 366 * 86400000).toISOString(), timeMax: new Date(Date.now() + 366 * 86400000).toISOString(), ...(pageToken ? { pageToken } : {}) }).toString();
        const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
        if (!response.ok) { clearDataCache(); return { events: [], diagnostics: { ...base, status: "API_ERROR", statusCode: response.status, message: `Calendar API returned ${response.status}. Check API enablement, key restrictions, calendar ID and public visibility.` } }; }
        const data = await response.json();
        items.push(...(data.items || [])); pageToken = data.nextPageToken;
      } while (pageToken);
      const events = items.map((item) => normalizeCalendarItem(item)).filter((item): item is CalendarEvent => item !== null);
      return { events, diagnostics: { ...base, status: events.length ? "OK" : "EMPTY_CALENDAR", statusCode: 200, itemCount: events.length, message: `Read ${events.length} Calendar events.` } };
    } catch { clearDataCache(); return { events: [], diagnostics: { ...base, status: "API_ERROR", message: "Calendar request failed or timed out." } }; }
  });
}
