export interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  date: string; // "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  time: string;
  venue: string;
  location: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  registrationLink?: string;
  googleCalendarLink: string;
  status: "upcoming" | "past";
  rawStart: string; // ISO date string
  rawEnd: string; // ISO date string
}

export type ClubEvent = CalendarEvent; // Alias for backward compatibility

export interface MilestoneEvent {
  year: string;
  title: string;
  description: string;
  date: string;
  venue: string;
}

export interface GoogleCalendarDiagnostics {
  status: "OK" | "MISSING_CONFIG" | "API_ERROR" | "EMPTY_CALENDAR";
  statusCode?: number;
  message: string;
  missingVariable?: string;
  whereToObtain?: string;
  whereToPlace?: string;
  targetFile?: string;
  calendarId: string;
  hasApiKey: boolean;
  itemCount: number;
}

export const DEFAULT_EVENT_IMAGE = "/gallery/gallery-1.jpeg";

const EVENT_IMAGES = [
  "/gallery/gallery-1.jpeg",
  "/gallery/gallery-2.jpg",
  "/gallery/gallery-3.jpeg",
  "/gallery/gallery-4.jpeg",
  "/gallery/gallery-5.jpeg",
  "/gallery/gallery-6.jpeg",
  "/gallery/gallery-7.jpeg",
  "/gallery/gallery-8.jpeg",
  "/gallery/gallery-9.jpeg",
  "/gallery/gallery-10.jpeg",
];

function extractEventImage(description: string, idx: number): string {
  if (description) {
    const matchImg = description.match(/\[image:\s*([^\s\]]+)\]/i);
    if (matchImg && matchImg[1]) {
      return matchImg[1];
    }
  }
  return EVENT_IMAGES[idx % EVENT_IMAGES.length] || DEFAULT_EVENT_IMAGE;
}

function formatIsoDate(dateObj: Date): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime12h(dateObj: Date): string {
  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function inferCategory(title: string, description: string): string {
  const combined = `${title} ${description}`.toLowerCase();
  if (combined.includes("[category:") || combined.includes("category:")) {
    const match = combined.match(/category:\s*([a-z]+)/i);
    if (match && match[1]) {
      const cat = match[1].toLowerCase();
      if (cat.includes("professional")) return "Professional";
      if (cat.includes("international")) return "International";
      if (cat.includes("cultural")) return "Cultural";
      if (cat.includes("sports")) return "Sports";
      if (cat.includes("community")) return "Community";
    }
  }
  if (
    combined.includes("blood") ||
    combined.includes("drive") ||
    combined.includes("service") ||
    combined.includes("clean") ||
    combined.includes("health") ||
    combined.includes("donation")
  ) {
    return "Community";
  }
  if (
    combined.includes("leadership") ||
    combined.includes("workshop") ||
    combined.includes("conclave") ||
    combined.includes("career") ||
    combined.includes("summit") ||
    combined.includes("seminar")
  ) {
    return "Professional";
  }
  if (
    combined.includes("international") ||
    combined.includes("global") ||
    combined.includes("fellowship") ||
    combined.includes("exchange")
  ) {
    return "International";
  }
  if (
    combined.includes("cultural") ||
    combined.includes("fest") ||
    combined.includes("music") ||
    combined.includes("art")
  ) {
    return "Cultural";
  }
  if (
    combined.includes("sports") ||
    combined.includes("marathon") ||
    combined.includes("tournament") ||
    combined.includes("cricket")
  ) {
    return "Sports";
  }
  return "Community";
}

function extractRegistrationLink(description: string): string | undefined {
  if (!description) return undefined;
  const matchReg = description.match(
    /\[registration:\s*(https?:\/\/[^\s\]]+)\]/i,
  );
  if (matchReg && matchReg[1]) return matchReg[1];

  const matchUrl = description.match(/(https?:\/\/[^\s]+)/g);
  if (matchUrl && matchUrl.length > 0) {
    const link = matchUrl.find((u) => !u.includes("calendar.google.com"));
    if (link) return link;
  }
  return undefined;
}

function cleanDescription(rawDesc: string): string {
  if (!rawDesc) return "";
  return rawDesc
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\[category:[^\]]+\]/gi, "")
    .replace(/\[registration:[^\]]+\]/gi, "")
    .replace(/\[image:[^\]]+\]/gi, "")
    .trim();
}

