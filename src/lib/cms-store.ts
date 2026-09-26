import { usesSheet, readSheetBOD, readSheetProjects, writeSheetRecord } from "./sheet-cms";
import "server-only";
import { sortBoard } from "./board-order";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Disabled";
  lastLogin?: string;
  createdDate: string;
}

export interface BODMember {
  id: string;
  name: string;
  role: string;
  category: "Executive" | "Director";
  bio: string;
  quote?: string;
  image?: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  objective?: string;
  fullDescription?: string;
  category: string;
  date?: string;
  time?: string;
  venue?: string;
  image?: string;
  coverImage?: string;
  images: string[];
  featured?: boolean;
  published?: boolean;
  collaborators?: string[];
  participants?: number;
  beneficiaries?: number;
  volunteers?: number;
  platform?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug?: string;
  folderId?: string;
  date?: string;
  time?: string;
  venue?: string;
  platform?: string;
  category: string;
  participants?: number;
  beneficiaries?: number;
  collaborators?: string[];
  registrationLink?: string;
  image?: string;
  coverImage?: string;
  images?: string[];
  description?: string;
  shortDescription?: string;
  detailedDescription?: string;
  source?: "cms" | "drive" | "calendar" | "local";
  published?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  published?: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: "Logo" | "Hero" | "Gallery" | "Event" | "Project" | "BOD" | "Partner" | "Award" | "Timeline" | "Other";
  size?: string;
  uploadedAt: string;
}

export interface SiteConfig {
  universityAddress: string;
  phone: string;
  email: string;
  membershipFormUrl: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  googleSheetsMembersUrl?: string;
  googleSheetsProjectsUrl?: string;
  googleSheetsBodUrl?: string;
  googleCalendarId?: string;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId?: string;
  timestamp: string;
  details?: string;
}

export class CMSConfigurationError extends Error {
  constructor(message = "Supabase CMS is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.") {
    super(message);
    this.name = "CMSConfigurationError";
  }
}

export function getCMSClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new CMSConfigurationError();
  return createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function mapBod(row: Record<string, unknown>): BODMember {
  return {
    id: String(row.id), name: String(row.name ?? ""), role: String(row.role ?? ""), category: row.category === "Executive" ? "Executive" : "Director", bio: String(row.bio ?? ""),
    quote: asNullableString(row.quote) ?? undefined, image: asNullableString(row.image_url) ?? undefined, instagram: asNullableString(row.instagram_url) ?? undefined, linkedin: asNullableString(row.linkedin_url) ?? undefined, email: asNullableString(row.email) ?? undefined,
    displayOrder: typeof row.display_order === "number" ? row.display_order : 0, isActive: Boolean(row.is_active),
  };
}

function mapProject(row: Record<string, unknown>): ProjectItem {
  const images = stringArray(row.gallery_images);
  const coverImage = asNullableString(row.cover_image) ?? images[0];
  return {
    id: String(row.id), title: String(row.title ?? ""), slug: asNullableString(row.slug) ?? undefined, shortDescription: asNullableString(row.short_description) ?? undefined, description: asNullableString(row.short_description) ?? undefined,
    objective: asNullableString(row.objective) ?? undefined, fullDescription: asNullableString(row.full_description) ?? undefined, category: String(row.category ?? "General"), time: asNullableString(row.time_str) ?? undefined, platform: asNullableString(row.platform) ?? undefined, participants: typeof row.participants === "number" ? row.participants : undefined, beneficiaries: typeof row.beneficiaries === "number" ? row.beneficiaries : undefined, volunteers: typeof row.volunteers === "number" ? row.volunteers : undefined, collaborators: stringArray(row.collaborators), date: asNullableString(row.date) ?? undefined, venue: asNullableString(row.venue) ?? undefined,
    image: coverImage, coverImage, images: coverImage && !images.includes(coverImage) ? [coverImage, ...images] : images, featured: Boolean(row.is_featured), published: row.status === "PUBLISHED",
  };
}

