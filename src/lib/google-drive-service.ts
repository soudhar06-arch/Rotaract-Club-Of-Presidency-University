import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export interface DriveUploadResult {
  fileId: string;
  url: string;
  name: string;
  mimeType: string;
  source: "GOOGLE_DRIVE" | "LOCAL_STORAGE";
}

function getGoogleDriveClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) return null;

  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"],
    });
    return google.drive({ version: "v3", auth });
  } catch (err) {
    console.error("[Google Drive Auth Error]:", err);
    return null;
  }
}

/**
 * Convert Buffer to Readable Stream for Drive Upload
 */
function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

/**
 * Upload an image file to Google Drive (or local storage fallback).
 */
export async function uploadFileToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folderType: "projects" | "bod" | "gallery" | "root" = "projects"
): Promise<DriveUploadResult> {
  const drive = getGoogleDriveClient();

  // Resolve target Google Drive Folder ID
  let folderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (folderType === "projects" && process.env.GOOGLE_DRIVE_PROJECTS_FOLDER_ID) {
    folderId = process.env.GOOGLE_DRIVE_PROJECTS_FOLDER_ID;
  } else if (folderType === "bod" && process.env.GOOGLE_DRIVE_BOD_FOLDER_ID) {
    folderId = process.env.GOOGLE_DRIVE_BOD_FOLDER_ID;
  } else if (folderType === "gallery" && process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID) {
    folderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;
  }

  // 1. If Drive Client is authenticated, upload to Google Drive
  if (drive && folderId) {
    try {
      const res = await drive.files.create({
        requestBody: {
          name: `${Date.now()}-${filename}`,
          parents: [folderId],
        },
        media: {
          mimeType,
          body: bufferToStream(buffer),
        },
        fields: "id, name, webViewLink, webContentLink",
      });

      const fileId = res.data.id;
      if (fileId) {
        // Set public reader permissions
        try {
          await drive.permissions.create({
            fileId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });
        } catch {
          // Permission inheritance might already exist
        }

        // Direct high-res viewable thumbnail URL for Google Drive files
        const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
        return {
          fileId,
          url: directUrl,
          name: res.data.name || filename,
          mimeType,
          source: "GOOGLE_DRIVE",
        };
      }
    } catch (err) {
      console.warn("[Google Drive Upload Failed, using local fallback]:", err);
    }
  }

  // 2. Local Storage Fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeFilename = `upload-${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadsDir, safeFilename);
  fs.writeFileSync(filePath, buffer);

  const localUrl = `/uploads/${safeFilename}`;
  return {
    fileId: safeFilename,
    url: localUrl,
    name: filename,
    mimeType,
    source: "LOCAL_STORAGE",
  };
}
