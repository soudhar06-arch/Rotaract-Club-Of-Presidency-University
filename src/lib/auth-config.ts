import "server-only";
import { cookies } from "next/headers";

// These values have no source-code defaults. Configure them in every deployed
// environment before enabling the admin login.
export const ADMIN_DEV_USERNAME = process.env.ADMIN_DEV_USERNAME?.trim() ?? "";
export const ADMIN_DEV_PASSWORD = process.env.ADMIN_DEV_PASSWORD ?? "";
export const ADMIN_SESSION_COOKIE = "rcpu_admin_session";
export const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "";

export interface SessionPayload {
  userId: string;
  username: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  name: string;
  email: string;
  exp: number;
}

export function getAdminConfigurationError(): string | null {
  if ((!ADMIN_DEV_USERNAME || !ADMIN_DEV_PASSWORD) && !process.env.NEXT_PUBLIC_SUPABASE_URL) return "Configure admin bootstrap credentials or Supabase authentication.";
  if (ADMIN_SESSION_SECRET.length < 32) return "ADMIN_SESSION_SECRET must be at least 32 characters.";
  return null;
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function signHmacSha256(data: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data)));
  let binary = "";
  signature.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let mismatch = leftBytes.length ^ rightBytes.length;
  const longest = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < longest; index += 1) mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  return mismatch === 0;
}

export function verifyAdminCredentials(username: string, password: string) {
  const configurationError = getAdminConfigurationError();
  if (configurationError || !ADMIN_DEV_USERNAME || !ADMIN_DEV_PASSWORD) return false;
  return timingSafeEqual(username.trim(), ADMIN_DEV_USERNAME) && timingSafeEqual(password, ADMIN_DEV_PASSWORD);
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">, expiresInSeconds = 60 * 60 * 8) {
  const configurationError = getAdminConfigurationError();
  if (configurationError) throw new Error(configurationError);
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
  return `${body}.${await signHmacSha256(body, ADMIN_SESSION_SECRET)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || getAdminConfigurationError()) return null;
  try {
    const [body, signature, extra] = token.split(".");
    if (!body || !signature || extra) return null;
    const expected = await signHmacSha256(body, ADMIN_SESSION_SECRET);
    if (!timingSafeEqual(signature, expected)) return null;
    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    return payload.exp > Math.floor(Date.now() / 1000) && ["OWNER", "ADMIN", "EDITOR", "VIEWER"].includes(payload.role) && typeof payload.userId === "string" ? payload : null;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session || session.userId === "env-admin") return session;
  try {
    const { getCMSClient } = await import("./cms-store");
    const { data, error } = await getCMSClient().from("profiles").select("role,is_active,full_name,email").eq("id", session.userId).single();
    if (error || !data?.is_active) return null;
    return { ...session, role: data.role, name: data.full_name, email: data.email };
  } catch { return null; }
}
