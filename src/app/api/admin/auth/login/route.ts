import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_DEV_USERNAME,
  ADMIN_DEV_PASSWORD,
  ADMIN_SESSION_COOKIE,
  createSessionToken,
} from "@/lib/auth-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Access denied." },
        { status: 401 }
      );
    }

    // Generic verification (never reveal whether username or password was incorrect)
    const isValidUser = username.trim() === ADMIN_DEV_USERNAME;
    const isValidPass = password === ADMIN_DEV_PASSWORD;

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Access denied." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: "usr-owner-1",
      username: ADMIN_DEV_USERNAME,
      role: "OWNER",
      name: "Rotaract Secretariat",
      email: "rotaractcpu@gmail.com",
    });

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400, // 24 hours
    });

    return NextResponse.json({
      success: true,
      user: {
        id: "usr-owner-1",
        username: ADMIN_DEV_USERNAME,
        role: "OWNER",
        name: "Rotaract Secretariat",
        email: "rotaractcpu@gmail.com",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
