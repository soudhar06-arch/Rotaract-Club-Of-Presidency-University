import { NextResponse } from "next/server";
import { CMSStore, Role } from "@/lib/cms-store";
import { getServerSession } from "@/lib/auth-config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const moduleName = searchParams.get("module") || "dashboard";

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
      case "users":
        return NextResponse.json({ success: true, data: CMSStore.getUsers() });
      case "audit":
        return NextResponse.json({ success: true, data: CMSStore.getAuditLogs() });
      case "config":
        return NextResponse.json({ success: true, data: CMSStore.getConfig() });
      default:
        return NextResponse.json({
          success: true,
          data: {
            bodCount: CMSStore.getBODMembers().length,
            projectsCount: CMSStore.getProjects().length,
            eventsCount: CMSStore.getEvents().length,
            faqCount: CMSStore.getFAQs().length,
            galleryCount: CMSStore.getGallery().length,
            usersCount: CMSStore.getUsers().length,
            recentLogs: CMSStore.getAuditLogs().slice(0, 5),
          },
        });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Admin API error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { action, module: moduleName, payload } = body;

    // BOD Handler
    if (moduleName === "bod") {
      if (action === "create") {
        const item = CMSStore.addBODMember(payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "update") {
        const item = CMSStore.updateBODMember(payload.id, payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "delete") {
        const success = CMSStore.deleteBODMember(payload.id);
        return NextResponse.json({ success });
      }
    }

    // Projects Handler
    if (moduleName === "projects") {
      if (action === "create") {
        const item = CMSStore.addProject(payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "update") {
        const item = CMSStore.updateProject(payload.id, payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "delete") {
        const success = CMSStore.deleteProject(payload.id);
        return NextResponse.json({ success });
      }
    }

    // Historical Events Handler
    if (moduleName === "events") {
      if (action === "create") {
        const item = CMSStore.addEvent(payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "update") {
        const item = CMSStore.updateEvent(payload.id, payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "delete") {
        const success = CMSStore.deleteEvent(payload.id);
        return NextResponse.json({ success });
      }
    }

    // FAQ Handler
    if (moduleName === "faq") {
      if (action === "create") {
        const item = CMSStore.addFAQ(payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "update") {
        const item = CMSStore.updateFAQ(payload.id, payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "delete") {
        const success = CMSStore.deleteFAQ(payload.id);
        return NextResponse.json({ success });
      }
    }

    // Gallery / Media Handler
    if (moduleName === "gallery") {
      if (action === "create") {
        const item = CMSStore.addMedia(payload);
        return NextResponse.json({ success: true, data: item });
      }
      if (action === "delete") {
        const success = CMSStore.deleteMedia(payload.id);
        return NextResponse.json({ success });
      }
    }

    // Users Handler
    if (moduleName === "users") {
      if (action === "update_role") {
        CMSStore.updateUserRole(payload.userId, payload.newRole as Role);
        return NextResponse.json({ success: true });
      }
    }

    // Config Handler
    if (moduleName === "config") {
      const updated = CMSStore.updateConfig(payload);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action or module" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Mutation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