function mapEvent(row: Record<string, unknown>): EventItem {
  const images = stringArray(row.images);
  const coverImage = asNullableString(row.cover_image) ?? images[0];
  return {
    id: String(row.id), title: String(row.title ?? ""), slug: asNullableString(row.slug) ?? undefined, folderId: asNullableString(row.folder_id) ?? undefined, date: asNullableString(row.date) ?? undefined, time: asNullableString(row.time_str) ?? undefined,
    venue: asNullableString(row.location) ?? undefined, platform: asNullableString(row.platform) ?? undefined, category: String(row.category ?? "General"), participants: typeof row.participants === "number" ? row.participants : undefined,
    beneficiaries: typeof row.beneficiaries === "number" ? row.beneficiaries : undefined, collaborators: stringArray(row.collaborators), registrationLink: asNullableString(row.registration_link) ?? undefined, image: coverImage, coverImage,
    images: coverImage && !images.includes(coverImage) ? [coverImage, ...images] : images, description: asNullableString(row.description) ?? undefined, shortDescription: asNullableString(row.short_description) ?? undefined,
    detailedDescription: asNullableString(row.detailed_description) ?? undefined, source: row.source === "drive" || row.source === "calendar" ? row.source : "cms", published: row.status === "PUBLISHED",
  };
}

function mapFaq(row: Record<string, unknown>): FAQItem {
  return { id: String(row.id), question: String(row.question ?? ""), answer: String(row.answer ?? ""), category: String(row.category ?? "General"), order: typeof row.display_order === "number" ? row.display_order : 0, published: Boolean(row.is_published) };
}

function mapMedia(row: Record<string, unknown>): MediaItem {
  return { id: String(row.id), name: String(row.filename ?? ""), url: String(row.url ?? ""), category: String(row.category ?? "Other") as MediaItem["category"], size: typeof row.file_size === "number" ? String(row.file_size) : undefined, uploadedAt: String(row.created_at ?? "") };
}

function mapConfig(row: Record<string, unknown>): SiteConfig {
  return {
    universityAddress: String(row.university_address ?? ""), phone: String(row.phone ?? ""), email: String(row.email ?? ""), membershipFormUrl: String(row.membership_form_url ?? ""),
    instagram: asNullableString(row.instagram) ?? undefined, linkedin: asNullableString(row.linkedin) ?? undefined, youtube: asNullableString(row.youtube) ?? undefined,
    googleSheetsMembersUrl: asNullableString(row.google_sheets_members_id) ?? undefined, googleSheetsProjectsUrl: asNullableString(row.google_sheets_projects_id) ?? undefined,
    googleSheetsBodUrl: asNullableString(row.google_sheets_bod_id) ?? undefined, googleCalendarId: asNullableString(row.google_calendar_id) ?? undefined,
  };
}

function mapAudit(row: Record<string, unknown>): AuditLogItem {
  return { id: String(row.id), user: String(row.user_email ?? "System"), action: String(row.action ?? ""), entity: String(row.entity ?? ""), entityId: asNullableString(row.entity_id) ?? undefined, timestamp: String(row.created_at ?? ""), details: asNullableString(row.details) ?? undefined };
}

async function audit(client: SupabaseClient, actor: { id?: string; email?: string } | undefined, action: string, entity: string, entityId?: string, details?: string) {
  const { error } = await client.from("audit_logs").insert({ user_id: actor?.id ?? null, user_email: actor?.email ?? null, action, entity, entity_id: entityId ?? null, details: details ?? null });
  if (error) throw new Error(`Audit log write failed: ${error.message}`);
}

