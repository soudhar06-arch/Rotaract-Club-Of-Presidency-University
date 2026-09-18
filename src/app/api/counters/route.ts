import { NextResponse } from "next/server";
import { getLiveImpactCounters } from "@/lib/google-sheets";

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const counters = await getLiveImpactCounters();
    return NextResponse.json({
      success: true,
      data: counters,
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
