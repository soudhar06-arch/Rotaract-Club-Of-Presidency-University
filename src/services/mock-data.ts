import { CalendarEvent, ClubEvent } from "@/lib/google-calendar";
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
  department: string;
  image: string;
  linkedin?: string;
  email?: string;
  quote?: string;
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

export const OFFICIAL_CLUB_NAME = "Rotaract Club of Presidency University";
export const CLUB_DISTRICT = "Rotaract District 3191";
export const SPONSOR_ROTARY = "Rotary Club of Bangalore";

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

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Project Raksha - Annual Mega Blood Drive",
    category: "Community Service",
    summary:
      "Collected 450+ units of life-saving blood in collaboration with Bowring & Lady Curzon Hospital.",
    description:
      "Project Raksha is our annual flagship community health drive, mobilizing over 1,200 student and faculty volunteers across Presidency University to address critical blood bank shortages in Bengaluru.",
    impactMetric: "450+ Units Collected",
    image: "/gallery/gallery-1.jpeg",
    tags: ["Health", "Community Service", "Flagship"],
    year: "2026",
  },
  {
    id: "proj-2",
    title: "Vidyadhana - Educational Empowerment",
    category: "Youth Empowerment",
    summary:
      "Constructed digital learning labs and donated study kits to 3 government primary schools.",
    description:
      "Empowering underprivileged children through digital literacy workshops, career orientation, and comprehensive educational materials.",
    impactMetric: "850+ Students Impacted",
    image: "/gallery/gallery-2.jpg",
    tags: ["Education", "Youth", "Social Good"],
    year: "2025",
  },
  {
    id: "proj-3",
    title: "Green Canvas - Urban Reforestation",
    category: "Environment",
    summary:
      "Planted 2,000+ native saplings using the Miyawaki forest technique around Rajanukunte.",
    description:
      "An environmental sustainability initiative aimed at expanding Bengaluru's green canopy and creating self-sustaining urban micro-forests.",
    impactMetric: "2,000+ Trees Planted",
    image: "/gallery/gallery-3.jpeg",
    tags: ["Environment", "Sustainability"],
    year: "2025",
  },
  {
    id: "proj-4",
    title: "Leadership Summit 2026",
    category: "Professional Growth",
    summary:
      "National youth leadership conference hosting 15 industry leaders and 600 delegates.",
    description:
      "An intensive two-day summit equipping future leaders with workshops on AI governance, public speaking, entrepreneurship, and ethics.",
    impactMetric: "600+ Delegates",
    image: "/gallery/gallery-4.jpeg",
    tags: ["Leadership", "Professional"],
    year: "2026",
  },
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Charter Installation Night",
    category: "Leadership",
    image: "/gallery/gallery-1.jpeg",
    date: "July 2026",
    description: "Formal inauguration of the Rotaract Board of Directors.",
  },
  {
    id: "g2",
    title: "Community Service Drive",
    category: "Community",
    image: "/gallery/gallery-2.jpg",
    date: "June 2026",
    description: "Distribution of essential kits to rural families.",
  },
  {
    id: "g3",
    title: "Rotaract District Assembly",
    category: "Events",
    image: "/gallery/gallery-3.jpeg",
    date: "May 2026",
    description: "Representing Presidency University at District 3191.",
  },
  {
    id: "g4",
    title: "Youth Reforestation Project",
    category: "Community",
    image: "/gallery/gallery-4.jpeg",
    date: "April 2026",
    description: "Planting saplings with university volunteers.",
  },
  {
    id: "g5",
    title: "Annual Sports Fellowship",
    category: "Events",
    image: "/gallery/gallery-5.jpeg",
    date: "March 2026",
    description: "Inter-club sports tournament and team building.",
  },
  {
    id: "g6",
    title: "Professional Growth Seminar",
    category: "Leadership",
    image: "/gallery/gallery-6.jpeg",
    date: "February 2026",
    description: "Workshop on public speaking and management.",
  },
  {
    id: "g7",
    title: "Blood Donation Drive",
    category: "Community",
    image: "/gallery/gallery-7.jpeg",
    date: "January 2026",
    description: "Student blood donors at campus drive.",
  },
  {
    id: "g8",
    title: "International Youth Exchange",
    category: "Events",
    image: "/gallery/gallery-8.jpeg",
    date: "December 2025",
    description: "Hosting international Rotaractors from RID 3220.",
  },
  {
    id: "g9",
    title: "Cultural Festival & Performance",
    category: "Cultural",
    image: "/gallery/gallery-9.jpeg",
    date: "November 2025",
    description: "Celebrating Indian heritage through music and dance.",
  },
];