// Generate pre-filled Google Calendar web URL
export function getGoogleCalendarWebUrl(event: CalendarEvent): string {
  if (event.googleCalendarLink && event.googleCalendarLink.startsWith("http")) {
    return event.googleCalendarLink;
  }

  const formatGoogleDate = (isoStr: string) => {
    return new Date(isoStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const startIso = formatGoogleDate(event.rawStart);
  const endIso = formatGoogleDate(event.rawEnd);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title,
  )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(
    event.description,
  )}&location=${encodeURIComponent(event.venue)}`;
}

// On-Demand Google Authentication trigger to add event to personal calendar
export function addToUserGoogleCalendar(event: CalendarEvent) {
  if (typeof window === "undefined") return;
  const webUrl = getGoogleCalendarWebUrl(event);
  window.open(webUrl, "_blank", "noopener,noreferrer");
}

interface GoogleCalendarApiItem {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: {
    date?: string;
    dateTime?: string;
  };
  end?: {
    date?: string;
    dateTime?: string;
  };
}

/**
 * Fetch events DIRECTLY from public Google Calendar API v3 with Real-time Diagnostics.
 * Single source of truth. Zero fallback mock arrays.
 */
export async function fetchGoogleCalendarEventsWithDiagnostics(): Promise<{
  events: CalendarEvent[];
  diagnostics: GoogleCalendarDiagnostics;
}> {
  const calendarId =
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ||
    "eeb75d6bf01f26062e450bd636e8754def7c93a45bba4f7be07a862e49db8745@group.calendar.google.com";
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  if (!apiKey) {
    return {
      events: [],
      diagnostics: {
        status: "MISSING_CONFIG",
        message:
          "Google API Key (NEXT_PUBLIC_GOOGLE_API_KEY) is missing in environment variables.",
        missingVariable: "NEXT_PUBLIC_GOOGLE_API_KEY",
        whereToObtain:
          "Google Cloud Console -> APIs & Services -> Credentials -> Create API Key (Enable Google Calendar API).",
        whereToPlace:
          ".env.local or Vercel Environment Variables: NEXT_PUBLIC_GOOGLE_API_KEY=your_key_here",
        targetFile: "src/lib/google-calendar.ts",
        calendarId,
        hasApiKey: false,
        itemCount: 0,
      },
    };
  }

  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId,
    )}/events?key=${apiKey}&singleEvents=true&orderBy=startTime&maxResults=250`;

    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      let statusDetails = "";
      try {
        const errJson = (await res.json()) as { error?: { message?: string } };
        if (errJson.error?.message)
          statusDetails = `: ${errJson.error.message}`;
      } catch {
        // ignore JSON parse error
      }

      let errorMsg = `[Google Calendar API Error ${res.status}]${statusDetails}`;
      if (res.status === 403) {
        errorMsg +=
          " -> Ensure Google Calendar is set to 'Make available to public' in Google Calendar Settings.";
      } else if (res.status === 404) {
        errorMsg +=
          " -> Calendar ID was not found. Check NEXT_PUBLIC_GOOGLE_CALENDAR_ID.";
      }

      return {
        events: [],
        diagnostics: {
          status: "API_ERROR",
          statusCode: res.status,
          message: errorMsg,
          calendarId,
          hasApiKey: true,
          itemCount: 0,
        },
      };
    }

    const data = (await res.json()) as { items?: GoogleCalendarApiItem[] };
    if (!data.items || !Array.isArray(data.items)) {
      return {
        events: [],
        diagnostics: {
          status: "EMPTY_CALENDAR",
          message:
            "Google Calendar API fetch succeeded (200 OK), but calendar contains 0 events.",
          calendarId,
          hasApiKey: true,
          itemCount: 0,
        },
      };
    }

    const now = new Date();

    const parsedEvents: CalendarEvent[] = data.items.map(
      (item: GoogleCalendarApiItem, idx: number) => {
        const isAllDay = Boolean(item.start?.date);
        const startDate = isAllDay
          ? new Date((item.start?.date || "") + "T00:00:00")
          : new Date(item.start?.dateTime || Date.now());
        const endDate = isAllDay
          ? new Date(
              item.end?.date
                ? item.end.date + "T23:59:59"
                : (item.start?.date || "") + "T23:59:59",
            )
          : new Date(item.end?.dateTime || startDate.valueOf() + 3600000);

        const dateStr = formatIsoDate(startDate);
        const startTimeStr = isAllDay ? "All Day" : formatTime12h(startDate);
        const endTimeStr = isAllDay ? "" : formatTime12h(endDate);
        const timeDisplay = isAllDay
          ? "All Day"
          : `${startTimeStr}${endTimeStr ? " - " + endTimeStr : ""}`;

        const rawDescription = item.description || "";
        const description =
          cleanDescription(rawDescription) ||
          "Official Rotaract scheduled event.";
        const title = item.summary || "Rotaract Event";
        const venue =
          item.location || "Presidency University Campus, Bengaluru";
        const category = inferCategory(title, rawDescription);
        const registrationLink = extractRegistrationLink(rawDescription);
        const googleCalendarLink =
          item.htmlLink ||
          `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title,
          )}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(venue)}`;

        const status: "upcoming" | "past" =
          endDate >= now ? "upcoming" : "past";
        const image = extractEventImage(rawDescription, idx);

        return {
          id: item.id || `gcal-${idx}`,
          title,
          category,
          date: dateStr,
          startTime: startTimeStr,
          endTime: endTimeStr,
          time: timeDisplay,
          venue,
          location: venue,
          description,
          fullDescription: description,
          image,
          images: [image],
          registrationLink,
          googleCalendarLink,
          status,
          rawStart: startDate.toISOString(),
          rawEnd: endDate.toISOString(),
        };
      },
    );

    return {
      events: parsedEvents,
      diagnostics: {
        status: parsedEvents.length > 0 ? "OK" : "EMPTY_CALENDAR",
        statusCode: 200,
        message: `Successfully loaded ${parsedEvents.length} live events from Google Calendar.`,
        calendarId,
        hasApiKey: true,
        itemCount: parsedEvents.length,
      },
    };
  } catch (error: unknown) {
    const errorMsg = `[Google Calendar API Fetch Error]: ${
      error instanceof Error ? error.message : String(error)
    }`;
    return {
      events: [],
      diagnostics: {
        status: "API_ERROR",
        message: errorMsg,
        calendarId,
        hasApiKey: true,
        itemCount: 0,
      },
    };
  }
}

