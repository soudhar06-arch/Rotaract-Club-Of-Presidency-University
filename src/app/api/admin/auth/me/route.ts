import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-config";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      username: session.username,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
