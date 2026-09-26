import type { Project, GalleryItem, BoardMember, Milestone, Testimonial, Award } from "./content-types";
import { fetchGoogleCalendarEvents, type CalendarEvent } from "@/lib/google-calendar";
async function read<T>(module: string): Promise<T[]> {
  const response = await fetch(`/api/cms?module=${module}`, { cache: "no-store" });
  const result = await response.json();
  if (!result.success) throw new Error("Content is temporarily unavailable.");
  return result.data;
}
export async function fetchEvents(): Promise<CalendarEvent[]> { return fetchGoogleCalendarEvents(); }
export async function fetchProjects(): Promise<Project[]> { return read<Project>("projects"); }
export async function fetchGallery(): Promise<GalleryItem[]> { return read<GalleryItem>("gallery"); }
export async function fetchBoardMembers(): Promise<BoardMember[]> { return read<BoardMember>("bod"); }
export async function fetchTimeline(): Promise<Milestone[]> { return read<Milestone>("timeline"); }
export async function fetchTestimonials(): Promise<Testimonial[]> { return read<Testimonial>("testimonials"); }
export async function fetchAwards(): Promise<Award[]> { return read<Award>("awards"); }

export async function submitJoinApplication(
  formData: Record<string, unknown>
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to submit application.");
  }
  return data;
}

export async function submitCollaborationRequest(
  formData: Record<string, unknown>,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.orgName || formData.name, email: formData.email, subject: "Collaboration", message: formData.proposal || formData.message }) });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.error || "Message could not be delivered.");
  return { success: true, message: "Your proposal has been submitted." };
}
