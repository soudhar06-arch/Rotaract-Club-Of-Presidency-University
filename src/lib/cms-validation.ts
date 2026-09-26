import { z } from "zod";
const text = z.string().trim().max(20000);
const url = z.string().trim().max(4096).refine(value => !value || /^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value), "Use an http(s) URL or a local /path.");
const count = z.number().int().nonnegative().nullable().optional();
const id = z.string().trim().min(1).max(200);
const imageFields = { image: url.optional(), coverImage: url.optional(), images: z.array(url).max(1000).optional() };
const common = { id: id.optional(), title: text.optional(), category: text.optional(), date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional(), time: text.optional(), venue: text.optional(), platform: text.optional(), description: text.optional(), shortDescription: text.optional(), published: z.boolean().optional(), slug: z.string().regex(/^[a-zA-Z0-9_-]*$/).max(200).optional(), participants: count, beneficiaries: count, collaborators: z.array(z.string().max(200)).max(50).optional(), ...imageFields };
export const cmsSchemas: Record<string, z.ZodType> = {
  bod: z.object({ id: id.optional(), name: z.string().trim().min(1).max(200).optional(), role: z.string().trim().min(1).max(200).optional(), category: z.enum(["Executive", "Director"]).optional(), bio: text.optional(), quote: text.optional(), image: url.optional(), instagram: url.optional(), linkedin: url.optional(), email: z.union([z.literal(""), z.string().email()]).optional(), displayOrder: z.number().int().nonnegative().optional(), isActive: z.boolean().optional() }),
  projects: z.object({ ...common, objective: text.optional(), fullDescription: text.optional(), featured: z.boolean().optional(), volunteers: count }),
  events: z.object({ ...common, folderId: z.string().max(300).optional(), registrationLink: url.optional(), detailedDescription: text.optional(), source: z.enum(["cms", "drive", "local"]).optional() }),
  faq: z.object({ id: id.optional(), question: text.optional(), answer: text.optional(), category: text.optional(), order: z.number().int().nonnegative().optional(), published: z.boolean().optional() }),
  gallery: z.object({ id: id.optional(), name: text.optional(), url: url.optional(), category: z.enum(["Logo", "Hero", "Gallery", "Event", "Project", "BOD", "Partner", "Award", "Timeline", "Other"]).optional(), uploadedAt: z.string().max(40).optional() }),
  config: z.object({ universityAddress: text.optional(), phone: z.string().max(80).optional(), email: z.union([z.literal(""), z.string().email()]).optional(), membershipFormUrl: url.optional(), instagram: url.optional(), linkedin: url.optional(), youtube: url.optional(), googleSheetsMembersUrl: z.string().max(300).optional(), googleSheetsProjectsUrl: z.string().max(300).optional(), googleSheetsBodUrl: z.string().max(300).optional(), googleCalendarId: z.string().max(300).optional() }),
};
export function validateCMSPayload(module: string, action: string, payload: unknown): Record<string, unknown> {
  const schema = cmsSchemas[module];
  if (!schema) throw new Error("Unsupported content module.");
  const result = schema.safeParse(payload);
  if (!result.success) throw new Error(result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; "));
  const data = result.data as Record<string, unknown>;
  if (action === "create") {
    const required = module === "bod" ? ["name", "role", "category"] : module === "faq" ? ["question", "answer", "category"] : module === "gallery" ? ["name", "url", "category"] : ["title", "category"];
    if (required.some(key => typeof data[key] !== "string" || !String(data[key]).trim())) throw new Error(`Required fields: ${required.join(", ")}.`);
  }
  return data;
}