export const MOCK_BOARD: BoardMember[] = [
  {
    id: "b1",
    name: "Aarav Sharma",
    role: "President",
    department: "School of Engineering",
    image: "/gallery/gallery-10.jpeg",
    linkedin: "https://linkedin.com",
    email: "president.rotaract@presidencyuniversity.in",
    quote:
      "Leadership is about empowering every member to create an indelible mark of positive service.",
  },
  {
    id: "b2",
    name: "Ananya Rao",
    role: "Vice President",
    department: "School of Management",
    image: "/gallery/gallery-11.jpeg",
    linkedin: "https://linkedin.com",
    email: "vp.rotaract@presidencyuniversity.in",
    quote: "Service above self guides every strategic initiative we execute.",
  },
  {
    id: "b3",
    name: "Rohan Kulkarni",
    role: "Club Secretary",
    department: "School of Computer Science",
    image: "/gallery/gallery-12.jpeg",
    linkedin: "https://linkedin.com",
    email: "secretary.rotaract@presidencyuniversity.in",
    quote:
      "Precision, dedication, and transparency define our operational excellence.",
  },
  {
    id: "b4",
    name: "Neha Patel",
    role: "Director of Community Service",
    department: "School of Design",
    image: "/gallery/gallery-13.jpeg",
    linkedin: "https://linkedin.com",
    email: "community.rotaract@presidencyuniversity.in",
    quote:
      "True impact begins when empathy transforms into organized collective action.",
  },
];

export const MOCK_TIMELINE: Milestone[] = [
  {
    year: "2023",
    title: "Official Chartering",
    description:
      "Chartered under Rotary Club of Bangalore with 40 founding members at Presidency University.",
  },
  {
    year: "2024",
    title: "Best New Club Award",
    description:
      "Recognized as the Outstanding Charter Club across Rotaract District 3191.",
  },
  {
    year: "2025",
    title: "50+ Impact Projects",
    description:
      "Crossed 5,000+ volunteer service hours and impacted over 10,000 individuals.",
  },
  {
    year: "2026",
    title: "Digital & Global Scale",
    description:
      "Pioneering digital-first youth initiatives, international exchanges, and university-wide leadership summits.",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Vikram Nair",
    role: "Charter President (Alumnus)",
    batch: "Class of 2024",
    content:
      "Rotaract Presidency wasn't just a university club—it was the defining furnace where I learned public governance, crisis leadership, and team management.",
  },
  {
    id: "t2",
    author: "Priya Sundaram",
    role: "Director of International Service",
    batch: "Class of 2025",
    content:
      "Building global exchange ties with clubs in Sri Lanka and Singapore gave me perspective that no classroom lecture could ever replicate.",
  },
  {
    id: "t3",
    author: "Karan Mehta",
    role: "Lead Project Coordinator",
    batch: "Class of 2026",
    content:
      "Organizing Project Raksha taught me real-world logistics, sponsor negotiation, and team execution at scale.",
  },
];

export const MOCK_AWARDS: Award[] = [
  {
    id: "a1",
    title: "Best Community Service Project",
    organization: "Rotaract District 3191 Assembly",
    year: "2025 - 2026",
    description:
      "Awarded for Project Raksha Mega Blood Drive collecting 450+ units.",
  },
  {
    id: "a2",
    title: "Platinum Club Citation",
    organization: "Rotary International",
    year: "2024 - 2025",
    description:
      "Conferred for achieving excellence across all five avenues of Rotaract service.",
  },
  {
    id: "a3",
    title: "Youth Leadership Excellence Award",
    organization: "Presidency University Annual Leadership Summit",
    year: "2025",
    description:
      "Recognized as the top student organization for student development and social responsibility.",
  },
];
