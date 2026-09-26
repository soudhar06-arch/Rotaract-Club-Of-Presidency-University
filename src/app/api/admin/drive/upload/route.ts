import { getServerSession } from "@/lib/auth-config";
import { uploadFileToDrive } from "@/lib/google-drive-service";
import { configuredValue } from "@/lib/google-auth";
import { CMSStore, getCMSClient } from "@/lib/cms-store";
import { sameOrigin } from "@/lib/request-security";
import sharp from "sharp";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (session.role === "VIEWER" || !sameOrigin(request)) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    if (Number(request.headers.get("content-length")) > 4 * 1024 * 1024) throw new Error("Upload at most 4 MB per request.");
    const form = await request.formData();
    const files = form.getAll("files").filter((file): file is File => file instanceof File);
    const category = String(form.get("category") || "projects");
    if (!["bod", "projects", "events", "gallery"].includes(category)) throw new Error("Invalid media category.");
    if (category === "bod" && session.role === "EDITOR") return Response.json({ success: false, error: "Only administrators can upload BOD images." }, { status: 403 });
    if (!files.length || files.length > 5 || files.reduce((total, file) => total + file.size, 0) > 4 * 1024 * 1024) throw new Error("Choose 1?5 images totaling at most 4 MB.");
    if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) throw new Error("Only JPEG, PNG and WebP images are supported.");
    const folder = category === "bod" ? process.env.GOOGLE_DRIVE_BOD_FOLDER_ID : category === "gallery" ? process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID : process.env.GOOGLE_DRIVE_PROJECTS_FOLDER_ID;
    const urls: string[] = [];
    for (const file of files) {
      const buffer = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 }).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      let url: string;
      if (configuredValue(folder)) url = (await uploadFileToDrive(buffer, `${crypto.randomUUID()}.webp`, "image/webp", category as "bod" | "projects" | "events" | "gallery")).url;
      else {
        const client = getCMSClient(); const bucket = process.env.SUPABASE_STORAGE_BUCKET || "club-media";
        const path = `${category}/${crypto.randomUUID()}.webp`;
        const { error } = await client.storage.from(bucket).upload(path, buffer, { contentType: "image/webp", upsert: false });
        if (error) throw new Error(`Storage upload failed: ${error.message}. Configure the public ${bucket} bucket or a Drive upload folder.`);
        url = client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      }
      if (CMSStore.isConfigured()) await CMSStore.addMedia({ name: file.name, url, category: category === "bod" ? "BOD" : category === "gallery" ? "Gallery" : category === "events" ? "Event" : "Project", uploadedAt: new Date().toISOString() }, { email: session.email || session.username });
      urls.push(url);
    }
    return Response.json({ success: true, urls });
  } catch (error) { return Response.json({ success: false, error: error instanceof Error ? error.message : "Image upload failed." }, { status: 400 }); }
}
