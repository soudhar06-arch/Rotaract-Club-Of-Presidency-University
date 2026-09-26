import { z } from "zod";
import { sendClubEmail } from "@/lib/email-service";
import { rateLimited, sameOrigin } from "@/lib/request-security";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  if (rateLimited(request, "contact", 5)) return Response.json({ success: false, error: "Please wait before submitting another message." }, { status: 429 });
  const body = z.object({ name: z.string().trim().min(1).max(150), email: z.string().email().max(200), subject: z.string().max(200).optional(), message: z.string().trim().min(1).max(5000) }).safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ success: false, error: "Enter your name, a valid email and a message (up to 5000 characters)." }, { status: 400 });
  try {
    const { name, email, subject, message } = body.data;
    await sendClubEmail(`Club inquiry: ${subject || "Contact"}`, `Name: ${name}\nEmail: ${email}\nSubject: ${subject || ""}\n\n${message}`, email);
    return Response.json({ success: true });
  } catch { return Response.json({ success: false, error: "Your message could not be delivered. Please try again later." }, { status: 503 }); }
}
