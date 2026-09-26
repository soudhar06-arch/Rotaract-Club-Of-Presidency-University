import "server-only";
import { google, type drive_v3 } from "googleapis";
import { Readable } from "node:stream";
import { createHmac, timingSafeEqual } from "node:crypto";
import { googleAuth, googleResourceId } from "./google-auth";
import { cached, clearDataCache } from "./server-cache";
import type { EventItem } from "./cms-store";
import type { BODMember, ProjectItem } from "./cms-store";
import { BOARD_2026_27 } from "@/data/board-2026-27";
import { sortBoard } from "./board-order";

export function driveClient() { return google.drive({ version: "v3", auth: googleAuth(["https://www.googleapis.com/auth/drive"]) }); }
function mediaToken(id: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters to sign media URLs.");
  return createHmac("sha256", secret).update(`drive:${id}`).digest("hex");
}
export function driveImageUrl(id: string) { return `/api/media/drive/${encodeURIComponent(id)}?token=${mediaToken(id)}`; }
export function verifyMediaToken(id: string, token: string) {
  const expected = Buffer.from(mediaToken(id)); const received = Buffer.from(token);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function listDriveChildren(folderId: string): Promise<drive_v3.Schema$File[]> {
  if (!/^[\w-]+$/.test(folderId)) throw new Error("Invalid Google Drive folder ID.");
  return cached(`drive:${folderId}`, 60000, async () => {
    const drive = driveClient();
    const folder = await drive.files.get({ fileId: folderId, supportsAllDrives: true, fields: "mimeType" }, { timeout: 15000 });
    if (folder.data.mimeType !== "application/vnd.google-apps.folder") throw new Error("Configured Drive resource is not a folder.");
    const files: drive_v3.Schema$File[] = []; let pageToken: string | undefined;
    do {
      const result = await drive.files.list({ q: `'${folderId}' in parents and trashed = false`, fields: "nextPageToken,files(id,name,mimeType,modifiedTime)", pageSize: 1000, orderBy: "name_natural", supportsAllDrives: true, includeItemsFromAllDrives: true, pageToken }, { timeout: 15000 });
      files.push(...(result.data.files || [])); pageToken = result.data.nextPageToken || undefined;
    } while (pageToken);
    return files;
  });
}

export async function getDriveEvents(): Promise<EventItem[]> {
  // The club stores its event albums in the configured gallery folder. Keep
  // ROOT as a compatibility fallback for deployments using the older layout.
  const root = googleResourceId(process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID);
  if (!root) throw new Error("Set GOOGLE_DRIVE_ROOT_FOLDER_ID to the folder containing one child folder per event.");
  const children = await listDriveChildren(root);
  const folders = children.filter((file) => file.id && file.name && file.mimeType === "application/vnd.google-apps.folder");
  const events: EventItem[] = [];
  // Limit concurrent calls so a large archive cannot exhaust the API quota.
  for (let offset = 0; offset < folders.length; offset += 4) {
    events.push(...await Promise.all(folders.slice(offset, offset + 4).map(async (folder) => {
      const images = (await listDriveChildren(folder.id!)).filter((file) => file.id && file.mimeType?.startsWith("image/")).map((file) => driveImageUrl(file.id!));
      return { id: `drive-${folder.id}`, slug: `drive-${folder.id}`, folderId: folder.id!, title: folder.name!, category: "", source: "drive" as const, published: true, coverImage: images[0], image: images[0], images };
    })));
  }
  return events;
}

const searchable = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export async function getDriveBoard(): Promise<BODMember[]> {
  const folderId = googleResourceId(process.env.GOOGLE_DRIVE_BOD_FOLDER_ID);
  if (!folderId) return [];
  const images = (await listDriveChildren(folderId)).filter(file => file.id && file.mimeType?.startsWith("image/"));
  return sortBoard(BOARD_2026_27.map(([name, role], index) => {
    const key = searchable(name);
    const image = images.find(file => searchable(file.name || "").includes(key)
      || key.includes(searchable((file.name || "").replace(/^.*?\s-\s/, "").replace(/\.[^.]+$/, ""))));
    return { id: `board-2026-${index + 1}`, name, role, category: index < 7 ? "Executive" as const : "Director" as const,
      bio: "", image: image?.id ? driveImageUrl(image.id) : undefined, displayOrder: index, isActive: true };
  }));
}

export async function getDriveProjects(): Promise<ProjectItem[]> {
  const events = await getDriveEvents();
  return events.map((event, index) => ({ id: `project-${event.folderId || event.id}`, slug: event.slug,
    title: event.title, category: event.category || "Club Project", date: event.date,
    shortDescription: event.shortDescription || event.description, description: event.description,
    fullDescription: event.detailedDescription, image: event.coverImage || event.image,
    coverImage: event.coverImage || event.image, images: event.images || [], featured: index < 3, published: true }));
}

export async function uploadFileToDrive(buffer: Buffer, name: string, mimeType: string, category: "projects" | "gallery" | "bod" | "events") {
  const folderId = googleResourceId(category === "bod" ? process.env.GOOGLE_DRIVE_BOD_FOLDER_ID : category === "gallery" ? process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID : process.env.GOOGLE_DRIVE_PROJECTS_FOLDER_ID);
  if (!folderId) throw new Error(`Configure GOOGLE_DRIVE_${category === "bod" ? "BOD" : category === "gallery" ? "GALLERY" : "PROJECTS"}_FOLDER_ID for uploads.`);
  const drive = driveClient();
  const parent = await drive.files.get({ fileId: folderId, supportsAllDrives: true, fields: "driveId,mimeType,capabilities(canAddChildren)" }, { timeout: 15000 });
  if (!parent.data.driveId) throw new Error("Service-account uploads require a Google Workspace Shared Drive folder; service accounts have no personal storage quota. Alternatively configure Supabase Storage.");
  if (!parent.data.capabilities?.canAddChildren) throw new Error("Give the service account Content manager access to the upload folder.");
  const result = await drive.files.create({ requestBody: { name, parents: [folderId] }, media: { mimeType, body: Readable.from(buffer) }, fields: "id,name", supportsAllDrives: true }, { timeout: 45000 });
  if (!result.data.id) throw new Error("Drive did not return an uploaded file ID.");
  clearDataCache();
  return { id: result.data.id, name, url: driveImageUrl(result.data.id) };
}
