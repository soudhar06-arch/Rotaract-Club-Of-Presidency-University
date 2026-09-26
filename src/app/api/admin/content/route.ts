import { getServerSession } from "@/lib/auth-config";
import { eventDetailsSchema } from "@/lib/event-details";
import { getCMSClient } from "@/lib/cms-store";
import { getEventFeed } from "@/lib/event-service";
import { generateEventDescription } from "@/lib/event-descriptions";
import { clearDataCache } from "@/lib/server-cache";
import { sameOrigin } from "@/lib/request-security";
export async function GET() {
  const session = await getServerSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await getEventFeed());
}
export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!["OWNER", "ADMIN"].includes(session.role) || !sameOrigin(request)) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const body = await request.json();
    if (body.action === "import") {
      if (process.env.EVENT_DETAILS_FILE_PATH) throw new Error("EVENT_DETAILS_FILE_PATH is authoritative. Update that file, or unset the variable before importing a database source.");
      const content = eventDetailsSchema.parse(body.content);
      const { error } = await getCMSClient().from("content_documents").upsert({ id: "event-details", content, updated_at: new Date().toISOString() });
      if (error) throw new Error(error.message);
      clearDataCache();
      return Response.json({ success: true, count: content.length });
    }
    if (body.action === "refresh") { clearDataCache(); return Response.json({ success: true }); }
    if (body.action === "generate") {
      const feed = await getEventFeed();
      const event = feed.events.find((item) => item.id === body.id && item.source !== "calendar");
      if (!event) return Response.json({ success: false, error: "Historical event not found." }, { status: 404 });
      return Response.json({ success: true, data: await generateEventDescription(event, Boolean(body.regenerate)) });
    }
    return Response.json({ success: false, error: "Unsupported action" }, { status: 400 });
  } catch (error) { return Response.json({ success: false, error: error instanceof Error ? error.message : "Content operation failed" }, { status: 400 }); }
}
