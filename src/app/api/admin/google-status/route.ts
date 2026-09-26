import { clearDataCache } from "@/lib/server-cache";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-config";
import { runGoogleDiagnostics } from "@/lib/google-diagnostics";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    clearDataCache();
    const report = await runGoogleDiagnostics();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Diagnostics error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
