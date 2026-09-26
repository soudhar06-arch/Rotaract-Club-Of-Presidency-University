import "server-only";
import { google } from "googleapis";

export function configuredValue(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed && !/your[_ -]|placeholder|replace[_ -]|paste[_ -]|xxxxxxxx/i.test(trimmed) ? trimmed : undefined;
}
export function googleAuth(scopes: string[]) {
  const email = configuredValue(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const key = configuredValue(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)?.replace(/\\n/g, "\n");
  if (!email || !key) throw new Error("Set valid GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY; placeholder values cannot authenticate.");
  return new google.auth.JWT({ email, key, scopes });
}
export function googleResourceId(value?: string) {
  const source = configuredValue(value);
  return source?.match(/\/(?:d|folders)\/([^/?]+)/)?.[1] ?? source;
}
