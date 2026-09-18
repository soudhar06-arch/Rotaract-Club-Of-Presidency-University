import { CMSStore } from "@/lib/cms-store";

export interface CounterData {
  members: number;
  projects: number;
  bod: number;
  isLive: {
    members: boolean;
    projects: boolean;
    bod: boolean;
  };
  lastUpdated: string;
}

/**
 * Utility to parse CSV text into rows of columns.
 */
function parseCsvRows(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/);
  const rows: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split(",").map((col) => col.trim().replace(/^"|"$/g, ""));
    rows.push(cols);
  }

  return rows;
}

/**
 * Filter out header rows, blank rows, and malformed rows.
 */
function filterValidRows(rows: string[][]): string[][] {
  if (rows.length === 0) return [];
  const dataRows = rows.slice(1);

  return dataRows.filter((row) => {
    const hasData = row.some((cell) => cell.trim().length > 0);
    const isPlaceholder =
      row.join(" ").toLowerCase().includes("blank") ||
      row.join(" ").toLowerCase().includes("empty");
    return hasData && !isPlaceholder;
  });
}

/**
 * Fetches row count from a public Google Sheet.
 */
async function fetchSheetRowCount(sheetUrlOrId: string | undefined): Promise<{ count: number; isLive: boolean }> {
  if (!sheetUrlOrId || !sheetUrlOrId.trim()) {
    return { count: 0, isLive: false };
  }

  try {
    let fetchUrl = sheetUrlOrId.trim();

    if (fetchUrl.includes("docs.google.com/spreadsheets/d/")) {
      const match = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const sheetId = match[1];
        fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      }
    } else if (!fetchUrl.startsWith("http")) {
      fetchUrl = `https://docs.google.com/spreadsheets/d/${fetchUrl}/export?format=csv`;
    }

    const response = await fetch(fetchUrl, {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "RCPU-Website-Counter/1.0",
      },
    });

    if (!response.ok) {
      return { count: 0, isLive: false };
    }

    const csvText = await response.text();
    const parsedRows = parseCsvRows(csvText);
    const validRows = filterValidRows(parsedRows);

    return { count: validRows.length, isLive: true };
  } catch (error) {
    console.error("[Google Sheets Counter Error]:", error);
    return { count: 0, isLive: false };
  }
}

/**
 * Centralized service to get live impact counters across all three sources.
 */
export async function getLiveImpactCounters(): Promise<CounterData> {
  const config = CMSStore.getConfig();

  const membersSheetSource =
    config.googleSheetsMembersUrl ||
    process.env.GOOGLE_SHEET_MEMBERS_URL ||
    process.env.NEXT_PUBLIC_MEMBERSHIP_FORM_SHEET_URL;

  const projectsSheetSource =
    config.googleSheetsProjectsUrl ||
    process.env.GOOGLE_SHEET_PROJECTS_URL;

  const bodSheetSource =
    config.googleSheetsBodUrl ||
    process.env.GOOGLE_SHEET_BOD_URL;

  const [membersRes, projectsRes, bodRes] = await Promise.all([
    fetchSheetRowCount(membersSheetSource),
    fetchSheetRowCount(projectsSheetSource),
    fetchSheetRowCount(bodSheetSource),
  ]);

  const fallbackBODCount = CMSStore.getBODMembers().length;
  const fallbackProjectsCount = CMSStore.getProjects().length;
  const fallbackMembersCount = 350;

  return {
    members: membersRes.isLive ? membersRes.count : fallbackMembersCount,
    projects: projectsRes.isLive ? projectsRes.count : fallbackProjectsCount,
    bod: bodRes.isLive ? bodRes.count : fallbackBODCount,
    isLive: {
      members: membersRes.isLive,
      projects: projectsRes.isLive,
      bod: bodRes.isLive,
    },
    lastUpdated: new Date().toISOString(),
  };
}
