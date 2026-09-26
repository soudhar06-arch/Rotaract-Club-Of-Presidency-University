import "server-only";
import { google } from "googleapis";
import { googleAuth, googleResourceId } from "./google-auth";
import { cached, clearDataCache } from "./server-cache";
import { sortBoard } from "./board-order";
import type { BODMember, ProjectItem } from "./cms-store";

type Module = "bod" | "projects";
export function usesSheet(module: Module) { return process.env[module === "bod" ? "BOD_DATA_SOURCE" : "PROJECTS_DATA_SOURCE"] === "sheets"; }
const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const fields = {
  bod: ["id", "name", "role", "category", "bio", "quote", "image", "instagram", "linkedin", "email", "displayOrder", "isActive"],
  projects: ["id", "title", "slug", "category", "date", "time", "venue", "platform", "shortDescription", "fullDescription", "objective", "coverImage", "images", "featured", "published", "participants", "beneficiaries", "volunteers", "collaborators"],
};
function settings(module: Module) {
  const variable = module === "bod" ? "GOOGLE_SHEETS_BOD" : "GOOGLE_SHEETS_PROJECTS";
  const spreadsheetId = googleResourceId(process.env[`${variable}_ID`]);
  const tab = process.env[`${variable}_TAB`]?.trim();
  if (!spreadsheetId || !tab) throw new Error(`Set ${variable}_ID and ${variable}_TAB for the selected live Sheets source.`);
  return { spreadsheetId, tab, range: `'${tab.replace(/'/g, "''")}'` };
}
async function read(module: Module) {
  const config = settings(module);
  return cached(`sheet-cms:${module}`, 60000, async () => {
    const sheets = google.sheets({ version: "v4", auth: googleAuth(["https://www.googleapis.com/auth/spreadsheets"]) });
    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: config.spreadsheetId, range: `${config.range}!A:ZZ` }, { timeout: 15000 });
    const rows = (data.values || []).map(row => row.map(value => String(value ?? "")));
    const headers = rows[0] || [];
    const required = module === "bod" ? ["id", "name", "role"] : ["id", "title", "category"];
    for (const key of required) if (!headers.some(header => normalizeHeader(header) === normalizeHeader(key))) throw new Error(`${config.tab} needs a ${key} column. See docs/ENVIRONMENT_SETUP.md for the exact sheet schema.`);
    const records = rows.slice(1).map((row, index) => ({ row: index + 2, value: Object.fromEntries(headers.map((header, i) => [normalizeHeader(header), row[i] || ""])) })).filter(item => Object.values(item.value).some(Boolean));
    const ids = records.map(record => record.value.id);
    if (ids.some(id => !id) || new Set(ids).size !== ids.length) throw new Error(`${config.tab}: every nonempty row needs a unique, permanent id.`);
    return { config, headers, records };
  });
}
const yes = (value: string | undefined, defaultValue = true) => value ? ["true", "yes", "1", "active", "published"].includes(value.toLowerCase()) : defaultValue;
function array(value: string | undefined): string[] {
  if (!value) return [];
  if (value.startsWith("[")) { const parsed = JSON.parse(value); if (!Array.isArray(parsed) || parsed.some(item => typeof item !== "string")) throw new Error("Images and collaborators must be JSON arrays of strings."); return parsed; }
  return value.split(/\n|\|/).map(item => item.trim()).filter(Boolean);
}
export async function readSheetBOD(includeInactive = false): Promise<BODMember[]> {
  const { records } = await read("bod");
  return sortBoard(records.map(({ value: row }) => ({ id: row.id, name: row.name, role: row.role, category: row.category === "Executive" ? "Executive" as const : "Director" as const, bio: row.bio || "", image: row.image || undefined, quote: row.quote, email: row.email, instagram: row.instagram, linkedin: row.linkedin, displayOrder: Number(row.displayorder) || 0, isActive: yes(row.isactive) })).filter(member => includeInactive || member.isActive));
}
export async function readSheetProjects(includeUnpublished = false): Promise<ProjectItem[]> {
  const { records } = await read("projects");
  return records.map(({ value: row }) => ({ id: row.id, title: row.title, slug: row.slug || row.id, category: row.category, date: row.date || undefined, time: row.time, venue: row.venue, platform: row.platform, shortDescription: row.shortdescription, description: row.shortdescription, fullDescription: row.fulldescription, objective: row.objective, coverImage: row.coverimage, image: row.coverimage, images: array(row.images), collaborators: array(row.collaborators), participants: row.participants ? Number(row.participants) : undefined, beneficiaries: row.beneficiaries ? Number(row.beneficiaries) : undefined, volunteers: row.volunteers ? Number(row.volunteers) : undefined, featured: yes(row.featured, false), published: yes(row.published) })).filter(project => includeUnpublished || project.published);
}
export async function writeSheetRecord(module: Module, action: "create" | "update" | "delete", value: Record<string, unknown>, id?: string) {
  clearDataCache();
  const { config, headers, records } = await read(module);
  const sheets = google.sheets({ version: "v4", auth: googleAuth(["https://www.googleapis.com/auth/spreadsheets"]) });
  const target = records.find(record => record.value.id === id);
  if (action !== "create" && !target) throw new Error("The selected sheet record no longer exists.");
  if (action === "delete") {
    const { data } = await sheets.spreadsheets.get({ spreadsheetId: config.spreadsheetId, fields: "sheets.properties" }, { timeout: 15000 });
    const sheetId = data.sheets?.find(sheet => sheet.properties?.title === config.tab)?.properties?.sheetId;
    if (sheetId == null) throw new Error("Sheet tab not found.");
    await sheets.spreadsheets.batchUpdate({ spreadsheetId: config.spreadsheetId, requestBody: { requests: [{ deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: target!.row - 1, endIndex: target!.row } } }] } }, { timeout: 15000 });
    clearDataCache(); return id!;
  }
  const recordId = id || crypto.randomUUID();
  const payload = { ...value, id: recordId };
  const requiredHeaders = fields[module].filter(field => Object.hasOwn(payload, field));
  const allHeaders = [...headers, ...requiredHeaders.filter(field => !headers.some(header => normalizeHeader(header) === normalizeHeader(field)))];
  if (allHeaders.length !== headers.length) await sheets.spreadsheets.values.update({ spreadsheetId: config.spreadsheetId, range: `${config.range}!A1`, valueInputOption: "RAW", requestBody: { values: [allHeaders] } }, { timeout: 15000 });
  const normalized = Object.fromEntries(Object.entries(payload).map(([key, entry]) => [normalizeHeader(key), entry]));
  const values = allHeaders.map(header => {
    const key = normalizeHeader(header);
    if (!Object.hasOwn(normalized, key)) return target?.value[key] || "";
    const entry = normalized[key]; return Array.isArray(entry) ? JSON.stringify(entry) : entry == null ? "" : String(entry);
  });
  if (action === "create") await sheets.spreadsheets.values.append({ spreadsheetId: config.spreadsheetId, range: `${config.range}!A:ZZ`, valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: [values] } }, { timeout: 15000 });
  else await sheets.spreadsheets.values.update({ spreadsheetId: config.spreadsheetId, range: `${config.range}!A${target!.row}`, valueInputOption: "RAW", requestBody: { values: [values] } }, { timeout: 15000 });
  clearDataCache(); return recordId;
}
