export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PROJECTS: "/projects",
  EVENTS: "/events",
  GALLERY: "/gallery",
  AWARDS: "/awards",
  BOARD: "/board",
  COLLABORATIONS: "/collaborations",
  COLLABORATE: "/collaborate",
  CONTACT: "/contact",
  JOIN: "/join",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  ADMIN: {
    DASHBOARD: "/dashboard",
    EVENTS: "/dashboard/events",
    GALLERY: "/dashboard/gallery",
    BOD: "/dashboard/bod",
    AWARDS: "/dashboard/awards",
    COLLABORATIONS: "/dashboard/collaborations",
    APPLICATIONS: "/dashboard/applications",
    KNOWLEDGE_BASE: "/dashboard/knowledge-base",
    SETTINGS: "/dashboard/settings",
  },
} as const;

export type AppRoutes = typeof ROUTES;
