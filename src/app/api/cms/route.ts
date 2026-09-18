import { NextResponse } from "next/server";
import { CMSStore } from "@/lib/cms-store";

export const revalidate = 0; // Live data endpoint without caching lag

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const moduleName = searchParams.get("module") || "all";

  try {
    switch (moduleName) {
      case "bod":
        return NextResponse.json({ success: true, data: CMSStore.getBODMembers() });
      case "projects":
        return NextResponse.json({ success: true, data: CMSStore.getProjects() });
      case "events":
        return NextResponse.json({ success: true, data: CMSStore.getEvents() });
      case "faq":
        return NextResponse.json({ success: true, data: CMSStore.getFAQs() });
      case "gallery":
        return NextResponse.json({ success: true, data: CMSStore.getGallery() });
      case "config":
        return NextResponse.json({ success: true, data: CMSStore.getConfig() });
      default:
        return NextResponse.json({
          success: true,
          data: {
            bod: CMSStore.getBODMembers(),
            projects: CMSStore.getProjects(),
            events: CMSStore.getEvents(),
            faq: CMSStore.getFAQs(),
            gallery: CMSStore.getGallery(),
            config: CMSStore.getConfig(),
          },
        });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Public CMS API error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
