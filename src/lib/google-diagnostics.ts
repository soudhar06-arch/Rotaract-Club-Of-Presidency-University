import { google } from "googleapis";

export interface DiagnosticItem {
  name: string;
  type: "SHEETS" | "DRIVE";
  id?: string;
  status: "CONNECTED" | "NOT_CONFIGURED" | "AUTHENTICATION_FAILED" | "PERMISSION_DENIED" | "RESOURCE_NOT_FOUND" | "ERROR";
  message: string;
  actionableStep?: string;
}

export interface GoogleDiagnosticsReport {
  serviceAccountEmail: string | null;
  serviceAccountConfigured: boolean;
  sheets: DiagnosticItem[];
  drive: DiagnosticItem[];
  timestamp: string;
}

function getAuthJwt() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !key) return null;

  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  try {
    return new google.auth.JWT({
      email,
      key,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });
  } catch {
    return null;
  }
}

async function testSheetConnection(
  name: string,
  id: string | undefined,
  auth: ReturnType<typeof getAuthJwt>,
  serviceEmail: string | null
): Promise<DiagnosticItem> {
  if (!id || !id.trim()) {
    return {
      name,
      type: "SHEETS",
      status: "NOT_CONFIGURED",
      message: "Environment variable not set in .env.local / Vercel.",
      actionableStep: `Configure ${name} Sheet ID in environment variables.`,
    };
  }

  if (!auth) {
    return {
      name,
      type: "SHEETS",
      id,
      status: "AUTHENTICATION_FAILED",
      message: "Google Service Account credentials missing or invalid.",
      actionableStep: "Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
    };
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.get({ spreadsheetId: id.trim() });

    return {
      name,
      type: "SHEETS",
      id,
      status: "CONNECTED",
      message: `Connected to spreadsheet "${res.data.properties?.title || id}" successfully.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("403") || msg.includes("permission") || msg.includes("Access Not Configured")) {
      return {
        name,
        type: "SHEETS",
        id,
        status: "PERMISSION_DENIED",
        message: "Access denied by Google Sheets API.",
        actionableStep: serviceEmail
          ? `Share this Google Sheet with "${serviceEmail}" giving Viewer access.`
          : "Share sheet with your service account email.",
      };
    }

    if (msg.includes("404") || msg.includes("not found")) {
      return {
        name,
        type: "SHEETS",
        id,
        status: "RESOURCE_NOT_FOUND",
        message: "Spreadsheet ID not found on Google Drive.",
        actionableStep: "Verify the Spreadsheet ID extracted from the Google Sheets URL.",
      };
    }

    return {
      name,
      type: "SHEETS",
      id,
      status: "ERROR",
      message: `Sheet test failed: ${msg}`,
      actionableStep: "Verify Google Sheets API is enabled in Google Cloud Console.",
    };
  }
}

async function testDriveFolderConnection(
  name: string,
  id: string | undefined,
  auth: ReturnType<typeof getAuthJwt>,
  serviceEmail: string | null
): Promise<DiagnosticItem> {
  if (!id || !id.trim()) {
    return {
      name,
      type: "DRIVE",
      status: "NOT_CONFIGURED",
      message: "Drive folder ID not set.",
      actionableStep: `Configure ${name} Drive Folder ID in environment variables.`,
    };
  }

  if (!auth) {
    return {
      name,
      type: "DRIVE",
      id,
      status: "AUTHENTICATION_FAILED",
      message: "Service Account credentials missing.",
      actionableStep: "Configure Service Account keys.",
    };
  }

  try {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.get({ fileId: id.trim(), fields: "id, name, mimeType" });

    return {
      name,
      type: "DRIVE",
      id,
      status: "CONNECTED",
      message: `Connected to Drive Folder "${res.data.name || id}" successfully.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("403") || msg.includes("permission")) {
      return {
        name,
        type: "DRIVE",
        id,
        status: "PERMISSION_DENIED",
        message: "Access denied by Google Drive API.",
        actionableStep: serviceEmail
          ? `Share this Drive Folder with "${serviceEmail}" giving Content Manager access.`
          : "Share folder with your service account email.",
      };
    }

    if (msg.includes("404") || msg.includes("not found")) {
      return {
        name,
        type: "DRIVE",
        id,
        status: "RESOURCE_NOT_FOUND",
        message: "Folder ID not found in Google Drive.",
        actionableStep: "Verify the Drive Folder ID extracted from your Drive URL.",
      };
    }

    return {
      name,
      type: "DRIVE",
      id,
      status: "ERROR",
      message: `Drive test error: ${msg}`,
      actionableStep: "Verify Google Drive API is enabled in Google Cloud Console.",
    };
  }
}

export async function runGoogleDiagnostics(): Promise<GoogleDiagnosticsReport> {
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || null;
  const auth = getAuthJwt();

  const sheetsTests = await Promise.all([
    testSheetConnection("Membership Responses", process.env.GOOGLE_SHEETS_MEMBERSHIP_ID || process.env.GOOGLE_SHEET_MEMBERS_URL, auth, serviceEmail),
    testSheetConnection("Project & Event Archive", process.env.GOOGLE_SHEETS_PROJECTS_ID || process.env.GOOGLE_SHEET_PROJECTS_URL, auth, serviceEmail),
    testSheetConnection("BOD Leadership", process.env.GOOGLE_SHEETS_BOD_ID || process.env.GOOGLE_SHEET_BOD_URL, auth, serviceEmail),
  ]);

  const driveTests = await Promise.all([
    testDriveFolderConnection("Root Storage Folder", process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID, auth, serviceEmail),
    testDriveFolderConnection("Projects Media Folder", process.env.GOOGLE_DRIVE_PROJECTS_FOLDER_ID, auth, serviceEmail),
    testDriveFolderConnection("Gallery Media Folder", process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID, auth, serviceEmail),
    testDriveFolderConnection("BOD Media Folder", process.env.GOOGLE_DRIVE_BOD_FOLDER_ID, auth, serviceEmail),
  ]);

  return {
    serviceAccountEmail: serviceEmail,
    serviceAccountConfigured: Boolean(serviceEmail && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
    sheets: sheetsTests,
    drive: driveTests,
    timestamp: new Date().toISOString(),
  };
}
