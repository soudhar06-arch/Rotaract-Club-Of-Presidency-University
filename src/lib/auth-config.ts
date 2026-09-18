import { cookies } from "next/headers";

// Temporary development credentials - stored strictly server-side
export const ADMIN_DEV_USERNAME = process.env.ADMIN_DEV_USERNAME || "rotaract_presidency_university";
export const ADMIN_DEV_PASSWORD = process.env.ADMIN_DEV_PASSWORD || "Rotaract-2026";
export const ADMIN_SESSION_COOKIE = "rcpu_admin_session";
export const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "rcpu-secret-jwt-key-2026-secure-token-98765";

export interface SessionPayload {
  userId: string;
  username: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  name: string;
  email: string;
  exp: number;
}

// Edge & Node compatible Base64URL helpers
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// Edge & Node compatible Web Crypto HMAC-SHA256
async function signHmacSha256(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const bytes = new Uint8Array(signature);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
  expiresInSeconds = 86400
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: SessionPayload = { ...payload, exp };
  const base64Payload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = await signHmacSha256(base64Payload, ADMIN_SESSION_SECRET);
  return `${base64Payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [base64Payload, signature] = parts;
    const expectedSignature = await signHmacSha256(base64Payload, ADMIN_SESSION_SECRET);

    if (signature !== expectedSignature) return null;

    const payload: SessionPayload = JSON.parse(base64UrlDecode(base64Payload));

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
