import { NextResponse } from "next/server";
import { getLiveImpactCounters } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counters = await getLiveImpactCounters();
    return NextResponse.json({
      success: true,
      data: { members: counters.members, projects: counters.projects, bod: counters.bod, isLive: counters.isLive, lastUpdated: counters.lastUpdated },
    });
  } catch (error) {
    console.error("[API /api/counters Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch live impact counters.",
      },
      { status: 500 }
    );
  }
}
