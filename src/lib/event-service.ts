import "server-only";
import { CMSStore, type EventItem } from "./cms-store";
import { getDriveEvents } from "./google-drive-service";
import { configuredValue } from "./google-auth";
import { getCalendarFeed } from "./calendar-service";
import {
  eventMatchKey,
  matchEventDetails,
  readEventDetails,
} from "./event-details";
import { findEventAvenue, readAvenueEventRecords } from "./avenue-service";
import { applyCachedDescriptions } from "./event-descriptions";
import { cached } from "./server-cache";
import localArchive from "@/data/event-archive.json";
import type { CalendarEvent } from "./google-calendar";

export function historicalToCalendar(event: EventItem): CalendarEvent {
  return {
    ...event,
    id: event.id,
    slug: event.slug || event.id,
    title: event.title,
    category: event.category || "",
    date: event.date || "",
    rawStart: event.date ? `${event.date}T00:00:00+05:30` : "",
    rawEnd: "",
    startTime: "",
    endTime: "",
    time: event.time || "",
    venue: event.venue || event.platform || "",
    location: event.venue || "",
    description: event.description || "",
    fullDescription: event.detailedDescription || event.description || "",
    shortDescription: event.shortDescription || event.description || "",
    image: event.coverImage || event.image || "",
    images: event.images || [],
    status: "past",
  };
}

export function mergeHistoricalEvents(
  folders: EventItem[],
  cms: EventItem[],
  details: Awaited<ReturnType<typeof readEventDetails>>,
  warnings: string[] = [],
) {
  const used = new Set<string>();
  const merged = folders.map((folder) => {
    const exact = cms.filter((item) => item.folderId === folder.folderId);
    const byName = cms.filter(
      (item) =>
        !item.folderId &&
        eventMatchKey(item.title) === eventMatchKey(folder.title),
    );
    const matching =
      exact.length === 1
        ? exact[0]
        : byName.length === 1
          ? byName[0]
          : undefined;
    if (matching) used.add(matching.id);
    const source = matchEventDetails(folder, details);
    if (!source)
      warnings.push(
        `No unambiguous event-details match for folder: ${folder.title}`,
      );
    const result = {
      ...folder,
      ...matching,
      ...(source || {}),
      title: folder.title,
      id: matching?.id || folder.id,
      slug: matching?.slug || folder.slug,
      folderId: folder.folderId,
      images: [
        ...new Set([...(matching?.images || []), ...(folder.images || [])]),
      ],
      coverImage: matching?.coverImage || folder.coverImage,
    };
    // Source changes must invalidate previously generated descriptions.
    if (source && source.description !== matching?.description) {
      result.shortDescription = undefined;
      result.detailedDescription = undefined;
    }
    return result;
  });
  return [...merged, ...cms.filter((item) => !used.has(item.id))].filter(
    (item) => item.published !== false && item.source !== "calendar",
  );
}

async function buildEventFeed() {
  const driveConfigured = Boolean(
    configuredValue(process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID),
  );
  const [calendar, folders, cms, source, avenueRecordsResult] =
    await Promise.allSettled([
      getCalendarFeed(),
      driveConfigured
        ? getDriveEvents()
        : Promise.resolve(localArchive as EventItem[]),
      CMSStore.isConfigured() ? CMSStore.getEvents(true) : Promise.resolve([]),
      readEventDetails(),
      readAvenueEventRecords(),
    ]);
  const warnings: string[] = [];
  const errors: string[] = [];
  for (const [index, result] of [
    calendar,
    folders,
    cms,
    source,
    avenueRecordsResult,
  ].entries())
    if (result.status === "rejected")
      errors.push(
        `${["Calendar", "Drive", "CMS", "Event details", "Events sheet"][index]}: ${result.reason instanceof Error ? result.reason.message : "source unavailable"}`,
      );
  const folderEvents =
    folders.status === "fulfilled" && folders.value.length
      ? folders.value
      : (localArchive as EventItem[]);
  if (folders.status === "rejected")
    warnings.push(
      "Using the indexed local event archive because Google Drive is unavailable.",
    );
  const historical = mergeHistoricalEvents(
    cms.status === "rejected" ? [] : folderEvents,
    cms.status === "fulfilled" ? cms.value : [],
    source.status === "fulfilled" ? source.value : [],
    warnings,
  );
  const avenueRecords =
    avenueRecordsResult.status === "fulfilled" ? avenueRecordsResult.value : [];
  const described = (await applyCachedDescriptions(historical)).map(
    (event) => ({
      ...event,
      category: findEventAvenue(event, avenueRecords) || event.category,
    }),
  );
  const calendarData =
    calendar.status === "fulfilled"
      ? calendar.value
      : {
          events: [],
          diagnostics: {
            status: "API_ERROR" as const,
            message: "Calendar unavailable.",
            calendarId: "",
            hasApiKey: false,
            itemCount: 0,
          },
        };
  if (!["OK", "EMPTY_CALENDAR"].includes(calendarData.diagnostics.status))
    errors.push(calendarData.diagnostics.message);
  const upcoming = calendarData.events
    .filter((item) => item.status === "upcoming")
    .map((event) => ({
      ...event,
      category: findEventAvenue(event, avenueRecords) || event.category,
    }));
  return {
    events: [
      ...upcoming,
      ...described
        .map(historicalToCalendar)
        .sort((a, b) => b.date.localeCompare(a.date)),
    ],
    diagnostics: calendarData.diagnostics,
    errors,
    warnings,
  };
}

export function getEventFeed() {
  return cached("public-event-feed", 60_000, buildEventFeed);
}
