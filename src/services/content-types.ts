export interface GalleryItem {
  id: string;
  title: string;
  category: "Events" | "Community" | "Leadership" | "Cultural";
  image: string;
  date: string;
  description: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  image: string;
  linkedin?: string;
  email?: string;
  quote?: string;
  bio?: string;
  category?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  impactMetric: string;
  image: string;
  tags: string[];
  year: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  iconName?: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  batch: string;
  content: string;
  avatar?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

