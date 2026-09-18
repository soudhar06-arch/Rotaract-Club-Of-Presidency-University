import { CalendarEvent, ClubEvent } from "@/lib/google-calendar";
import clubData from "@/data/club.json";
import bodData from "@/data/bod.json";
import projectsData from "@/data/projects.json";
import eventsData from "@/data/events.json";
import timelineData from "@/data/timeline.json";
import partnersData from "@/data/partners.json";

export type { CalendarEvent, ClubEvent };

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

export const OFFICIAL_CLUB_NAME = clubData.name;
export const CLUB_DISTRICT = clubData.rotaryDistrict;
export const SPONSOR_ROTARY = clubData.partnerRotaryClub;

export const HERO_GALLERY_IMAGES = [
  "/gallery/gallery-1.jpeg",
  "/gallery/gallery-2.jpg",
  "/gallery/gallery-3.jpeg",
  "/gallery/gallery-4.jpeg",
  "/gallery/gallery-5.jpeg",
  "/gallery/gallery-6.jpeg",
  "/gallery/gallery-7.jpeg",
  "/gallery/gallery-8.jpeg",
  "/gallery/gallery-9.jpeg",
  "/gallery/gallery-10.jpeg",
  "/gallery/gallery-11.jpeg",
  "/gallery/gallery-12.jpeg",
  "/gallery/gallery-13.jpeg",
];

export const MOCK_PROJECTS: Project[] = projectsData.map((proj) => ({
  id: proj.id,
  title: proj.title,
  category: proj.category,
  summary: proj.description,
  description: `${proj.description} ${proj.objective ? `Objective: ${proj.objective}` : ""}`,
  impactMetric: proj.beneficiaries
    ? `${proj.beneficiaries} Beneficiaries`
    : proj.participants
    ? `${proj.participants} Participants`
    : "Community Impact",
  image: proj.image,
  tags: [proj.category, "Flagship"],
  year: proj.date ? proj.date.substring(0, 4) : "2026",
}));

export const MOCK_BOARD_MEMBERS: BoardMember[] = bodData.map((mem) => ({
  id: mem.id,
  name: mem.name,
  role: mem.role,
  department: "Presidency University",
  image: mem.image,
  bio: mem.bio,
  quote: mem.quote,
  category: mem.category,
}));

export const MOCK_MILESTONES: Milestone[] = timelineData.map((m) => ({
  year: m.year,
  title: m.title,
  description: m.description,
  category: m.category,
}));

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Petals of Power Women's Day Initiative",
    category: "Community",
    image: "/gallery/gallery-1.jpeg",
    date: "14 March 2026",
    description: "Women's empowerment and community awareness drive on campus.",
  },
  {
    id: "g2",
    title: "Annual Mega Blood Donation Camp",
    category: "Community",
    image: "/gallery/gallery-2.jpg",
    date: "14 November 2025",
    description: "Voluntary blood donation camp in collaboration with BMST and NCC Wing.",
  },
  {
    id: "g3",
    title: "Outbound R.I.D.E – Dil Se Dilli",
    category: "Leadership",
    image: "/gallery/gallery-3.jpeg",
    date: "20 February 2026",
    description: "Inter-district cultural exchange program hosted in New Delhi.",
  },
  {
    id: "g4",
    title: "CPR Training Session",
    category: "Community",
    image: "/gallery/gallery-4.jpeg",
    date: "30 January 2026",
    description: "Emergency medical response and CPR certification training on DSA Lawn.",
  },
  {
    id: "g5",
    title: "Career Catalyst Masterclass",
    category: "Leadership",
    image: "/gallery/gallery-5.jpeg",
    date: "02 April 2026",
    description: "Career development guidance session delivered by PP Rtr. Rtn. Sanjay.",
  },
  {
    id: "g6",
    title: "Art of Earth Pottery Workshop",
    category: "Cultural",
    image: "/gallery/gallery-6.jpeg",
    date: "01 February 2026",
    description: "Experiential cultural pottery workshop at Pottery Town with 17 members.",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [];

export const MOCK_AWARDS: Award[] = [
  {
    id: "award-1",
    title: "Outstanding Youth Service Charter",
    organization: "Rotary International District 3192",
    year: "2026",
    description: "Recognized for exemplary community engagement and youth leadership.",
  },
];

export const MOCK_PARTNERS = partnersData;
export const MOCK_HISTORICAL_EVENTS = eventsData;
export const MOCK_BOARD = MOCK_BOARD_MEMBERS;
export const MOCK_TIMELINE = MOCK_MILESTONES;
