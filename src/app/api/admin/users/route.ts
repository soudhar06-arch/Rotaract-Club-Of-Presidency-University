import { z } from "zod";
import { getServerSession } from "@/lib/auth-config";
import { getCMSClient } from "@/lib/cms-store";
import { sameOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (session.role !== "OWNER" || !sameOrigin(request)) return Response.json({ success: false, error: "Owner access required." }, { status: 403 });
  const body = z.discriminatedUnion("action", [
    z.object({ action: z.literal("create"), email: z.string().email(), name: z.string().trim().min(1).max(150), password: z.string().min(12).max(200), role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]) }),
    z.object({ action: z.literal("status"), id: z.string().uuid(), active: z.boolean() }),
    z.object({ action: z.literal("delete"), id: z.string().uuid() }),
  ]).safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ success: false, error: "Invalid account fields. Passwords must have at least 12 characters." }, { status: 400 });
  const client = getCMSClient();
  try {
    const data = body.data; let entityId: string;
    if (data.action === "create") {
      const { data: account, error } = await client.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true, user_metadata: { full_name: data.name } });
      if (error || !account.user) throw new Error(error?.message || "User creation failed.");
      entityId = account.user.id;
      const profile = await client.from("profiles").upsert({ id: entityId, email: data.email, full_name: data.name, role: data.role, is_active: true });
      if (profile.error) { await client.auth.admin.deleteUser(entityId); throw new Error(profile.error.message); }
    } else {
      entityId = data.id;
      if (entityId === session.userId) throw new Error("You cannot disable or delete your own account.");
      const { data: target, error } = await client.from("profiles").select("role").eq("id", entityId).single();
      if (error) throw new Error(error.message);
      if (target.role === "OWNER") throw new Error("Change this owner's role before disabling or deleting the account. The last owner cannot be downgraded.");
      if (data.action === "delete") { const result = await client.auth.admin.deleteUser(entityId); if (result.error) throw new Error(result.error.message); }
      else { const result = await client.from("profiles").update({ is_active: data.active }).eq("id", entityId); if (result.error) throw new Error(result.error.message); }
    }
    const { error } = await client.from("audit_logs").insert({ user_email: session.email || session.username, action: body.data.action.toUpperCase(), entity: "User", entity_id: entityId });
    if (error) throw new Error(`Account changed but audit logging failed: ${error.message}`);
    return Response.json({ success: true });
  } catch (error) { return Response.json({ success: false, error: error instanceof Error ? error.message : "Account operation failed." }, { status: 400 }); }
}
