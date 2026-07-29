export type UserRole = "super_admin" | "admin" | "editor" | "member" | "public";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  coverImage?: string;
  status: "draft" | "published";
  createdAt: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  order: number;
}
