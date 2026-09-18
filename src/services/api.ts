import {
  MOCK_PROJECTS,
  MOCK_GALLERY,
  MOCK_BOARD,
  MOCK_TIMELINE,
  MOCK_TESTIMONIALS,
  MOCK_AWARDS,
  Project,
  GalleryItem,
  BoardMember,
  Milestone,
  Testimonial,
  Award,
} from "./mock-data";

import {
  fetchGoogleCalendarEvents,
  CalendarEvent,
} from "@/lib/google-calendar";

export async function fetchEvents(): Promise<CalendarEvent[]> {
  return fetchGoogleCalendarEvents();
}

export async function fetchProjects(): Promise<Project[]> {
  return MOCK_PROJECTS;
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  return MOCK_GALLERY;
}

export async function fetchBoardMembers(): Promise<BoardMember[]> {
  return MOCK_BOARD;
}

export async function fetchTimeline(): Promise<Milestone[]> {
  return MOCK_TIMELINE;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return MOCK_TESTIMONIALS;
}

export async function fetchAwards(): Promise<Award[]> {
  return MOCK_AWARDS;
}

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
  // Future Supabase: await supabase.from('collaborations').insert(formData);
  console.log("Submitted Collaboration Request:", formData);
  return {
    success: true,
    message:
      "Thank you for reaching out! Our partnerships team will connect with you within 24-48 hours.",
  };
}
