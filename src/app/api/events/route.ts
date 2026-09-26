import { getEventFeed } from "@/lib/event-service";
export const dynamic = "force-dynamic";
export async function GET() {
  const feed = await getEventFeed();
  return Response.json({ events: feed.events, diagnostics: { ...feed.diagnostics, message: feed.errors.length ? "Events are temporarily unavailable." : feed.diagnostics.message }, partial: feed.errors.length > 0 }, { headers: { "Cache-Control": "no-store" } });
}
