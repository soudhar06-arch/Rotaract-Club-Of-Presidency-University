import { getAvenueImages } from "@/lib/avenue-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const avenues = await getAvenueImages();
    return Response.json({ avenues }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Avenue content is temporarily unavailable." }, { status: 503 });
  }
}