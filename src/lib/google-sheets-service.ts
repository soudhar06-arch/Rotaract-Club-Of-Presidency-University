import { google } from "googleapis";
import { CMSStore } from "@/lib/cms-store";

export interface SheetCounterResult {
  count: number;
  isLive: boolean;
  source: "SERVICE_ACCOUNT" | "PUBLIC_CSV" | "FALLBACK";
  status: "CONNECTED" | "NOT_CONFIGURED" | "AUTHENTICATION_FAILED" | "PERMISSION_DENIED" | "RESOURCE_NOT_FOUND" | "ERROR";
  errorMessage?: string;
}

// Service Account JWT Client
function getGoogleAuthClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Handle escaped newline characters in private key string
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    return new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  } catch (err) {
    console.error("[Google Auth Error]:", err);
    return null;
  }
}

/**
 * Filter out header rows, blank rows, and placeholder entries.
 */
function filterValidSheetRows(rows: string[][]): string[][] {
  if (!rows || rows.length <= 1) return [];
  const dataRows = rows.slice(1);

  return dataRows.filter((row) => {
    const hasContent = row.some((cell) => cell && cell.trim().length > 0);
    const textContent = row.join(" ").toLowerCase();
    const isPlaceholder = textContent.includes("blank") || textContent.includes("empty placeholder");
    return hasContent && !isPlaceholder;
  });
}

/**
 * Count rows from Google Sheet using Service Account API with CSV fallback.
 */
export async function getSheetRowCount(
  spreadsheetId?: string,
  tabName?: string
): Promise<SheetCounterResult> {
  const sheetId = spreadsheetId?.trim();
  if (!sheetId) {
    return {
      count: 0,
      isLive: false,
      source: "FALLBACK",
      status: "NOT_CONFIGURED",
      errorMessage: "Sheet ID is not configured in environment variables.",
    };
  }

  // 1. Try Service Account Google Sheets API
  const auth = getGoogleAuthClient();
  if (auth) {
    try {
      const sheets = google.sheets({ version: "v4", auth });
      const range = tabName ? `'${tabName}'!A:Z` : "A:Z";

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
      });

      const rows = res.data.values as string[][] | undefined;
      const validRows = filterValidSheetRows(rows || []);

      return {
        count: validRows.length,
        isLive: true,
        source: "SERVICE_ACCOUNT",
        status: "CONNECTED",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Google Sheets API Warning for ${sheetId}]:`, msg);
      // Fallback to public CSV export below
    }
  }

  // 2. Try Public CSV Export URL
  try {
    const csvUrl = sheetId.includes("docs.google.com")
      ? sheetId
      : `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${tabName ? `&sheet=${encodeURIComponent(tabName)}` : ""}`;

    const res = await fetch(csvUrl, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "RCPU-Website-Sheets/1.0" },
    });

    if (res.ok) {
      const text = await res.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const rows = lines.map((l) => l.split(",").map((c) => c.replace(/^"|"$/g, "").trim()));
      const validRows = filterValidSheetRows(rows);

      return {
        count: validRows.length,
        isLive: true,
        source: "PUBLIC_CSV",
        status: "CONNECTED",
      };
    }
  } catch {
    // CSV fallback failed
  }

  return {
    count: 0,
    isLive: false,
    source: "FALLBACK",
    status: "PERMISSION_DENIED",
    errorMessage: "Could not access Google Sheet. Please share sheet with service account email.",
  };
}

/**
 * Fetch live counts for Membership, Projects, and BOD sheets.
 */
export async function getLiveGoogleCounters() {
  const memSheet = process.env.GOOGLE_SHEETS_MEMBERSHIP_ID || process.env.GOOGLE_SHEET_MEMBERS_URL;
  const projSheet = process.env.GOOGLE_SHEETS_PROJECTS_ID || process.env.GOOGLE_SHEET_PROJECTS_URL;
  const bodSheet = process.env.GOOGLE_SHEETS_BOD_ID || process.env.GOOGLE_SHEET_BOD_URL;

  const [membershipRes, projectsRes, bodRes] = await Promise.all([
    getSheetRowCount(memSheet, process.env.GOOGLE_SHEETS_MEMBERSHIP_TAB),
    getSheetRowCount(projSheet, process.env.GOOGLE_SHEETS_PROJECTS_TAB),
    getSheetRowCount(bodSheet, process.env.GOOGLE_SHEETS_BOD_TAB),
  ]);

  const fallbackBOD = CMSStore.getBODMembers().length;
  const fallbackProjects = CMSStore.getProjects().length;
  const fallbackMembers = 350;

  return {
    membership: {
      count: membershipRes.isLive ? membershipRes.count : fallbackMembers,
      details: membershipRes,
    },
    projects: {
      count: projectsRes.isLive ? projectsRes.count : fallbackProjects,
      details: projectsRes,
    },
    bod: {
      count: bodRes.isLive ? bodRes.count : fallbackBOD,
      details: bodRes,
    },
    lastUpdated: new Date().toISOString(),
  };
}
