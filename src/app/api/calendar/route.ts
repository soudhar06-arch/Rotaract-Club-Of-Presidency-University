import { getCalendarFeed } from "@/lib/calendar-service";
export const dynamic = "force-dynamic";
export async function GET() {
  const result = await getCalendarFeed();
  return Response.json({ ...result, diagnostics: { ...result.diagnostics, message: ["OK", "EMPTY_CALENDAR"].includes(result.diagnostics.status) ? result.diagnostics.message : "Events are temporarily unavailable." } });
}
