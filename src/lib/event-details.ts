import "server-only";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { getCMSClient, CMSStore } from "./cms-store";
import type { EventItem } from "./cms-store";

export const eventDetailSchema = z.object({
  folderId: z.string().optional(), folderName: z.string().optional(), title: z.string().min(1),
  description: z.string().max(20000), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().optional(), category: z.string().optional(), venue: z.string().optional(), platform: z.string().optional(),
  participants: z.number().int().nonnegative().optional(), beneficiaries: z.number().int().nonnegative().optional(),
  collaborators: z.array(z.string()).optional(), registrationLink: z.string().url().optional(),
});
export const eventDetailsSchema = z.array(eventDetailSchema).max(2000);
export type EventDetails = z.infer<typeof eventDetailSchema>;
export const eventMatchKey = (value: string) => value.normalize("NFKC").toLowerCase().replace(/&/g, "and").replace(/[^\p{L}\p{N}]/gu, "");

const avenues = ["Club Service", "Community Service", "Professional Development", "International Service", "Public Relations", "Fellowship"];
function canonicalAvenue(value = "") {
  const key = eventMatchKey(value.replace(/avenue/gi, ""));
  return avenues.find(item => eventMatchKey(item) === key) || value.trim();
}
function sourceDate(value = "") {
  const match = value.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})/i);
  if (!match) return undefined;
  const parsed = new Date(`${match[2]} ${match[1]}, ${match[3]} 00:00:00 UTC`);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : undefined;
}
function parseTextSource(text: string): EventDetails[] {
  const blocks = [...text.matchAll(/^EVENT\s+\d+\s*$([\s\S]*?)(?=^={8,}\s*$|^FUTURE\s*\/|\z)/gmi)];
  return blocks.map(match => {
    const block = match[1];
    const field = (name: string) => block.match(new RegExp(`^${name}:\\s*(.+)$`, "mi"))?.[1]?.trim();
    const description = block.match(/^DESCRIPTION:\s*([\s\S]*?)$/mi)?.[1]?.trim() || "";
    const inferred = description.match(/under\s+the\s+(.+?)\s+Avenue/i)?.[1];
    return { title: field("TITLE") || "", description, date: sourceDate(field("DATE")), time: field("TIME"),
      venue: field("VENUE"), platform: field("MODE"), category: canonicalAvenue(field("AVENUE") || inferred || "") };
  }).filter(item => item.title && item.description);
}

export async function readEventDetails(): Promise<EventDetails[]> {
  const configuredPath = process.env.EVENT_DETAILS_FILE_PATH;
  if (configuredPath) {
    const content = await readFile(configuredPath, "utf8");
    return eventDetailsSchema.parse(configuredPath.toLowerCase().endsWith(".json") ? JSON.parse(content) : parseTextSource(content));
  }
  const repositorySource = path.join(process.cwd(), "Events%20even%20Details.txt");
  try { await access(repositorySource); return eventDetailsSchema.parse(parseTextSource(await readFile(repositorySource, "utf8"))); }
  catch { /* Continue to the CMS source when the repository file is absent. */ }
  if (!CMSStore.isConfigured()) return [];
  const { data, error } = await getCMSClient().from("content_documents").select("content").eq("id", "event-details").maybeSingle();
  if (error) throw new Error(`Event details source could not be read: ${error.message}`);
  return data ? eventDetailsSchema.parse(data.content) : [];
}

export function matchEventDetails(event: EventItem, details: EventDetails[]) {
  const byId = details.filter((item) => item.folderId && item.folderId === event.folderId);
  if (byId.length === 1) return byId[0];
  const eventKey = eventMatchKey(event.title);
  const matches = details.filter((item) => {
    const sourceKey = eventMatchKey(item.folderName || item.title);
    return sourceKey === eventKey || (eventKey.length >= 6 && (sourceKey.includes(eventKey) || eventKey.includes(sourceKey)));
  });
  return matches.length === 1 ? matches[0] : undefined;
}
