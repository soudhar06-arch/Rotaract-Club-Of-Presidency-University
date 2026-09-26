import { rateLimited, sameOrigin } from "@/lib/request-security";
import { CMSStore, getCMSClient } from "@/lib/cms-store";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getAdminConfigurationError,
  verifyAdminCredentials,
} from "@/lib/auth-config";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  if (rateLimited(req, "login", 10)) return NextResponse.json({ success: false, error: "Too many login attempts. Try again in a minute." }, { status: 429 });
  try {
    const body = await req.json();
    const { username, password } = body;

    if (typeof username !== "string" || typeof password !== "string" || !username || !password || username.length > 200 || password.length > 200) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Access denied." },
        { status: 401 }
      );
    }

    const configurationError = getAdminConfigurationError();
    if (configurationError) {
      return NextResponse.json(
        { success: false, error: `Admin authentication configuration required: ${configurationError}` },
        { status: 503 },
      );
    }

    let user = verifyAdminCredentials(username, password) ? { userId: "env-admin", username: username.trim(), role: "OWNER" as const, name: "Club Administrator", email: username.includes("@") ? username : "" } : null;
    if (!user && CMSStore.isConfigured()) {
      const client = getCMSClient();
      const result = await client.auth.signInWithPassword({ email: username.trim(), password });
      if (!result.error && result.data.user) {
        const { data: profile } = await getCMSClient().from("profiles").select("*").eq("id", result.data.user.id).eq("is_active", true).single();
        if (profile) user = { userId: profile.id, username: profile.email, role: profile.role, name: profile.full_name, email: profile.email };
      }
    }
    if (!user) return NextResponse.json({ success: false, error: "Invalid credentials. Access denied." }, { status: 401 });
    const token = await createSessionToken(user);
    const response = NextResponse.json({ success: true, user: { id: user.userId, ...user } });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: unknown) {
    const message = "Authentication is temporarily unavailable.";
    void error;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
