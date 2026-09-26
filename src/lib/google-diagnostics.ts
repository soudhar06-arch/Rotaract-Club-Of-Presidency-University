import "server-only";
import { getSheetRowCount } from "./google-sheets-service";
import { listDriveChildren } from "./google-drive-service";
import { configuredValue, googleResourceId } from "./google-auth";
import { getCalendarFeed } from "./calendar-service";
import { aiConfiguration } from "./ai-service";
import { CMSStore, getCMSClient } from "./cms-store";

export interface DiagnosticItem {
  name: string;
  type: "SHEETS" | "DRIVE" | "CALENDAR" | "AI" | "DATABASE" | "STORAGE" | "EMAIL";
  id?: string;
  status: "CONNECTED" | "NOT_CONFIGURED" | "AUTHENTICATION_FAILED" | "PERMISSION_DENIED" | "RESOURCE_NOT_FOUND" | "API_ERROR" | "ERROR";
  message: string;
  actionableStep?: string;
}
export interface GoogleDiagnosticsReport {
  serviceAccountEmail: string | null;
  serviceAccountConfigured: boolean;
  sheets: DiagnosticItem[];
  drive: DiagnosticItem[];
  services: DiagnosticItem[];
  timestamp: string;
}
function failure(name: string, type: DiagnosticItem["type"], error: unknown): DiagnosticItem {
  const message = error instanceof Error ? error.message : "Request failed.";
  const status = /placeholder|configure|Set valid/.test(message) ? "NOT_CONFIGURED" : /401|auth|credential|invalid_grant/i.test(message) ? "AUTHENTICATION_FAILED" : /403|permission/i.test(message) ? "PERMISSION_DENIED" : /404|not found/i.test(message) ? "RESOURCE_NOT_FOUND" : "API_ERROR";
  return { name, type, status, message };
}
async function sheet(name: string, id: string | undefined, tab: string | undefined): Promise<DiagnosticItem> {
  const result = await getSheetRowCount(id, tab);
  return { name, type: "SHEETS", id: googleResourceId(id), status: result.status, message: result.isLive ? `Read ${result.count} data rows from tab ${tab || "first tab"}.` : result.errorMessage || "Sheet unavailable.", actionableStep: "Verify the sheet ID and exact tab name; enable Google Sheets API; share the sheet with GOOGLE_SERVICE_ACCOUNT_EMAIL as Viewer." };
}
async function drive(name: string, variable: string, value?: string): Promise<DiagnosticItem> {
  const id = googleResourceId(value);
  if (!id) return { name, type: "DRIVE", status: "NOT_CONFIGURED", message: `Set ${variable} to a real folder ID.` };
  try { const children = await listDriveChildren(id); return { name, type: "DRIVE", id, status: "CONNECTED", message: `Listed ${children.length} child entries. Read access verified; upload permission is checked when uploading.` }; }
  catch (error) { return { ...failure(name, "DRIVE", error), actionableStep: "Enable Drive API and share this folder with the service account. Uploads require Content manager access to a Shared Drive." }; }
}
async function database(): Promise<DiagnosticItem> {
  if (!CMSStore.isConfigured()) return { name: "Supabase database", type: "DATABASE", status: "NOT_CONFIGURED", message: "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/schema.sql." };
  try {
    const client = getCMSClient();
    for (const table of ["bod_members", "projects", "historical_events", "media_assets", "faqs", "profiles", "audit_logs", "site_settings", "content_documents", "event_descriptions"]) {
      const { error } = await client.from(table).select("*", { head: true, count: "exact" });
      if (error) throw new Error(`${table}: ${error.message}`);
    }
    return { name: "Supabase database", type: "DATABASE", status: "CONNECTED", message: "All required CMS tables are readable. Write persistence is verified by saving content." };
  } catch (error) { return failure("Supabase database", "DATABASE", error); }
}
async function storage(): Promise<DiagnosticItem> {
  if (!CMSStore.isConfigured()) return { name: "Supabase storage", type: "STORAGE", status: "NOT_CONFIGURED", message: "Configure Supabase, or use the Google Drive upload folders." };
  try {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "club-media";
    const { data, error } = await getCMSClient().storage.getBucket(bucket);
    if (error) throw new Error(error.message);
    if (!data.public) throw new Error(`Bucket ${bucket} must be public for website photos.`);
    return { name: "Supabase storage", type: "STORAGE", status: "CONNECTED", message: `Public ${bucket} bucket verified. Upload a photo to verify write access.` };
  } catch (error) { return failure("Supabase storage", "STORAGE", error); }
}
async function ai(): Promise<DiagnosticItem> {
  const { apiKey, model } = aiConfiguration();
  if (!apiKey || !model) return { name: "Leviathan Bot / event AI", type: "AI", status: "NOT_CONFIGURED", message: "Set OPENAI_API_KEY and OPENAI_MODEL. Both features share this provider." };
  try {
    const response = await fetch(`https://api.openai.com/v1/models/${encodeURIComponent(model)}`, { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`AI model check returned ${response.status}.`);
    return { name: "Leviathan Bot / event AI", type: "AI", status: "CONNECTED", message: `Model access verified for ${model}. No generation request was made by diagnostics.` };
  } catch (error) { return failure("Leviathan Bot / event AI", "AI", error); }
}
async function email(): Promise<DiagnosticItem> {
  const apiKey = configuredValue(process.env.RESEND_API_KEY);
  if (!apiKey || !process.env.CLUB_APPLICATION_EMAIL || !process.env.RESEND_FROM_EMAIL) return { name: "Resend email", type: "EMAIL", status: "NOT_CONFIGURED", message: "Set RESEND_API_KEY, RESEND_FROM_EMAIL and CLUB_APPLICATION_EMAIL. Sender must use a verified Resend domain." };
  try {
    const response = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Resend domain check returned ${response.status}. A send-only key cannot run this read check; delivery has not been tested.`);
    const data = await response.json();
    const address = process.env.RESEND_FROM_EMAIL.match(/<([^>]+)>/)?.[1] || process.env.RESEND_FROM_EMAIL;
    const domain = address.split("@")[1];
    if (!data.data?.some((item: { name: string; status: string }) => item.name === domain && item.status === "verified")) throw new Error("The sender domain is not verified in Resend.");
    return { name: "Resend email", type: "EMAIL", status: "CONNECTED", message: "API authentication and sender domain verified. No email was sent; delivery is not yet verified." };
  } catch (error) { return failure("Resend email", "EMAIL", error); }
}
export async function runGoogleDiagnostics(): Promise<GoogleDiagnosticsReport> {
  const [sheets, folders, calendar, db, media, model, mail] = await Promise.all([
    Promise.all([sheet("Membership responses", process.env.GOOGLE_SHEETS_MEMBERSHIP_ID, process.env.GOOGLE_SHEETS_MEMBERSHIP_TAB), sheet("Projects source (optional import)", process.env.GOOGLE_SHEETS_PROJECTS_ID, process.env.GOOGLE_SHEETS_PROJECTS_TAB), sheet("BOD source (optional import)", process.env.GOOGLE_SHEETS_BOD_ID, process.env.GOOGLE_SHEETS_BOD_TAB)]),
    Promise.all([drive("Event archive", "GOOGLE_DRIVE_ROOT_FOLDER_ID", process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID), drive("Projects uploads", "GOOGLE_DRIVE_PROJECTS_FOLDER_ID", process.env.GOOGLE_DRIVE_PROJECTS_FOLDER_ID), drive("Gallery uploads", "GOOGLE_DRIVE_GALLERY_FOLDER_ID", process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID), drive("BOD uploads", "GOOGLE_DRIVE_BOD_FOLDER_ID", process.env.GOOGLE_DRIVE_BOD_FOLDER_ID)]),
    getCalendarFeed(), database(), storage(), ai(), email(),
  ]);
  const diagnostic = calendar.diagnostics;
  return { serviceAccountEmail: configuredValue(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) || null, serviceAccountConfigured: Boolean(configuredValue(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) && configuredValue(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)), sheets, drive: folders,
    services: [{ name: "Google Calendar", type: "CALENDAR", status: diagnostic.status === "MISSING_CONFIG" ? "NOT_CONFIGURED" : diagnostic.status === "API_ERROR" ? diagnostic.statusCode === 403 ? "PERMISSION_DENIED" : "API_ERROR" : "CONNECTED", message: diagnostic.message }, db, media, model, mail], timestamp: new Date().toISOString() };
}