export async function fetchGoogleCalendarEvents(): Promise<CalendarEvent[]> {
  const result = await fetchGoogleCalendarEventsWithDiagnostics();
  return result.events;
}

export async function getUpcomingEvents(
  limit?: number,
): Promise<CalendarEvent[]> {
  const events = await fetchGoogleCalendarEvents();
  const upcoming = events
    .filter((e) => e.status === "upcoming")
    .sort(
      (a, b) => new Date(a.rawStart).getTime() - new Date(b.rawStart).getTime(),
    );
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getPastEvents(limit?: number): Promise<CalendarEvent[]> {
  const events = await fetchGoogleCalendarEvents();
  const past = events
    .filter((e) => e.status === "past")
    .sort(
      (a, b) => new Date(b.rawStart).getTime() - new Date(a.rawStart).getTime(),
    );
  return limit ? past.slice(0, limit) : past;
}

export async function getNextUpcomingEvent(): Promise<CalendarEvent | null> {
  const upcoming = await getUpcomingEvents(1);
  return upcoming.length > 0 ? upcoming[0] : null;
}

export async function getEventsForMonth(
  year: number,
  month: number,
): Promise<CalendarEvent[]> {
  const events = await fetchGoogleCalendarEvents();
  return events.filter((e) => {
    const d = new Date(e.rawStart);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export async function getTimelineFromEvents(): Promise<MilestoneEvent[]> {
  const events = await fetchGoogleCalendarEvents();
  const sorted = [...events].sort(
    (a, b) => new Date(a.rawStart).getTime() - new Date(b.rawStart).getTime(),
  );

  return sorted.map((evt) => {
    const yearStr = new Date(evt.rawStart).getFullYear().toString();
    return {
      year: yearStr,
      title: evt.title,
      description: evt.description,
      date: evt.date,
      venue: evt.venue,
    };
  });
}
