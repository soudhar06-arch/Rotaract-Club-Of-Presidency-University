export const siteConfig = {
  name: "Rotaract Club Platform",
  shortName: "Rotaract",
  description:
    "Official digital platform for the Rotaract Club of Presidency University showcasing community impact, events, leadership, and AI-powered knowledge base.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://rotaract-presidency.org",
  ogImage: "/images/og-image.png",
  links: {
    instagram: "https://instagram.com/rotaract_pu",
    linkedin: "https://linkedin.com/company/rotaract-pu",
    email: "contact@rotaract-presidency.org",
  },
  author: "Rotaract Club of Presidency University",
} as const;

export type SiteConfig = typeof siteConfig;
