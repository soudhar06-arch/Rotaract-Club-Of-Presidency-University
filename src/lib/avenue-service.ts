import "server-only";
import { google } from "googleapis";
import { googleAuth, googleResourceId } from "./google-auth";
import { cached } from "./server-cache";
import { driveClient, driveImageUrl, getDriveEvents, listDriveChildren } from "./google-drive-service";
import { eventMatchKey, readEventDetails } from "./event-details";
import type { CalendarEvent } from "./google-calendar";

export const AVENUE_NAMES = [
  "Club Service",
  "Community Service",
  "Professional Development",
  "International Service",
  "Public Relations",
  "Fellowship",
] as const;

export interface AvenueEventRecord {
  eventName: string;
  avenue: string;
  driveFolderLink?: string;
}

export interface AvenueImage {
  url: string;
  caption: string;
}

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function canonicalAvenue(value: string) {
  const key = eventMatchKey(value.replace(/avenue/gi, ""));
  return AVENUE_NAMES.find((name) => eventMatchKey(name) === key);
}

function getDriveId(value = "") {
  const id = googleResourceId(value);
  if (id && /^[\w-]+$/.test(id)) return id;
  try {
    const parsed = new URL(value);
    const queryId = parsed.searchParams.get("id");
    return queryId && /^[\w-]+$/.test(queryId) ? queryId : undefined;
  } catch {
    return undefined;
  }
}

export async function readAvenueEventRecords(): Promise<AvenueEventRecord[]> {
  const spreadsheetId = googleResourceId(process.env.GOOGLE_SHEETS_EVENTS_ID);
  if (!spreadsheetId) {
    const details = await readEventDetails();
    return details.map((item) => ({ eventName: item.folderName || item.title, avenue: item.category || "", driveFolderLink: item.folderId }));
  }

  const tab = process.env.GOOGLE_SHEETS_EVENTS_TAB?.trim() || "List of Events";
  return cached(`sheet:events:${spreadsheetId}:${tab}`, 60000, async () => {
    const sheets = google.sheets({ version: "v4", auth: googleAuth(["https://www.googleapis.com/auth/spreadsheets.readonly"]) });
    const escapedTab = `'${tab.replace(/'/g, "''")}'`;
    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${escapedTab}!A:ZZ` }, { timeout: 15000 });
    const rows = (data.values || []).map((row) => row.map((value) => String(value ?? "")));
    const headers = rows[0] || [];
    const headerKeys = headers.map(normalizeHeader);
    const avenueColumn = headerKeys.findIndex((header) => ["avenue", "avenueofservice", "serviceavenue"].includes(header));
    const eventColumn = headerKeys.findIndex((header) => ["event", "eventname", "title", "name"].includes(header));
    const driveColumn = headerKeys.findIndex((header) => ["drivelink", "googledrivelink", "drivefolder", "drivefolderlink", "googledrivefolder", "googledrivefolderlink", "albumlink", "folderlink"].includes(header));
    if (avenueColumn < 0 || (eventColumn < 0 && driveColumn < 0)) {
      throw new Error(`${tab} needs Avenue and Event Name columns, plus an optional Drive Folder Link column.`);
    }

    return rows.slice(1).map((row) => ({
      eventName: row[eventColumn] || "",
      avenue: row[avenueColumn] || "",
      driveFolderLink: driveColumn >= 0 ? row[driveColumn] || undefined : undefined,
    })).filter((record) => record.avenue.trim() && (record.eventName.trim() || record.driveFolderLink));
  });
}

export function findEventAvenue(event: Pick<CalendarEvent, "title" | "folderId">, records: AvenueEventRecord[]) {
  const folderMatches = records.filter((record) => {
    const id = getDriveId(record.driveFolderLink);
    return id && id === event.folderId;
  });
  if (folderMatches.length === 1) return canonicalAvenue(folderMatches[0].avenue);
  const titleKey = eventMatchKey(event.title);
  const titleMatches = records.filter((record) => {
    const recordKey = eventMatchKey(record.eventName);
    return recordKey === titleKey || (Math.min(recordKey.length, titleKey.length) >= 6 && (recordKey.includes(titleKey) || titleKey.includes(recordKey)));
  });
  return titleMatches.length === 1 ? canonicalAvenue(titleMatches[0].avenue) : undefined;
}

function uniqueDriveEvent(title: string, events: Awaited<ReturnType<typeof getDriveEvents>>) {
  const titleKey = eventMatchKey(title);
  const matches = events.filter((event) => {
    const eventKey = eventMatchKey(event.title);
    return eventKey === titleKey || (Math.min(eventKey.length, titleKey.length) >= 6 && (eventKey.includes(titleKey) || titleKey.includes(eventKey)));
  });
  return matches.length === 1 ? matches[0] : undefined;
}

async function imagesFromDriveLink(id: string) {
  const drive = driveClient();
  const { data } = await drive.files.get({ fileId: id, supportsAllDrives: true, fields: "mimeType" }, { timeout: 15000 });
  if (data.mimeType === "application/vnd.google-apps.folder") {
    return (await listDriveChildren(id)).filter((file) => file.id && file.mimeType?.startsWith("image/")).map((file) => driveImageUrl(file.id!));
  }
  return data.mimeType?.startsWith("image/") ? [driveImageUrl(id)] : [];
}

export async function getAvenueImages() {
  const [records, driveEvents] = await Promise.all([
    readAvenueEventRecords(),
    getDriveEvents().catch(() => []),
  ]);
  const eventsByFolder = new Map(driveEvents.map((event) => [event.folderId, event]));
  const images = new Map(AVENUE_NAMES.map((name) => [name, new Map<string, AvenueImage>()]));

  for (const record of records) {
    const avenue = canonicalAvenue(record.avenue);
    if (!avenue) continue;
    const linkedId = getDriveId(record.driveFolderLink);
    const linkedEvent = linkedId ? eventsByFolder.get(linkedId) : undefined;
    const event = linkedEvent || (record.eventName ? uniqueDriveEvent(record.eventName, driveEvents) : undefined);
    let eventImages = event?.images || [];

    if (!eventImages.length && linkedId) {
      try {
        eventImages = await imagesFromDriveLink(linkedId);
      } catch {
        eventImages = [];
      }
    }

    const bucket = images.get(avenue)!;
    for (const url of eventImages) {
      if (!bucket.has(url)) bucket.set(url, { url, caption: record.eventName || event?.title || avenue });
      if (bucket.size >= 24) break;
    }
  }

  return AVENUE_NAMES.map((name) => ({ name, images: [...images.get(name)!.values()] }));
}