import "server-only";
import { CMSStore } from "./cms-store";
import { getSheetRowCount, type SheetCounterResult } from "@/lib/google-sheets-service";

export interface CounterData {
  members: number | null;
  projects: number | null;
  bod: number | null;
  isLive: {
    members: boolean;
    projects: boolean;
    bod: boolean;
  };
  diagnostics: {
    members: SheetCounterResult;
    projects: SheetCounterResult;
    bod: SheetCounterResult;
  };
  lastUpdated: string;
}

/** Counters use the same authoritative records as the public lists. */
export async function getLiveImpactCounters(): Promise<CounterData> {
  const fromCMS = async (read: () => Promise<unknown[]>): Promise<SheetCounterResult> => {
    try { return { count: (await read()).length, isLive: true, source: "CMS", status: "CONNECTED" }; }
    catch { return { count: null, isLive: false, source: "UNAVAILABLE", status: "NOT_CONFIGURED", errorMessage: "Configure Supabase and apply supabase/schema.sql. BOD and project counters use their published CMS lists." }; }
  };
  const [members, projects, bod] = await Promise.all([
    getSheetRowCount(process.env.GOOGLE_SHEETS_MEMBERSHIP_ID, process.env.GOOGLE_SHEETS_MEMBERSHIP_TAB),
    fromCMS(() => CMSStore.getProjects()), fromCMS(() => CMSStore.getBODMembers()),
  ]);
  return { members: members.count, projects: projects.count, bod: bod.count, isLive: { members: members.isLive, projects: projects.isLive, bod: bod.isLive }, diagnostics: { members, projects, bod }, lastUpdated: new Date().toISOString() };
}