export class CMSStore {
  static isConfigured() {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
      return url.protocol === "https:" && url.hostname.endsWith(".supabase.co")
        && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.length > 80);
    } catch { return false; }
  }

  static async getBODMembers(includeInactive = false): Promise<BODMember[]> {
    if (usesSheet("bod")) return readSheetBOD(includeInactive);
    const client = getCMSClient(); let query = client.from("bod_members").select("*").order("display_order", { ascending: true }); if (!includeInactive) query = query.eq("is_active", true);
    const { data, error } = await query; if (error) throw new Error(`Could not load BOD members: ${error.message}`); return sortBoard((data ?? []).map((row) => mapBod(row as Record<string, unknown>)));
  }

  static async addBODMember(member: Omit<BODMember, "id">, actor?: { id?: string; email?: string }): Promise<BODMember> {
    if (usesSheet("bod")) { const recordId = await writeSheetRecord("bod", "create", { ...member }); if (CMSStore.isConfigured()) await audit(getCMSClient(), actor, "CREATE", "BODMember", recordId); const saved = (await readSheetBOD(true)).find(item => item.id === recordId); if (!saved) throw new Error("Saved sheet record could not be read back."); return saved; }
    const client = getCMSClient(); const { data, error } = await client.from("bod_members").insert({ id: crypto.randomUUID(), name: member.name.trim(), role: member.role.trim(), category: member.category, bio: member.bio?.trim() ?? "", quote: asNullableString(member.quote), image_url: asNullableString(member.image), instagram_url: asNullableString(member.instagram), linkedin_url: asNullableString(member.linkedin), email: asNullableString(member.email), display_order: member.displayOrder ?? 0, is_active: member.isActive ?? true }).select().single();
    if (error) throw new Error(`Could not create BOD member: ${error.message}`); await audit(client, actor, "CREATE", "BOD Member", String(data.id), `Created ${data.name}.`); return mapBod(data as Record<string, unknown>);
  }

  static async updateBODMember(id: string, member: Partial<BODMember>, actor?: { id?: string; email?: string }): Promise<BODMember> {
    if (usesSheet("bod")) { const recordId = await writeSheetRecord("bod", "update", { ...member }, id); if (CMSStore.isConfigured()) await audit(getCMSClient(), actor, "UPDATE", "BODMember", recordId); const saved = (await readSheetBOD(true)).find(item => item.id === recordId); if (!saved) throw new Error("Saved sheet record could not be read back."); return saved; }
    const client = getCMSClient(); const updates = { ...(member.name !== undefined ? { name: member.name.trim() } : {}), ...(member.role !== undefined ? { role: member.role.trim() } : {}), ...(member.category !== undefined ? { category: member.category } : {}), ...(member.bio !== undefined ? { bio: member.bio.trim() } : {}), ...(member.quote !== undefined ? { quote: asNullableString(member.quote) } : {}), ...(member.image !== undefined ? { image_url: asNullableString(member.image) } : {}), ...(member.instagram !== undefined ? { instagram_url: asNullableString(member.instagram) } : {}), ...(member.linkedin !== undefined ? { linkedin_url: asNullableString(member.linkedin) } : {}), ...(member.email !== undefined ? { email: asNullableString(member.email) } : {}), ...(member.displayOrder !== undefined ? { display_order: member.displayOrder } : {}), ...(member.isActive !== undefined ? { is_active: member.isActive } : {}), updated_at: new Date().toISOString() };
    const { data, error } = await client.from("bod_members").update(updates).eq("id", id).select().single(); if (error) throw new Error(`Could not update BOD member: ${error.message}`); await audit(client, actor, "UPDATE", "BOD Member", id, `Updated ${data.name}.`); return mapBod(data as Record<string, unknown>);
  }

  static async deleteBODMember(id: string, actor?: { id?: string; email?: string }): Promise<void> {
    if (usesSheet("bod")) { const recordId = await writeSheetRecord("bod", "delete", {}, id); if (CMSStore.isConfigured()) await audit(getCMSClient(), actor, "DELETE", "BODMember", recordId); return; }
    const client = getCMSClient(); const { error } = await client.from("bod_members").delete().eq("id", id); if (error) throw new Error(`Could not delete BOD member: ${error.message}`); await audit(client, actor, "DELETE", "BOD Member", id);
  }

  static async getProjects(includeUnpublished = false): Promise<ProjectItem[]> {
    if (usesSheet("projects")) return readSheetProjects(includeUnpublished);
    const client = getCMSClient(); let query = client.from("projects").select("*").order("date", { ascending: false }); if (!includeUnpublished) query = query.eq("status", "PUBLISHED"); const { data, error } = await query; if (error) throw new Error(`Could not load projects: ${error.message}`); return (data ?? []).map((row) => mapProject(row as Record<string, unknown>));
  }

  static async addProject(project: Omit<ProjectItem, "id">, actor?: { id?: string; email?: string }): Promise<ProjectItem> {
    if (usesSheet("projects")) { const recordId = await writeSheetRecord("projects", "create", { ...project }); if (CMSStore.isConfigured()) await audit(getCMSClient(), actor, "CREATE", "Project", recordId); const saved = (await readSheetProjects(true)).find(item => item.id === recordId); if (!saved) throw new Error("Saved sheet record could not be read back."); return saved; }
    const client = getCMSClient(); const title = project.title.trim(); const { data, error } = await client.from("projects").insert({ id: crypto.randomUUID(), title, slug: project.slug?.trim() || slugify(title), short_description: asNullableString(project.shortDescription ?? project.description), full_description: asNullableString(project.fullDescription), objective: asNullableString(project.objective), category: project.category.trim(), date: asNullableString(project.date), venue: asNullableString(project.venue), cover_image: asNullableString(project.coverImage ?? project.image), gallery_images: project.images ?? [], time_str: asNullableString(project.time), platform: asNullableString(project.platform), participants: project.participants ?? null, beneficiaries: project.beneficiaries ?? null, volunteers: project.volunteers ?? null, collaborators: project.collaborators ?? [], is_featured: Boolean(project.featured), status: project.published === false ? "DRAFT" : "PUBLISHED" }).select().single();
    if (error) throw new Error(`Could not create project: ${error.message}`); await audit(client, actor, "CREATE", "Project", String(data.id), `Created ${data.title}.`); return mapProject(data as Record<string, unknown>);
  }

  static async updateProject(id: string, project: Partial<ProjectItem>, actor?: { id?: string; email?: string }): Promise<ProjectItem> {
    if (usesSheet("projects")) { const recordId = await writeSheetRecord("projects", "update", { ...project }, id); if (CMSStore.isConfigured()) await audit(getCMSClient(), actor, "UPDATE", "Project", recordId); const saved = (await readSheetProjects(true)).find(item => item.id === recordId); if (!saved) throw new Error("Saved sheet record could not be read back."); return saved; }
    const client = getCMSClient(); const updates = { ...(project.title !== undefined ? { title: project.title.trim(), slug: project.slug?.trim() || undefined } : project.slug !== undefined ? { slug: project.slug.trim() } : {}), ...(project.shortDescription !== undefined || project.description !== undefined ? { short_description: asNullableString(project.shortDescription ?? project.description) } : {}), ...(project.fullDescription !== undefined ? { full_description: asNullableString(project.fullDescription) } : {}), ...(project.objective !== undefined ? { objective: asNullableString(project.objective) } : {}), ...(project.category !== undefined ? { category: project.category.trim() } : {}), ...(project.date !== undefined ? { date: asNullableString(project.date) } : {}), ...(project.venue !== undefined ? { venue: asNullableString(project.venue) } : {}), ...(project.coverImage !== undefined || project.image !== undefined ? { cover_image: asNullableString(project.coverImage ?? project.image) } : {}), ...(project.images !== undefined ? { gallery_images: project.images } : {}), ...(project.time !== undefined ? { time_str: asNullableString(project.time) } : {}), ...(project.platform !== undefined ? { platform: asNullableString(project.platform) } : {}), ...(project.participants !== undefined ? { participants: project.participants } : {}), ...(project.beneficiaries !== undefined ? { beneficiaries: project.beneficiaries } : {}), ...(project.volunteers !== undefined ? { volunteers: project.volunteers } : {}), ...(project.collaborators !== undefined ? { collaborators: project.collaborators } : {}), ...(project.featured !== undefined ? { is_featured: project.featured } : {}), ...(project.published !== undefined ? { status: project.published ? "PUBLISHED" : "DRAFT" } : {}), updated_at: new Date().toISOString() };
    const { data, error } = await client.from("projects").update(updates).eq("id", id).select().single(); if (error) throw new Error(`Could not update project: ${error.message}`); await audit(client, actor, "UPDATE", "Project", id, `Updated ${data.title}.`); return mapProject(data as Record<string, unknown>);
  }

  static async deleteProject(id: string, actor?: { id?: string; email?: string }): Promise<void> {
    if (usesSheet("projects")) { const recordId = await writeSheetRecord("projects", "delete", {}, id); if (CMSStore.isConfigured()) await audit(getCMSClient(), actor, "DELETE", "Project", recordId); return; }
    const client = getCMSClient(); const { error } = await client.from("projects").delete().eq("id", id); if (error) throw new Error(`Could not delete project: ${error.message}`); await audit(client, actor, "DELETE", "Project", id);
  }

  static async getEvents(includeUnpublished = false): Promise<EventItem[]> {
    const client = getCMSClient(); let query = client.from("historical_events").select("*").order("date", { ascending: false }); if (!includeUnpublished) query = query.eq("status", "PUBLISHED"); const { data, error } = await query; if (error) throw new Error(`Could not load historical events: ${error.message}`); return (data ?? []).map((row) => mapEvent(row as Record<string, unknown>));
  }

  static async addEvent(event: Omit<EventItem, "id">, actor?: { id?: string; email?: string }): Promise<EventItem> {
    const client = getCMSClient(); const title = event.title.trim(); const { data, error } = await client.from("historical_events").insert({ id: crypto.randomUUID(), title, slug: event.slug?.trim() || slugify(title), folder_id: asNullableString(event.folderId), date: asNullableString(event.date), time_str: asNullableString(event.time), location: asNullableString(event.venue), platform: asNullableString(event.platform), category: event.category.trim(), participants: event.participants ?? null, beneficiaries: event.beneficiaries ?? null, collaborators: event.collaborators ?? [], registration_link: asNullableString(event.registrationLink), cover_image: asNullableString(event.coverImage ?? event.image), images: event.images ?? [], description: asNullableString(event.description), short_description: asNullableString(event.shortDescription), detailed_description: asNullableString(event.detailedDescription), source: event.source ?? "cms", status: event.published === false ? "DRAFT" : "PUBLISHED" }).select().single();
    if (error) throw new Error(`Could not create historical event: ${error.message}`); await audit(client, actor, "CREATE", "Historical Event", String(data.id), `Created ${data.title}.`); return mapEvent(data as Record<string, unknown>);
  }

  static async updateEvent(id: string, event: Partial<EventItem>, actor?: { id?: string; email?: string }): Promise<EventItem> {
    const client = getCMSClient(); const updates = { ...(event.title !== undefined ? { title: event.title.trim(), slug: event.slug?.trim() || undefined } : event.slug !== undefined ? { slug: event.slug.trim() } : {}), ...(event.folderId !== undefined ? { folder_id: asNullableString(event.folderId) } : {}), ...(event.date !== undefined ? { date: asNullableString(event.date) } : {}), ...(event.time !== undefined ? { time_str: asNullableString(event.time) } : {}), ...(event.venue !== undefined ? { location: asNullableString(event.venue) } : {}), ...(event.platform !== undefined ? { platform: asNullableString(event.platform) } : {}), ...(event.category !== undefined ? { category: event.category.trim() } : {}), ...(event.participants !== undefined ? { participants: event.participants } : {}), ...(event.beneficiaries !== undefined ? { beneficiaries: event.beneficiaries } : {}), ...(event.collaborators !== undefined ? { collaborators: event.collaborators } : {}), ...(event.registrationLink !== undefined ? { registration_link: asNullableString(event.registrationLink) } : {}), ...(event.coverImage !== undefined || event.image !== undefined ? { cover_image: asNullableString(event.coverImage ?? event.image) } : {}), ...(event.images !== undefined ? { images: event.images } : {}), ...(event.description !== undefined ? { description: asNullableString(event.description) } : {}), ...(event.shortDescription !== undefined ? { short_description: asNullableString(event.shortDescription) } : {}), ...(event.detailedDescription !== undefined ? { detailed_description: asNullableString(event.detailedDescription) } : {}), ...(event.source !== undefined ? { source: event.source } : {}), ...(event.published !== undefined ? { status: event.published ? "PUBLISHED" : "DRAFT" } : {}), updated_at: new Date().toISOString() };
    const { data, error } = await client.from("historical_events").update(updates).eq("id", id).select().single(); if (error) throw new Error(`Could not update historical event: ${error.message}`); await audit(client, actor, "UPDATE", "Historical Event", id, `Updated ${data.title}.`); return mapEvent(data as Record<string, unknown>);
  }

  static async deleteEvent(id: string, actor?: { id?: string; email?: string }): Promise<void> {
    const client = getCMSClient(); const { error } = await client.from("historical_events").delete().eq("id", id); if (error) throw new Error(`Could not delete historical event: ${error.message}`); await audit(client, actor, "DELETE", "Historical Event", id);
  }

  static async getFAQs(includeUnpublished = false): Promise<FAQItem[]> {
    const client = getCMSClient(); let query = client.from("faqs").select("*").order("display_order", { ascending: true }); if (!includeUnpublished) query = query.eq("is_published", true); const { data, error } = await query; if (error) throw new Error(`Could not load FAQs: ${error.message}`); return (data ?? []).map((row) => mapFaq(row as Record<string, unknown>));
  }

  static async addFAQ(faq: Omit<FAQItem, "id">, actor?: { id?: string; email?: string }): Promise<FAQItem> {
    const client = getCMSClient(); const { data, error } = await client.from("faqs").insert({ id: crypto.randomUUID(), question: faq.question.trim(), answer: faq.answer.trim(), category: faq.category.trim(), display_order: faq.order ?? 0, is_published: faq.published ?? true }).select().single(); if (error) throw new Error(`Could not create FAQ: ${error.message}`); await audit(client, actor, "CREATE", "FAQ", String(data.id), "Created FAQ."); return mapFaq(data as Record<string, unknown>);
  }

  static async updateFAQ(id: string, faq: Partial<FAQItem>, actor?: { id?: string; email?: string }): Promise<FAQItem> {
    const client = getCMSClient(); const updates = { ...(faq.question !== undefined ? { question: faq.question.trim() } : {}), ...(faq.answer !== undefined ? { answer: faq.answer.trim() } : {}), ...(faq.category !== undefined ? { category: faq.category.trim() } : {}), ...(faq.order !== undefined ? { display_order: faq.order } : {}), ...(faq.published !== undefined ? { is_published: faq.published } : {}) }; const { data, error } = await client.from("faqs").update(updates).eq("id", id).select().single(); if (error) throw new Error(`Could not update FAQ: ${error.message}`); await audit(client, actor, "UPDATE", "FAQ", id); return mapFaq(data as Record<string, unknown>);
  }

  static async deleteFAQ(id: string, actor?: { id?: string; email?: string }): Promise<void> {
    const client = getCMSClient(); const { error } = await client.from("faqs").delete().eq("id", id); if (error) throw new Error(`Could not delete FAQ: ${error.message}`); await audit(client, actor, "DELETE", "FAQ", id);
  }

  static async getGallery(): Promise<MediaItem[]> {
    const client = getCMSClient(); const { data, error } = await client.from("media_assets").select("*").order("created_at", { ascending: false }); if (error) throw new Error(`Could not load media: ${error.message}`); return (data ?? []).map((row) => mapMedia(row as Record<string, unknown>));
  }

  static async addMedia(media: Omit<MediaItem, "id">, actor?: { id?: string; email?: string }): Promise<MediaItem> {
    const client = getCMSClient(); const { data, error } = await client.from("media_assets").insert({ filename: media.name.trim(), url: media.url.trim(), category: media.category, created_at: media.uploadedAt || new Date().toISOString() }).select().single(); if (error) throw new Error(`Could not create media: ${error.message}`); await audit(client, actor, "CREATE", "Media", String(data.id), `Added ${data.filename}.`); return mapMedia(data as Record<string, unknown>);
  }

  static async deleteMedia(id: string, actor?: { id?: string; email?: string }): Promise<void> {
    const client = getCMSClient(); const { error } = await client.from("media_assets").delete().eq("id", id); if (error) throw new Error(`Could not delete media: ${error.message}`); await audit(client, actor, "DELETE", "Media", id);
  }

  static async getUsers(): Promise<UserAccount[]> {
    const client = getCMSClient(); const { data, error } = await client.from("profiles").select("*").order("created_at", { ascending: true }); if (error) throw new Error(`Could not load users: ${error.message}`); return (data ?? []).map((row: Record<string, unknown>) => ({ id: String(row.id), name: String(row.full_name ?? ""), email: String(row.email ?? ""), role: String(row.role ?? "VIEWER") as Role, status: row.is_active === false ? "Disabled" : "Active", lastLogin: asNullableString(row.last_login) ?? undefined, createdDate: String(row.created_at ?? "") }));
  }

  static async updateUserRole(userId: string, newRole: Role, actor?: { id?: string; email?: string }): Promise<void> {
    const client = getCMSClient(); const { data: owners, error: ownerError } = await client.from("profiles").select("id").eq("role", "OWNER"); if (ownerError) throw new Error(`Could not verify owner roles: ${ownerError.message}`); if (newRole !== "OWNER" && owners?.some((owner) => owner.id === userId) && owners.length <= 1) throw new Error("Cannot downgrade the only OWNER account."); const { error } = await client.from("profiles").update({ role: newRole }).eq("id", userId); if (error) throw new Error(`Could not update user role: ${error.message}`); await audit(client, actor, "USER_ROLE_CHANGE", "User", userId, `Changed role to ${newRole}.`);
  }

  static async getAuditLogs(): Promise<AuditLogItem[]> {
    const client = getCMSClient(); const { data, error } = await client.from("audit_logs").select("*").order("created_at", { ascending: false }); if (error) throw new Error(`Could not load audit log: ${error.message}`); return (data ?? []).map((row) => mapAudit(row as Record<string, unknown>));
  }

  static async getConfig(): Promise<SiteConfig | null> {
    const client = getCMSClient(); const { data, error } = await client.from("site_settings").select("*").eq("id", "global").maybeSingle(); if (error) throw new Error(`Could not load site configuration: ${error.message}`); return data ? mapConfig(data as Record<string, unknown>) : null;
  }

  static async updateConfig(config: Partial<SiteConfig>, actor?: { id?: string; email?: string }): Promise<SiteConfig> {
    const client = getCMSClient(); const updates = { id: "global", ...(config.universityAddress !== undefined ? { university_address: config.universityAddress.trim() } : {}), ...(config.phone !== undefined ? { phone: config.phone.trim() } : {}), ...(config.email !== undefined ? { email: config.email.trim() } : {}), ...(config.membershipFormUrl !== undefined ? { membership_form_url: config.membershipFormUrl.trim() } : {}), ...(config.instagram !== undefined ? { instagram: asNullableString(config.instagram) } : {}), ...(config.linkedin !== undefined ? { linkedin: asNullableString(config.linkedin) } : {}), ...(config.youtube !== undefined ? { youtube: asNullableString(config.youtube) } : {}), ...(config.googleSheetsMembersUrl !== undefined ? { google_sheets_members_id: asNullableString(config.googleSheetsMembersUrl) } : {}), ...(config.googleSheetsProjectsUrl !== undefined ? { google_sheets_projects_id: asNullableString(config.googleSheetsProjectsUrl) } : {}), ...(config.googleSheetsBodUrl !== undefined ? { google_sheets_bod_id: asNullableString(config.googleSheetsBodUrl) } : {}), ...(config.googleCalendarId !== undefined ? { google_calendar_id: asNullableString(config.googleCalendarId) } : {}), updated_at: new Date().toISOString() }; const { data, error } = await client.from("site_settings").upsert(updates).select().single(); if (error) throw new Error(`Could not update site configuration: ${error.message}`); await audit(client, actor, "CONFIG_UPDATE", "Settings", "global"); return mapConfig(data as Record<string, unknown>);
  }
}
