import initialBodData from "@/data/bod.json";
import initialProjectsData from "@/data/projects.json";
import initialEventsData from "@/data/events.json";
import initialFaqData from "@/data/faq.json";
import initialGalleryData from "@/data/gallery.json";
import initialConfigData from "@/data/config.json";

export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Disabled";
  lastLogin: string;
  createdDate: string;
}

export interface BODMember {
  id: string;
  name: string;
  role: string;
  category: "Executive" | "Director";
  bio: string;
  quote?: string;
  image: string;
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
  date: string;
  time?: string;
  venue?: string;
  image?: string;
  coverImage: string;
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
  date: string;
  venue?: string;
  platform?: string;
  category: string;
  participants?: number;
  image?: string;
  description?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
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

// Initial Admin Users
const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr-owner-1",
    name: "Rotaract Secretariat",
    email: "rotaractcpu@gmail.com",
    role: "OWNER",
    status: "Active",
    lastLogin: new Date().toISOString(),
    createdDate: "2026-01-01",
  },
  {
    id: "usr-admin-2",
    name: "Club President",
    email: "president@rotaractcpu.org",
    role: "ADMIN",
    status: "Active",
    lastLogin: new Date().toISOString(),
    createdDate: "2026-02-15",
  },
];

// Helper to write to JSON disk files when running server-side
function saveToFile(filename: string, data: unknown) {
  try {
    if (typeof window === "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const filePath = path.join(process.cwd(), "src", "data", filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    }
  } catch (err) {
    console.error(`[CMSStore] Failed to write disk file ${filename}:`, err);
  }
}

// Global Store In-Memory State initialized from JSON base files
let currentBODStore: BODMember[] = [...(initialBodData as BODMember[])];
let currentProjectsStore: ProjectItem[] = (initialProjectsData as Array<Record<string, unknown>>).map((p) => {
  const coverImg = String(p.coverImage || p.image || "/gallery/gallery-1.jpeg");
  const rawImages = Array.isArray(p.images) ? (p.images as string[]).map(String) : [];
  const imgList = rawImages.length > 0 ? (rawImages.includes(coverImg) ? rawImages : [coverImg, ...rawImages]) : [coverImg];

  return {
    id: String(p.id || `proj-${Math.random()}`),
    title: String(p.title || ""),
    slug: String(p.slug || p.id || ""),
    shortDescription: String(p.description || p.shortDescription || ""),
    fullDescription: String(p.fullDescription || p.description || ""),
    category: String(p.category || "General"),
    date: String(p.date || ""),
    time: String(p.time || ""),
    venue: String(p.venue || "Campus"),
    image: coverImg,
    coverImage: coverImg,
    images: imgList,
    featured: Boolean(p.featured),
    published: true,
    participants: typeof p.participants === "number" ? p.participants : undefined,
    beneficiaries: typeof p.beneficiaries === "number" ? p.beneficiaries : undefined,
    volunteers: typeof p.volunteers === "number" ? p.volunteers : undefined,
    platform: String(p.platform || ""),
  };
});
let currentEventsStore: EventItem[] = [...(initialEventsData as EventItem[])];
let currentFaqStore: FAQItem[] = [...(initialFaqData as FAQItem[])];
let currentGalleryStore: MediaItem[] = [...(initialGalleryData as MediaItem[])];
let currentConfigStore: SiteConfig = { ...(initialConfigData as SiteConfig) };

const currentUsersStore: UserAccount[] = [...INITIAL_USERS];
const currentAuditLogs: AuditLogItem[] = [
  {
    id: "log-1",
    user: "Rotaract Secretariat",
    action: "SYSTEM_INIT",
    entity: "System",
    timestamp: new Date().toISOString(),
    details: "Initialized protected CMS store & disk persistence.",
  },
];

export class CMSStore {
  // BOD Operations
  static getBODMembers(): BODMember[] {
    return currentBODStore;
  }

  static addBODMember(member: Omit<BODMember, "id">): BODMember {
    const newMember: BODMember = {
      ...member,
      id: `bod-${Date.now()}`,
    };
    currentBODStore.push(newMember);
    saveToFile("bod.json", currentBODStore);
    this.addAuditLog("CREATE", "BOD Member", newMember.id, `Added member ${newMember.name} as ${newMember.role}`);
    return newMember;
  }

  static updateBODMember(id: string, updates: Partial<BODMember>): BODMember | null {
    const index = currentBODStore.findIndex((m) => m.id === id);
    if (index === -1) return null;
    currentBODStore[index] = { ...currentBODStore[index], ...updates };
    saveToFile("bod.json", currentBODStore);
    this.addAuditLog("UPDATE", "BOD Member", id, `Updated ${currentBODStore[index].name}`);
    return currentBODStore[index];
  }

  static deleteBODMember(id: string): boolean {
    const member = currentBODStore.find((m) => m.id === id);
    if (!member) return false;
    currentBODStore = currentBODStore.filter((m) => m.id !== id);
    saveToFile("bod.json", currentBODStore);
    this.addAuditLog("DELETE", "BOD Member", id, `Removed member ${member.name}`);
    return true;
  }

  // Projects Operations
  static getProjects(): ProjectItem[] {
    return currentProjectsStore;
  }

  static addProject(project: Omit<ProjectItem, "id">): ProjectItem {
    const imagesList = Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : [project.coverImage || project.image || "/gallery/gallery-1.jpeg"];
    const cover = project.coverImage || project.image || imagesList[0];

    const newProject: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      coverImage: cover,
      image: cover,
      images: imagesList.includes(cover) ? imagesList : [cover, ...imagesList],
    };
    currentProjectsStore.push(newProject);
    saveToFile("projects.json", currentProjectsStore);
    this.addAuditLog("CREATE", "Project", newProject.id, `Created project ${newProject.title}`);
    return newProject;
  }

  static updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const index = currentProjectsStore.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const merged = { ...currentProjectsStore[index], ...updates };
    const imagesList = Array.isArray(merged.images) && merged.images.length > 0
      ? merged.images
      : [merged.coverImage || merged.image || "/gallery/gallery-1.jpeg"];

    let cover = merged.coverImage || merged.image || imagesList[0];

    // If cover was removed from imagesList, pick the first image in imagesList
    if (!imagesList.includes(cover)) {
      cover = imagesList[0];
    }

    currentProjectsStore[index] = {
      ...merged,
      coverImage: cover,
      image: cover,
      images: imagesList,
    };
    saveToFile("projects.json", currentProjectsStore);
    this.addAuditLog("UPDATE", "Project", id, `Updated project ${currentProjectsStore[index].title}`);
    return currentProjectsStore[index];
  }

  static deleteProject(id: string): boolean {
    const proj = currentProjectsStore.find((p) => p.id === id);
    if (!proj) return false;
    currentProjectsStore = currentProjectsStore.filter((p) => p.id !== id);
    saveToFile("projects.json", currentProjectsStore);
    this.addAuditLog("DELETE", "Project", id, `Deleted project ${proj.title}`);
    return true;
  }

  // Historical Events Operations
  static getEvents(): EventItem[] {
    return currentEventsStore;
  }

  static addEvent(event: Omit<EventItem, "id">): EventItem {
    const newEvent: EventItem = {
      ...event,
      id: `event-${Date.now()}`,
    };
    currentEventsStore.push(newEvent);
    saveToFile("events.json", currentEventsStore);
    this.addAuditLog("CREATE", "Event", newEvent.id, `Added event ${newEvent.title}`);
    return newEvent;
  }

  static updateEvent(id: string, updates: Partial<EventItem>): EventItem | null {
    const index = currentEventsStore.findIndex((e) => e.id === id);
    if (index === -1) return null;
    currentEventsStore[index] = { ...currentEventsStore[index], ...updates };
    saveToFile("events.json", currentEventsStore);
    this.addAuditLog("UPDATE", "Event", id, `Updated event ${currentEventsStore[index].title}`);
    return currentEventsStore[index];
  }

  static deleteEvent(id: string): boolean {
    const ev = currentEventsStore.find((e) => e.id === id);
    if (!ev) return false;
    currentEventsStore = currentEventsStore.filter((e) => e.id !== id);
    saveToFile("events.json", currentEventsStore);
    this.addAuditLog("DELETE", "Event", id, `Deleted event ${ev.title}`);
    return true;
  }

  // FAQ Operations
  static getFAQs(): FAQItem[] {
    return currentFaqStore;
  }

  static addFAQ(faq: Omit<FAQItem, "id">): FAQItem {
    const newFaq: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`,
    };
    currentFaqStore.push(newFaq);
    saveToFile("faq.json", currentFaqStore);
    this.addAuditLog("CREATE", "FAQ", newFaq.id, `Added FAQ: ${newFaq.question}`);
    return newFaq;
  }

  static updateFAQ(id: string, updates: Partial<FAQItem>): FAQItem | null {
    const index = currentFaqStore.findIndex((f) => f.id === id);
    if (index === -1) return null;
    currentFaqStore[index] = { ...currentFaqStore[index], ...updates };
    saveToFile("faq.json", currentFaqStore);
    this.addAuditLog("UPDATE", "FAQ", id, `Updated FAQ: ${currentFaqStore[index].question}`);
    return currentFaqStore[index];
  }

  static deleteFAQ(id: string): boolean {
    const faq = currentFaqStore.find((f) => f.id === id);
    if (!faq) return false;
    currentFaqStore = currentFaqStore.filter((f) => f.id !== id);
    saveToFile("faq.json", currentFaqStore);
    this.addAuditLog("DELETE", "FAQ", id, `Deleted FAQ: ${faq.question}`);
    return true;
  }

  // Media / Gallery Operations
  static getGallery(): MediaItem[] {
    return currentGalleryStore;
  }

  static addMedia(media: Omit<MediaItem, "id">): MediaItem {
    const newMedia: MediaItem = {
      ...media,
      id: `gal-${Date.now()}`,
    };
    currentGalleryStore.unshift(newMedia);
    saveToFile("gallery.json", currentGalleryStore);
    this.addAuditLog("CREATE", "Media", newMedia.id, `Uploaded media: ${newMedia.name}`);
    return newMedia;
  }

  static deleteMedia(id: string): boolean {
    const item = currentGalleryStore.find((g) => g.id === id);
    if (!item) return false;
    currentGalleryStore = currentGalleryStore.filter((g) => g.id !== id);
    saveToFile("gallery.json", currentGalleryStore);
    this.addAuditLog("DELETE", "Media", id, `Deleted media: ${item.name}`);
    return true;
  }

  // User Management
  static getUsers(): UserAccount[] {
    return currentUsersStore;
  }

  static updateUserRole(userId: string, newRole: Role): boolean {
    const user = currentUsersStore.find((u) => u.id === userId);
    if (!user) return false;

    if (user.role === "OWNER") {
      const ownerCount = currentUsersStore.filter((u) => u.role === "OWNER").length;
      if (ownerCount <= 1 && newRole !== "OWNER") {
        throw new Error("Cannot downgrade the primary OWNER account.");
      }
    }

    user.role = newRole;
    this.addAuditLog("USER_ROLE_CHANGE", "User", userId, `Changed role of ${user.email} to ${newRole}`);
    return true;
  }

  // Audit Logging
  static getAuditLogs(): AuditLogItem[] {
    return currentAuditLogs;
  }

  static addAuditLog(action: string, entity: string, entityId?: string, details?: string, user = "Admin") {
    currentAuditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      details,
    });
  }

  // Site Config
  static getConfig(): SiteConfig {
    return currentConfigStore;
  }

  static updateConfig(updates: Partial<SiteConfig>): SiteConfig {
    currentConfigStore = { ...currentConfigStore, ...updates };
    saveToFile("config.json", currentConfigStore);
    this.addAuditLog("CONFIG_UPDATE", "Settings", "global", "Updated site configuration & contact settings");
    return currentConfigStore;
  }
}
