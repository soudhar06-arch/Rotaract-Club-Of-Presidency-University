import "server-only";
import { cached } from "./server-cache";
import { configuredValue, googleResourceId } from "./google-auth";
import { google } from "googleapis";

export interface SheetCounterResult {
  count: number | null;
  isLive: boolean;
  source: "SERVICE_ACCOUNT" | "PUBLIC_CSV" | "CMS" | "UNAVAILABLE";
  status: "CONNECTED" | "NOT_CONFIGURED" | "AUTHENTICATION_FAILED" | "PERMISSION_DENIED" | "RESOURCE_NOT_FOUND" | "API_ERROR";
  errorMessage?: string;
}

function getGoogleAuthClient() {
  const email = configuredValue(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const rawKey = configuredValue(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
  if (!email || !rawKey) return null;
  return new google.auth.JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

function countDataRows(rows: string[][] | undefined): number {
  if (!rows?.length) return 0;
  return rows.slice(1).filter((row) => row.some((cell) => String(cell ?? "").trim())).length;
}

function statusFromError(error: unknown): SheetCounterResult["status"] {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (message.includes("403") || message.includes("permission")) return "PERMISSION_DENIED";
  if (message.includes("404") || message.includes("not found")) return "RESOURCE_NOT_FOUND";
  if (message.includes("auth") || message.includes("credential")) return "AUTHENTICATION_FAILED";
  return "API_ERROR";
}

/**
 * Counts real data rows only. There are no production content fallbacks: an
 * unavailable source is reported as unavailable so the UI can render an
 * honest empty state and the admin diagnostics can explain why.
 */
export async function getSheetRowCount(spreadsheetId?: string, tabName?: string): Promise<SheetCounterResult> {
  const sheetId = googleResourceId(spreadsheetId);
  if (!sheetId) {
    return { count: null, isLive: false, source: "UNAVAILABLE", status: "NOT_CONFIGURED", errorMessage: "Configure the spreadsheet ID and tab name." };
  }

  const auth = getGoogleAuthClient();
  if (!auth) {
    return { count: null, isLive: false, source: "UNAVAILABLE", status: "AUTHENTICATION_FAILED", errorMessage: "Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY." };
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const range = tabName?.trim() ? `'${tabName.trim().replace(/'/g, "''")}'!A:ZZ` : "A:ZZ";
    const { data } = await cached(`sheet:${sheetId}:${range}`, 60000, () => sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range }, { timeout: 15000 }));
    return { count: countDataRows(data.values as string[][] | undefined), isLive: true, source: "SERVICE_ACCOUNT", status: "CONNECTED" };
  } catch (error) {
    return {
      count: null,
      isLive: false,
      source: "UNAVAILABLE",
      status: statusFromError(error),
      errorMessage: error instanceof Error ? error.message : "Google Sheets request failed.",
    };
  }
}

export async function getLiveGoogleCounters() {
  const [membership, projects, bod] = await Promise.all([
    getSheetRowCount(process.env.GOOGLE_SHEETS_MEMBERSHIP_ID, process.env.GOOGLE_SHEETS_MEMBERSHIP_TAB),
    getSheetRowCount(process.env.GOOGLE_SHEETS_PROJECTS_ID, process.env.GOOGLE_SHEETS_PROJECTS_TAB),
    getSheetRowCount(process.env.GOOGLE_SHEETS_BOD_ID, process.env.GOOGLE_SHEETS_BOD_TAB),
  ]);

  return { membership, projects, bod, lastUpdated: new Date().toISOString() };
}
