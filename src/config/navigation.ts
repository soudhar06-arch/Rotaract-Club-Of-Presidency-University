export interface NavItemConfig {
  id: string;
  label: string;
  /** The href used by the <a> element */
  route: string;
  /** If set, this is a homepage section (scroll-spy target) */
  sectionId?: string;
  /** If set, this is a standalone page route (for active-state matching) */
  pageRoute?: string;
  type: "section" | "page";
}

/**
 * Single source of truth for all navigation items.
 *
 * type "section" — lives on the homepage as a scroll section.
 *   route       = hash anchor that works from any page (e.g. "/#about")
 *   sectionId   = DOM id of the section element on the homepage
 *
 * type "page" — has its own dedicated route (/events, /gallery, etc.)
 *   route       = canonical page URL
 *   pageRoute   = same as route; used for active-state prefix matching
 *   sectionId   = optional homepage section id (so clicking from /home still
 *                 smooth-scrolls to the right section when already on "/")
 */
export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "hero",
    label: "Home",
    route: "/",
    sectionId: "hero",
    type: "section",
  },
  {
    id: "about",
    label: "About",
    route: "/#about",
    sectionId: "about",
    type: "section",
  },
  {
    id: "avenues",
    label: "Avenues",
    route: "/#avenues",
    sectionId: "avenues",
    type: "section",
  },
  {
    id: "events",
    label: "Events",
    route: "/events",
    pageRoute: "/events",
    sectionId: "events",
    type: "page",
  },
  {
    id: "leadership",
    label: "Leadership",
    route: "/board",
    pageRoute: "/board",
    sectionId: "leadership",
    type: "page",
  },
  {
    id: "gallery",
    label: "Gallery",
    route: "/gallery",
    pageRoute: "/gallery",
    sectionId: "gallery",
    type: "page",
  },
  {
    id: "faq",
    label: "FAQ",
    route: "/#faq",
    sectionId: "faq",
    type: "section",
  },
];
