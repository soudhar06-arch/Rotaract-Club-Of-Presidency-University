import { validateCMSPayload } from "@/lib/cms-validation";
import { sameOrigin } from "@/lib/request-security";
import { clearDataCache } from "@/lib/server-cache";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { CMSConfigurationError, CMSStore, type Role } from "@/lib/cms-store";
import { getServerSession, type SessionPayload } from "@/lib/auth-config";

type ContentModule = "bod" | "projects" | "events" | "faq" | "gallery";

function errorResponse(error: unknown) {
  const configured = !(error instanceof CMSConfigurationError);
  const message = error instanceof Error ? error.message : "CMS request failed";
  return NextResponse.json({ success: false, configured, error: message }, { status: configured ? 500 : 503 });
}

async function requireSession() {
  const session = await getServerSession();
  if (!session) return null;
  return session;
}

function canManageContent(session: SessionPayload) {
  return session.role === "OWNER" || session.role === "ADMIN" || session.role === "EDITOR";
}

function canManageAccess(session: SessionPayload) {
  return session.role === "OWNER";
}

function actor(session: SessionPayload) {
  // Environment-backed admin credentials are not a Supabase auth user, so
  // keep the audit actor nullable rather than violating audit_logs.user_id.
  return { email: session.email || session.username };
}

function revalidatePublicContent() {
  clearDataCache();
  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath("/events");
  revalidatePath("/gallery");
  revalidatePath("/board");
  revalidatePath("/faq");
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const moduleName = searchParams.get("module") || "dashboard";

  try {
    switch (moduleName) {
      case "bod":
        return NextResponse.json({ success: true, data: await CMSStore.getBODMembers(true) });
      case "projects":
        return NextResponse.json({ success: true, data: await CMSStore.getProjects(true) });
      case "events":
        return NextResponse.json({ success: true, data: await CMSStore.getEvents(true) });
      case "faq":
        return NextResponse.json({ success: true, data: await CMSStore.getFAQs(true) });
      case "gallery":
        return NextResponse.json({ success: true, data: await CMSStore.getGallery() });
      case "users":
        if (!canManageAccess(session)) return NextResponse.json({ success: false, error: "Insufficient role" }, { status: 403 });
        return NextResponse.json({ success: true, data: await CMSStore.getUsers() });
      case "audit":
        if (!canManageAccess(session)) return NextResponse.json({ success: false, error: "Insufficient role" }, { status: 403 });
        return NextResponse.json({ success: true, data: await CMSStore.getAuditLogs() });
      case "config":
        return NextResponse.json({ success: true, data: await CMSStore.getConfig() });
      default: {
        const [bod, projects, events, faq, gallery, users, recentLogs] = await Promise.all([
          CMSStore.getBODMembers(true),
          CMSStore.getProjects(true),
          CMSStore.getEvents(true),
          CMSStore.getFAQs(true),
          CMSStore.getGallery(),
          canManageAccess(session) ? CMSStore.getUsers() : Promise.resolve([]),
          canManageAccess(session) ? CMSStore.getAuditLogs() : Promise.resolve([]),
        ]);
        return NextResponse.json({
          success: true,
          data: {
            bodCount: bod.length,
            projectsCount: projects.length,
            eventsCount: events.length,
            faqCount: faq.length,
            galleryCount: gallery.length,
            usersCount: users.length,
            recentLogs: recentLogs.slice(0, 5),
          },
        });
      }
    }
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  const session = await requireSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });

  try {
    const body = (await req.json()) as { action?: string; module?: string; payload?: Record<string, unknown> };
    const moduleName = body.module;
    const action = body.action;
    let payload = body.payload;
    if (!moduleName || !action || !payload) return NextResponse.json({ success: false, error: "module, action, and payload are required" }, { status: 400 });

    if (moduleName === "users") {
      if (!canManageAccess(session)) return NextResponse.json({ success: false, error: "Insufficient role" }, { status: 403 });
      if (action !== "update_role" || typeof payload.userId !== "string" || typeof payload.newRole !== "string") return NextResponse.json({ success: false, error: "Invalid user role update" }, { status: 400 });
      if (!(["OWNER", "ADMIN", "EDITOR", "VIEWER"] as Role[]).includes(payload.newRole as Role)) return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
      await CMSStore.updateUserRole(payload.userId, payload.newRole as Role, actor(session));
      return NextResponse.json({ success: true });
    }

    if (moduleName !== "users") {
      try { payload = validateCMSPayload(moduleName, action, payload); }
      catch (error) { return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Invalid content" }, { status: 400 }); }
    }
    if (session.role === "EDITOR" && (!["events", "gallery"].includes(moduleName) || action === "delete" || payload.published === true)) return NextResponse.json({ success: false, error: "Editors may save event drafts and add gallery media. Publishing and deleting require an administrator." }, { status: 403 });
    if (session.role === "EDITOR" && moduleName === "events") payload.published = false;

    if (moduleName === "config") {
      if (!canManageAccess(session)) return NextResponse.json({ success: false, error: "Insufficient role" }, { status: 403 });
      if (action !== "update") return NextResponse.json({ success: false, error: "Unsupported config action" }, { status: 400 });
      const data = await CMSStore.updateConfig(payload, actor(session));
      revalidatePublicContent();
      return NextResponse.json({ success: true, data });
    }

    if (!(["bod", "projects", "events", "faq", "gallery"] as ContentModule[]).includes(moduleName as ContentModule)) return NextResponse.json({ success: false, error: "Unsupported CMS module" }, { status: 400 });
    if (!canManageContent(session)) return NextResponse.json({ success: false, error: "Insufficient role" }, { status: 403 });

    let data: unknown;
    const id = typeof payload.id === "string" ? payload.id : "";
    if (moduleName === "bod") {
      if (action === "create") data = await CMSStore.addBODMember(payload as never, actor(session));
      else if (action === "update" && id) data = await CMSStore.updateBODMember(id, payload, actor(session));
      else if (action === "delete" && id) await CMSStore.deleteBODMember(id, actor(session));
      else return NextResponse.json({ success: false, error: "Invalid BOD action" }, { status: 400 });
    } else if (moduleName === "projects") {
      if (action === "create") data = await CMSStore.addProject(payload as never, actor(session));
      else if (action === "update" && id) data = await CMSStore.updateProject(id, payload, actor(session));
      else if (action === "delete" && id) await CMSStore.deleteProject(id, actor(session));
      else return NextResponse.json({ success: false, error: "Invalid project action" }, { status: 400 });
    } else if (moduleName === "events") {
      if (action === "create") data = await CMSStore.addEvent(payload as never, actor(session));
      else if (action === "update" && id) data = await CMSStore.updateEvent(id, payload, actor(session));
      else if (action === "delete" && id) await CMSStore.deleteEvent(id, actor(session));
      else return NextResponse.json({ success: false, error: "Invalid event action" }, { status: 400 });
    } else if (moduleName === "faq") {
      if (action === "create") data = await CMSStore.addFAQ(payload as never, actor(session));
      else if (action === "update" && id) data = await CMSStore.updateFAQ(id, payload, actor(session));
      else if (action === "delete" && id) await CMSStore.deleteFAQ(id, actor(session));
      else return NextResponse.json({ success: false, error: "Invalid FAQ action" }, { status: 400 });
    } else {
      if (action === "create") data = await CMSStore.addMedia(payload as never, actor(session));
      else if (action === "delete" && id) await CMSStore.deleteMedia(id, actor(session));
      else return NextResponse.json({ success: false, error: "Invalid media action" }, { status: 400 });
    }

    revalidatePublicContent();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
