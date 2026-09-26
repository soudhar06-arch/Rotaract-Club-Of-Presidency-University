import "server-only";
import { configuredValue } from "./google-auth";
export async function sendClubEmail(subject: string, text: string, replyTo: string) {
  const key = configuredValue(process.env.RESEND_API_KEY);
  const recipient = process.env.CLUB_APPLICATION_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!key || !recipient || !sender) throw new Error("Email is not configured. Set RESEND_API_KEY, RESEND_FROM_EMAIL and CLUB_APPLICATION_EMAIL.");
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: sender, to: [recipient], reply_to: replyTo, subject: subject.replace(/[\r\n]/g, " "), text }), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}.`);
  const result = await response.json();
  if (!result.id) throw new Error("Email provider did not confirm acceptance.");
}
