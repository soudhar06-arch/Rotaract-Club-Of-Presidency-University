export const siteConfig = {
  name: "Rotaract Club of Presidency University",
  shortName: "Rotaract Presidency",
  description:
    "The official digital platform of the Rotaract Club of Presidency University. Dedicated to youth leadership, community impact, global fellowship, and innovation under Rotary District 3191.",
  url:
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rotaract.presidencyuniversity.in",
  ogImage: "/logos/club_logo.svg",
  links: {
    instagram: "https://instagram.com/rotaract_pu",
    linkedin: "https://linkedin.com/company/rotaract-pu",
    email: "rotaract@presidencyuniversity.in",
  },
  author: "Rotaract Club of Presidency University",
} as const;

export type SiteConfig = typeof siteConfig;
