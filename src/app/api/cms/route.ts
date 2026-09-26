import { NextResponse } from "next/server";
import { CMSConfigurationError, CMSStore } from "@/lib/cms-store";
import { getPublicGallery } from "@/lib/gallery-service";
import { readPublicCollection } from "@/lib/public-content";
import { getEventFeed } from "@/lib/event-service";
import { getDriveBoard, getDriveProjects } from "@/lib/google-drive-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const moduleName = searchParams.get("module") || "all";

  try {
    switch (moduleName) {
      case "bod":
        try { return NextResponse.json({ success: true, data: await CMSStore.getBODMembers() }); }
        catch { return NextResponse.json({ success: true, data: await getDriveBoard() }); }
      case "projects":
        try { return NextResponse.json({ success: true, data: await CMSStore.getProjects() }); }
        catch { return NextResponse.json({ success: true, data: await getDriveProjects() }); }
      case "events":
        return NextResponse.json({ success: true, data: (await getEventFeed()).events });
      case "faq":
        return NextResponse.json({ success: true, data: await CMSStore.getFAQs() });
      case "gallery":
        return NextResponse.json({ success: true, data: await getPublicGallery() });
      case "config":
        return NextResponse.json({ success: true, data: await CMSStore.getConfig() });
      case "partners":
      case "awards":
      case "testimonials":
      case "timeline":
      case "avenues":
        return NextResponse.json({ success: true, data: await readPublicCollection(moduleName) });
      default: {
        const [bod, projects, events, faq, gallery, config] = await Promise.all([
          CMSStore.getBODMembers(),
          CMSStore.getProjects(),
          CMSStore.getEvents(),
          CMSStore.getFAQs(),
          CMSStore.getGallery(),
          CMSStore.getConfig(),
        ]);
        return NextResponse.json({ success: true, data: { bod, projects, events, faq, gallery, config } });
      }
    }
  } catch (error) {
    const configured = !(error instanceof CMSConfigurationError);
    return NextResponse.json({ success: false, configured, error: "Content is temporarily unavailable." }, { status: configured ? 500 : 503 });
  }
}
