export interface CalendarEvent {
  id: string;
  slug?: string;
  source?: "calendar" | "cms" | "drive" | "local";
  shortDescription?: string;
  folderId?: string;
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
  eventDescription?: string;
  details?: string;
  content?: string;
  body?: string;
  image: string;
  images: string[];
  highlights?: string[];
  participants?: number;
  beneficiaries?: number;
  collaborators?: string[];
  objective?: string;
  gallery?: string[];
  registrationLink?: string;
  googleCalendarLink?: string;
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

export async function fetchGoogleCalendarEventsWithDiagnostics(calendarOnly = false): Promise<{ events: CalendarEvent[]; diagnostics: GoogleCalendarDiagnostics }> {
  const response = await fetch(calendarOnly ? "/api/calendar" : "/api/events", { cache: "no-store" });
  if (!response.ok) throw new Error("Events are temporarily unavailable.");
  return response.json();
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

export interface ProjectItem {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  objective?: string;
  fullDescription?: string;
  category: string;
  date: string;
  time?: string;
  venue?: string;
  image?: string;
  coverImage: string;
  images: string[];
  featured?: boolean;
  published?: boolean;
  collaborators?: string[];
  participants?: number;
  beneficiaries?: number;
  volunteers?: number;
  platform?: string;
  highlights?: string[];
  registrationLink?: string;
  googleCalendarLink?: string;
}

export function normalizeProjectToCalendarEvent(project: ProjectItem): CalendarEvent {
  const description = project.fullDescription || project.description || project.shortDescription || "";
  const image = project.coverImage || project.image || project.images[0] || "";
  return { ...project, id: project.id, source: "cms", date: project.date || "", rawStart: project.date ? `${project.date}T00:00:00+05:30` : "", rawEnd: "", startTime: "", endTime: "", time: project.time || "", venue: project.venue || project.platform || "", location: project.venue || "", description, fullDescription: description, image, images: project.images || [], status: "past" };
}
