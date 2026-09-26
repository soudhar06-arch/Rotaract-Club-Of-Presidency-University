import { driveClient, verifyMediaToken } from "@/lib/google-drive-service";
import { googleAuth } from "@/lib/google-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("token") || "";
  try {
    if (!/^[\w-]+$/.test(id) || !verifyMediaToken(id, token)) return new Response("Not found", { status: 404 });
    const drive = driveClient();
    const metadata = await drive.files.get({ fileId: id, supportsAllDrives: true, fields: "mimeType,thumbnailLink" }, { timeout: 15000 });
    if (!metadata.data.mimeType?.startsWith("image/")) return new Response("Not an image", { status: 415 });
    // Drive thumbnails avoid downloading full-resolution originals for cards and galleries.
    if (metadata.data.thumbnailLink) {
      const headers = await googleAuth(["https://www.googleapis.com/auth/drive.readonly"]).getRequestHeaders();
      const thumbnail = await fetch(metadata.data.thumbnailLink.replace(/=s\d+$/, "=s1200"), { headers, signal: AbortSignal.timeout(15000) });
      if (thumbnail.ok) return new Response(thumbnail.body, { headers: { "Content-Type": thumbnail.headers.get("Content-Type") || "image/jpeg", "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
    }
    const file = await drive.files.get({ fileId: id, alt: "media", supportsAllDrives: true }, { responseType: "arraybuffer", timeout: 15000 });
    return new Response(file.data as ArrayBuffer, { headers: { "Content-Type": metadata.data.mimeType, "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response("Image is temporarily unavailable", { status: 502 }); }
}
