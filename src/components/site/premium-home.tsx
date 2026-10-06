"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "@/components/shared/content-image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  MapPin,
  Images,
  Maximize2,
  MoveRight,
  X,
} from "lucide-react";
import { useCMS } from "@/hooks/use-cms";
import type {
  BODMember,
  ProjectItem,
  FAQItem,
  SiteConfig,
  MediaItem,
} from "@/lib/cms-store";
import { ProjectSlideshow } from "@/components/shared/project-slideshow";
import clubData from "@/data/club.json";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { CountUp } from "@/components/shared/count-up";
import { type CalendarEvent } from "@/lib/google-calendar";

export interface AvenueImageItem {
  url: string;
  caption: string;
}

export interface AvenueItem {
  id: string;
  name: string;
  label: string;
  description: string;
  details: string;
  images: AvenueImageItem[];
}

const AVENUES: AvenueItem[] = [
  {
    id: "community",
    name: "Community Service",
    label: "Service",
    description:
      "Public health, outreach and on-ground action that translates volunteer energy into measurable community aid.",
    details:
      "Our flagship avenue drives impactful initiatives such as annual blood donation drives, free medical screening camps, environmental tree plantation drives, and educational support for underprivileged students.",
    images: [
      {
        url: "/gallery/gallery-2.jpg",
        caption: "Public health & blood donation camp",
      },
      {
        url: "/gallery/gallery-1.jpeg",
        caption: "On-ground volunteer outreach & aid distribution",
      },
      {
        url: "/gallery/gallery-8.jpeg",
        caption: "Cleanliness drive & eco-sustainability action",
      },
    ],
  },
  {
    id: "professional",
    name: "Professional Development",
    label: "Growth",
    description:
      "Skill building, career support and leadership sessions designed to create confident, capable student professionals.",
    details:
      "Empowering members through corporate mentorship, resume refinement bootcamps, public speaking forums, industry panel discussions, and career navigation summits.",
    images: [
      {
        url: "/gallery/gallery-4.jpeg",
        caption: "Leadership workshop & career strategy session",
      },
      {
        url: "/gallery/gallery-9.jpeg",
        caption: "Keynote panel with corporate leaders",
      },
      {
        url: "/gallery/gallery-10.jpeg",
        caption: "Skill enhancement bootcamp & team debate",
      },
    ],
  },
  {
    id: "fellowship",
    name: "Fellowship",
    label: "Belonging",
    description:
      "Moments of connection, culture and shared momentum that shape a resilient and vibrant club culture.",
    details:
      "Fostering lifelong friendships and team cohesion through cultural festivals, sports leagues, new member orientation assemblies, icebreakers, and annual retreats.",
    images: [
      {
        url: "/gallery/gallery-7.jpeg",
        caption: "Annual club orientation & team icebreakers",
      },
      {
        url: "/gallery/gallery-11.jpeg",
        caption: "Cultural celebration & fellowship night",
      },
      {
        url: "/gallery/gallery-12.jpeg",
        caption: "Sports league & member retreat",
      },
    ],
  },
  {
    id: "international",
    name: "International Service",
    label: "Global",
    description:
      "Cross-border understanding, cultural exchange and service conversations that expand our perspective beyond campus.",
    details:
      "Collaborating with international Rotaract chapters to host cross-cultural exchanges, global youth forums, UN Sustainable Development Goal (SDG) awareness, and peace assemblies.",
    images: [
      {
        url: "/gallery/gallery-3.jpeg",
        caption: "Global youth exchange & cultural forum",
      },
      {
        url: "/gallery/gallery-13.jpeg",
        caption: "International Rotaract district exchange",
      },
      {
        url: "/gallery/gallery-1.jpeg",
        caption: "Peace assembly & UN SDG dialogue",
      },
    ],
  },
  {
    id: "club",
    name: "Club Service",
    label: "Systems",
    description:
      "The operational heart of RCPU: organizing, executing and creating the infrastructure behind every successful initiative.",
    details:
      "Managing general body meetings, venue bookings, event logistics, member directory tracking, and administrative governance to power club operations seamlessly.",
    images: [
      {
        url: "/gallery/gallery-5.jpeg",
        caption: "Operational strategy & board planning",
      },
      {
        url: "/gallery/gallery-6.jpeg",
        caption: "General body assembly & event execution",
      },
      {
        url: "/gallery/gallery-8.jpeg",
        caption: "Logistics coordination & member onboarding",
      },
    ],
  },
  {
    id: "pr",
    name: "Public Relations",
    label: "Voice",
    description:
      "Storytelling, visibility and narrative design that helps bring our cause into the public conversation with clarity.",
    details:
      "Crafting digital media campaigns, newsletter publications, social media storytelling, press releases, and campus visibility drives.",
    images: [
      {
        url: "/gallery/gallery-6.jpeg",
        caption: "Public relations campaign & media outreach",
      },
      {
        url: "/gallery/gallery-9.jpeg",
        caption: "Digital content creation & branding",
      },
      {
        url: "/gallery/gallery-2.jpg",
        caption: "Campus awareness & press coverage",
      },
    ],
  },
];

const PUBLIC_PROJECT_COUNT = 24;
const PUBLIC_BOD_COUNT = 43;

function shuffledPhotoIndexes(count: number, avoidFirst?: number) {
  const indexes = Array.from({ length: count }, (_, index) => index);
  for (let index = indexes.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[randomIndex]] = [
      indexes[randomIndex],
      indexes[index],
    ];
  }
  if (count > 1 && indexes[0] === avoidFirst) {
    const replacementIndex = 1 + Math.floor(Math.random() * (count - 1));
    [indexes[0], indexes[replacementIndex]] = [
      indexes[replacementIndex],
      indexes[0],
    ];
  }
  return indexes;
}

export function PremiumHomePage() {
  const { upcomingEvents, error: eventsError } = useCalendarEvents(true);
  const { data: projectsData } = useCMS<ProjectItem[]>("projects", []);
  const { data: bodData } = useCMS<BODMember[]>("bod", []);
  const { data: faqData } = useCMS<FAQItem[]>("faq", []);
  const { data: galleryData } = useCMS<MediaItem[]>("gallery", []);
  const { data: socialConfig } = useCMS<SiteConfig | null>("config", null);
  const socialData: Partial<SiteConfig> = socialConfig || {};
  const heroPhotos = useMemo(() => {
    const seenAlbums = new Set<string>();
    return galleryData.filter((photo) => {
      const albumTitle = photo.name
        .replace(/\s+(?:—|–|-)\s+photo\s+\d+$/i, "")
        .trim();
      const albumKey = albumTitle.toLowerCase();
      if (seenAlbums.has(albumKey)) return false;
      seenAlbums.add(albumKey);
      return true;
    });
  }, [galleryData]);
  const heroPhotoSignature = heroPhotos.map((photo) => photo.id).join("|");
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroSequence = useRef<number[]>([]);
  const heroSequencePosition = useRef(0);
  const heroPhoto = heroPhotos.length
    ? heroPhotos[heroImageIndex % heroPhotos.length]
    : {
        id: "hero-fallback",
        name: "RCPU team and event atmosphere",
        url: "/gallery/gallery-9.jpeg",
      };
  const [memberCount, setMemberCount] = useState<number | null>(null);
  useEffect(() => {
    heroSequence.current = shuffledPhotoIndexes(heroPhotos.length);
    heroSequencePosition.current = 0;
    setHeroImageIndex(heroSequence.current[0] ?? 0);
    if (heroPhotos.length < 2) return;

    const timer = window.setInterval(() => {
      if (heroSequencePosition.current >= heroSequence.current.length - 1) {
        const lastIndex = heroSequence.current.at(-1);
        heroSequence.current = shuffledPhotoIndexes(
          heroPhotos.length,
          lastIndex,
        );
        heroSequencePosition.current = 0;
      } else {
        heroSequencePosition.current += 1;
      }

      const nextIndex = heroSequence.current[heroSequencePosition.current];
      if (nextIndex !== undefined) setHeroImageIndex(nextIndex);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [heroPhotoSignature, heroPhotos.length]);
  useEffect(() => {
    let active = true;
    const refresh = () =>
      fetch("/api/counters", { cache: "no-store" })
        .then((r) => r.json())
        .then((r) => {
          if (active && r.success) setMemberCount(r.data.members);
        })
        .catch(() => {});
    void refresh();
    const timer = setInterval(refresh, 60000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  const statItems = [
    { value: memberCount, label: "Members" },
    { value: PUBLIC_PROJECT_COUNT, label: "Events Held" },
    { value: PUBLIC_BOD_COUNT, label: "BOD Members" },
  ];
  const [avenueItems, setAvenueItems] = useState(AVENUES);
  const [activeAvenue, setActiveAvenue] = usePersistedState(
    "rcpu_active_avenue",
    AVENUES[0],
  );
  const [avenueImageIndex, setAvenueImageIndex] = useState(0);
  const [selectedAvenueDetail, setSelectedAvenueDetail] =
    useState<AvenueItem | null>(null);

  const [selectedProject, setSelectedProject] = useState<
    (typeof projectsData)[number] | null
  >(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;
    fetch("/api/avenues", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (!mounted || !Array.isArray(result?.avenues)) return;
        const imagesByName = new Map<string, AvenueImageItem[]>(
          result.avenues
            .filter(
              (item: { name?: unknown; images?: unknown }) =>
                typeof item.name === "string" && Array.isArray(item.images),
            )
            .map((item: { name: string; images: AvenueImageItem[] }) => [
              item.name,
              item.images,
            ]),
        );
        const updated = AVENUES.map((avenue) => {
          const images = imagesByName.get(avenue.name);
          return images?.length ? { ...avenue, images } : avenue;
        });
        setAvenueItems(updated);
        setActiveAvenue(
          (current) =>
            updated.find((item) => item.name === current.name) || updated[0],
        );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [setActiveAvenue]);

  // Reset image index on active avenue change
  useEffect(() => {
    const timer = setTimeout(() => setAvenueImageIndex(0), 0);
    return () => clearTimeout(timer);
  }, [activeAvenue?.name]);

  // Automatic slideshow cycle (5 seconds)
  useEffect(() => {
    if (
      !activeAvenue ||
      !activeAvenue.images ||
      activeAvenue.images.length <= 1
    )
      return;

    const timer = setInterval(() => {
      setAvenueImageIndex((prev) => (prev + 1) % activeAvenue.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeAvenue]);

  // Global ESC Key Listener to Close Modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
        setSelectedEvent(null);
        setSelectedAvenueDetail(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNextAvenueImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeAvenue?.images?.length) return;
    setAvenueImageIndex((prev) => (prev + 1) % activeAvenue.images.length);
  };

  const handlePrevAvenueImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeAvenue?.images?.length) return;
    setAvenueImageIndex(
      (prev) =>
        (prev - 1 + activeAvenue.images.length) % activeAvenue.images.length,
    );
  };

  const editorialRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: editorialProgress } = useScroll({
    target: editorialRef,
    offset: ["start end", "end start"],
  });

  const word1Opacity = useTransform(editorialProgress, [0.15, 0.35], [0.2, 1]);
  const word1X = useTransform(editorialProgress, [0.15, 0.35], [-16, 0]);
  const word2Opacity = useTransform(editorialProgress, [0.3, 0.5], [0.2, 1]);
  const word2X = useTransform(editorialProgress, [0.3, 0.5], [-16, 0]);
  const word3Opacity = useTransform(editorialProgress, [0.45, 0.65], [0.2, 1]);
  const word3X = useTransform(editorialProgress, [0.45, 0.65], [-16, 0]);
  const word4Opacity = useTransform(editorialProgress, [0.6, 0.8], [0.2, 1]);
  const word4X = useTransform(editorialProgress, [0.6, 0.8], [-16, 0]);

  const projectHighlights = useMemo(
    () =>
      projectsData
        .filter((item) => item.featured)
        .slice(0, 3)
        .map((item) => ({
          ...item,
          category: item.category?.toLowerCase().includes("project")
            ? "Event"
            : item.category || "Event",
        })),
    [projectsData],
  );

  const defaultFaqs: FAQItem[] = [
    {
      id: "faq-default-1",
      question: "What is Rotaract?",
      answer:
        "Rotaract is a youth-led service organization that connects leadership, fellowship, and community impact through Rotary values.",
      category: "General",
    },
    {
      id: "faq-default-2",
      question: "Who can join Rotaract?",
      answer:
        "Any student who is interested in service, leadership, and personal growth can apply to be part of Rotaract.",
      category: "Membership",
    },
    {
      id: "faq-default-3",
      question: "What do members usually do?",
      answer:
        "Members take part in service projects, leadership workshops, networking events, club activities, and community outreach programs.",
      category: "Activities",
    },
    {
      id: "faq-default-4",
      question: "Why is Rotaract important?",
      answer:
        "Rotaract gives students a platform to lead, create impact, build friendships, and grow through meaningful service and collaboration.",
      category: "Impact",
    },
  ];

  const displayFaqs = faqData.length > 0 ? faqData.slice(0, 4) : defaultFaqs;

  const liveUpcoming = useMemo(
    () => upcomingEvents.slice(0, 3),
    [upcomingEvents],
  );

  const eventRows = liveUpcoming;

  const selectedEventDescription = useMemo(() => {
    if (!selectedEvent) return "";
    return (
      selectedEvent.fullDescription ||
      selectedEvent.description ||
      selectedEvent.eventDescription ||
      selectedEvent.details ||
      selectedEvent.content ||
      selectedEvent.body ||
      ""
    ).trim();
  }, [selectedEvent]);

  return (
    <div className="brand-shell">
      <section className="hero-shell">
        <div className="hero-backdrop">
          <AnimatePresence initial={false}>
            <motion.div
              key={heroPhoto.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={heroPhoto.url}
                alt={
                  heroPhoto.name.replace(/\s+[—-]\s+photo\s+\d+$/i, "") ||
                  "RCPU event photo"
                }
                fill
                priority={heroImageIndex === 0}
                sizes="100vw"
                className="object-cover opacity-65 brightness-105"
              />
            </motion.div>
          </AnimatePresence>
          <div className="hero-noise" />
          <div className="hero-vignette" />
        </div>

        <div className="hero-content">
          <div className="eyebrow-row">
            <span className="eyebrow-dot" />
            <span>Rotary District 3192 • {clubData.abbreviation}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-title"
          >
            ROTARACT
            <br />
            PRESIDENCY UNIVERSITY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hero-summary"
          >
            {clubData.shortDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hero-actions"
          >
            <Link href="/events" className="primary-button">
              Explore events
              <ArrowRight size={16} />
            </Link>
            <Link href="/join" className="secondary-button">
              Join the Club
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hero-meta"
          >
            <span>Lead.</span>
            <span>Serve.</span>
            <span>Create impact.</span>
          </motion.div>
        </div>
      </section>

      <section
        id="about"
        ref={editorialRef}
        className="section-shell editorial-shell"
      >
        <div className="editorial-label">
          WE ARE RCPU. WE ARE TEAM LEVIATHAN.
        </div>
        <div className="editorial-grid">
          <div className="editorial-copy">
            <p>One team. One vision. Limitless impact.</p>
          </div>
          <div className="editorial-words">
            <motion.span style={{ opacity: word1Opacity, x: word1X }}>
              SERVICE.
            </motion.span>
            <motion.span style={{ opacity: word2Opacity, x: word2X }}>
              LEADERSHIP.
            </motion.span>
            <motion.span style={{ opacity: word3Opacity, x: word3X }}>
              FELLOWSHIP.
            </motion.span>
            <motion.span style={{ opacity: word4Opacity, x: word4X }}>
              IMPACT.
            </motion.span>
          </div>
        </div>
        <div className="editorial-text space-y-4">
          <p>
            We are the Rotaract Club of Presidency University — Team Leviathan.
            A powerhouse of passionate young leaders, bold ideas, unstoppable
            energy, and a shared commitment to making a difference.
          </p>
          <p>
            Under Rotary International District 3192, we believe leadership is
            earned through action, service creates change, and fellowship turns
            individuals into one unstoppable team.
          </p>
          <p>
            Through Community Service, Professional Development, International
            Service, Club Service, Public Relations, Fellowship, and Sports, we
            turn ideas into initiatives, challenges into opportunities, and
            ambition into measurable impact.
          </p>
          <p>
            We are more than a club. We are a community, a family, and a force
            that moves forward together. We are RCPU. We are Leviathan. And
            we&apos;re just getting started.
          </p>
        </div>
      </section>

      <section className="section-shell impact-shell" id="impact">
        <div className="section-header-row">
          <div>
            <div className="eyebrow">Impact</div>
            <h2>Measured by action.</h2>
          </div>
          <Link href="/events" className="inline-action">
            See our events <ChevronRight size={16} />
          </Link>
        </div>

        <div className="impact-grid">
          {statItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6 }}
              className="impact-item"
            >
              <span>
                {item.value === null ? (
                  <span aria-label="Data unavailable">?</span>
                ) : (
                  <CountUp end={item.value} once={false} />
                )}
              </span>
              <small>{item.label}</small>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell avenues-shell" id="avenues">
        <div className="section-header-row compact">
          <div>
            <div className="eyebrow">Our avenues</div>
            <h2>Where energy becomes action.</h2>
          </div>
        </div>

        <div className="avenues-layout">
          <div className="avenues-list">
            {avenueItems.map((avenue) => (
              <button
                key={avenue.name}
                onClick={() => {
                  setActiveAvenue(avenue);
                  setAvenueImageIndex(0);
                }}
                className={`avenue-item rounded-2xl transition-all duration-300 ${
                  activeAvenue.name === avenue.name ? "active shadow-glow" : ""
                }`}
              >
                <span>{avenue.label}</span>
                <strong>{avenue.name}</strong>
              </button>
            ))}
          </div>

          <motion.div
            key={activeAvenue.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            onClick={() => setSelectedAvenueDetail(activeAvenue)}
            className="avenue-feature group relative flex min-h-[440px] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[#0e0e0e] shadow-xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={avenueImageIndex}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="feature-image-wrap absolute inset-0"
              >
                <Image
                  src={
                    activeAvenue.images[avenueImageIndex]?.url ||
                    activeAvenue.images[0].url
                  }
                  alt={activeAvenue.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>

            {/* Manual Image Controls & Expand Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevAvenueImage}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black active:scale-95"
                aria-label="Previous Image"
                title="Previous Image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextAvenueImage}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black active:scale-95"
                aria-label="Next Image"
                title="Next Image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="flex h-8 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 text-[11px] font-semibold text-white backdrop-blur-md">
                <Maximize2 className="h-3 w-3 text-[#3B82F6]" />
                <span>Expand</span>
              </div>
            </div>

            <div className="feature-copy relative z-10 p-6 md:p-8">
              <div className="eyebrow small">{activeAvenue.label}</div>
              <h3>{activeAvenue.name}</h3>
              <p>{activeAvenue.description}</p>
              <Link
                href={`/events?avenue=${encodeURIComponent(activeAvenue.name)}`}
                onClick={(event) => event.stopPropagation()}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/15 px-4 py-2 text-xs font-semibold text-white hover:bg-[#3B82F6]/25"
              >
                View {activeAvenue.name} events <ChevronRight size={14} />
              </Link>

              {/* Image Description / Caption */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/70 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#3B82F6]" />
                <span>
                  {activeAvenue.images[avenueImageIndex]?.caption ||
                    activeAvenue.images[0].caption}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell projects-shell" id="projects">
        <div className="section-header-row">
          <div>
            <div className="eyebrow">Events that happened</div>
            <h2>Moments that shaped us.</h2>
          </div>
          <Link href="/events" className="inline-action">
            View all events <ChevronRight size={16} />
          </Link>
        </div>

        <div className="story-list">
          {projectHighlights.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="story-item"
            >
              <div className="story-index">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="story-image-wrap">
                <Image
                  src={project.image ?? "/gallery/gallery-1.jpeg"}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover"
                />
              </div>

              <div className="story-copy">
                <div className="story-category">{project.category}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="story-meta">
                  <span>
                    {project.date
                      ? new Date(project.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "TBA"}
                  </span>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="story-link"
                  >
                    View detail <MoveRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-shell events-shell" id="events">
        {eventsError && (
          <p className="text-zinc-400">Events are temporarily unavailable.</p>
        )}
        <div className="section-header-row">
          <div>
            <div className="eyebrow">Calendar</div>
            <h2>Up next.</h2>
          </div>
          <Link href="/events" className="inline-action">
            All events <ChevronRight size={16} />
          </Link>
        </div>

        <div className="event-stack">
          {eventRows.length > 0 ? (
            eventRows.map((event, index) => (
              <motion.button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="event-row"
              >
                <div className="event-date">
                  <span>
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                    })}
                  </span>
                  <small>
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      month: "short",
                    })}
                  </small>
                </div>
                <div className="event-main">
                  <div className="event-label">{event.category}</div>
                  <h3>{event.title}</h3>
                  <div className="event-facts">
                    <span>
                      <Clock3 size={12} /> {event.time || "TBD"}
                    </span>
                    <span>
                      <MapPin size={12} />{" "}
                      {event.location || event.venue || "Campus"}
                    </span>
                  </div>
                </div>
                <div className="event-action">
                  <span>View</span>
                  <ExternalLink size={14} />
                </div>
              </motion.button>
            ))
          ) : (
            <div className="empty-panel">
              <CalendarDays size={18} />
              Live Google Calendar data is not configured yet. Add the calendar
              environment values to display upcoming events.
            </div>
          )}
        </div>
      </section>

      <section className="section-shell crew-shell" id="leadership">
        <div className="section-header-row">
          <div>
            <div className="eyebrow">Leadership</div>
            <h2>The people behind the momentum.</h2>
          </div>
          <Link href="/board" className="inline-action">
            Meet the team <ChevronRight size={16} />
          </Link>
        </div>

        {bodData.length === 0 && (
          <p className="text-zinc-400">
            Leadership information is currently unavailable.
          </p>
        )}
        <div className="leader-grid">
          {bodData.slice(0, 5).map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -5 }}
              className="leader-card"
            >
              <div className="leader-image-wrap">
                <Image
                  src={member.image || "/images/no-photo.svg"}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 250px"
                  className="object-cover"
                />
              </div>
              <div className="leader-surface">
                <div className="leader-role">{member.role}</div>
                <h3>{member.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell gallery-shell" id="gallery">
        <div className="section-header-row">
          <div>
            <div className="eyebrow">Gallery</div>
            <h2>Fragments of the story.</h2>
          </div>
          <Link href="/gallery" className="inline-action">
            See archive <ChevronRight size={16} />
          </Link>
        </div>

        {galleryData.length === 0 && (
          <p className="text-zinc-400">No published gallery images yet.</p>
        )}
        <div className="gallery-grid">
          {galleryData.slice(0, 6).map((item, index) => (
            <Link
              href="/gallery"
              key={item.id}
              className={`gallery-tile tile-${index + 1}`}
            >
              <Image
                src={item.url}
                alt={item.name || "RCPU gallery moment"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              {index === 5 && galleryData.length > 6 && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/65 text-white backdrop-blur-sm">
                  <Images size={28} className="mb-2 text-[#3B82F6]" />
                  <strong className="text-xl">
                    +{galleryData.length - 6} photos
                  </strong>
                  <span className="mt-1 text-xs text-zinc-300">
                    Open combined collection
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell faq-shell">
        <div className="section-header-row">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2>Clear answers, quick context.</h2>
          </div>
          <Link href="/faq" className="inline-action">
            Read more <ChevronRight size={16} />
          </Link>
        </div>

        <div className="faq-list">
          {displayFaqs.map((item) => (
            <div key={item.id} className="faq-item">
              <strong>{item.question}</strong>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell cta-shell">
        <div className="cta-panel">
          <div>
            <div className="eyebrow">Join us</div>
            <h2>Ready to make an impact?</h2>
          </div>
          <Link href="/join" className="primary-button">
            Apply for membership
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <AnimatePresence>
        {selectedAvenueDetail && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAvenueDetail(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="modal-card avenue-detail-modal relative overflow-hidden rounded-3xl border border-white/10 bg-[#101010]"
            >
              {/* Visible X Close Button */}
              <button
                type="button"
                onClick={() => setSelectedAvenueDetail(null)}
                className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black active:scale-95"
                aria-label="Close Avenue Modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="modal-visual relative min-h-[280px]">
                <Image
                  src={
                    selectedAvenueDetail.images[0]?.url ||
                    "/gallery/gallery-1.jpeg"
                  }
                  alt={selectedAvenueDetail.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
              </div>

              <div className="modal-copy p-6 md:p-8">
                <div className="eyebrow small">
                  {selectedAvenueDetail.label}
                </div>
                <h3 className="mt-1 text-3xl font-bold text-white">
                  {selectedAvenueDetail.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-soft)] md:text-base">
                  {selectedAvenueDetail.details}
                </p>

                {/* Key Initiatives Gallery Preview */}
                <div className="mt-6 space-y-2">
                  <div className="text-xs font-semibold tracking-wider text-[#3B82F6] uppercase">
                    Associated Avenue Imagery
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {selectedAvenueDetail.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-20 overflow-hidden rounded-xl border border-white/10"
                      >
                        <Image
                          src={img.url}
                          alt={img.caption}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-actions mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedAvenueDetail(null)}
                    className="secondary-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="modal-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#101010]"
            >
              {/* Visible X Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black active:scale-95"
                aria-label="Close Project Modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="modal-visual">
                <Image
                  src={selectedProject.image || "/images/no-photo.svg"}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <div className="modal-copy">
                <div className="eyebrow">{selectedProject.category}</div>
                <h3>{selectedProject.title}</h3>
                <div className="modal-meta">
                  <span>
                    {selectedProject.date
                      ? new Date(selectedProject.date).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "Date TBD"}
                  </span>
                  <span>{selectedProject.venue}</span>
                </div>
                <p>
                  {selectedProject.objective || selectedProject.description}
                </p>
                <p>{selectedProject.description}</p>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="secondary-button modal-close-button"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="modal-card event-modal relative max-h-[90vh] overflow-hidden overflow-y-auto rounded-3xl border border-white/10 bg-[#101010]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-modal-title"
            >
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event details"
                className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
              <ProjectSlideshow
                title={selectedEvent.title}
                coverImage={selectedEvent.image}
                images={selectedEvent.images}
              />
              <div className="modal-copy p-6 md:p-8">
                <div className="eyebrow">{selectedEvent.category}</div>
                <h3 id="event-modal-title">{selectedEvent.title}</h3>
                <div className="modal-meta">
                  <span>
                    {selectedEvent.date &&
                      new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                  </span>
                  <span>{selectedEvent.time}</span>
                  <span>
                    <MapPin size={12} />{" "}
                    {selectedEvent.venue || selectedEvent.location}
                  </span>
                </div>
                <div className="mt-4 text-xs font-bold tracking-wider text-[#3B82F6] uppercase">
                  DESCRIPTION
                </div>
                <div className="mt-2 max-h-[45vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent overflow-y-auto pr-2">
                  {selectedEventDescription ? (
                    selectedEventDescription
                      .split(/\n+/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="mb-3 text-sm text-white/80 last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))
                  ) : (
                    <p className="mb-3 text-sm text-white/80 last:mb-0">
                      Event details will be updated soon.
                    </p>
                  )}
                </div>
                {selectedEvent.objective?.trim() ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs font-bold tracking-wider text-[#3B82F6] uppercase">
                      OBJECTIVE
                    </div>
                    <p className="mt-1 text-sm text-white/90">
                      {selectedEvent.objective}
                    </p>
                  </div>
                ) : null}
                {Array.isArray(selectedEvent.highlights) &&
                selectedEvent.highlights.length > 0 ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs font-bold tracking-wider text-[#3B82F6] uppercase">
                      HIGHLIGHTS
                    </div>
                    <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-white/90">
                      {selectedEvent.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {typeof selectedEvent.participants === "number" &&
                selectedEvent.participants > 0 ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs font-bold tracking-wider text-[#3B82F6] uppercase">
                      PARTICIPANTS
                    </div>
                    <p className="mt-1 text-sm text-white/90">
                      {selectedEvent.participants}
                    </p>
                  </div>
                ) : null}
                {selectedEvent.beneficiaries !== undefined &&
                selectedEvent.beneficiaries !== null ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs font-bold tracking-wider text-[#3B82F6] uppercase">
                      BENEFICIARIES
                    </div>
                    <p className="mt-1 text-sm text-white/90">
                      {selectedEvent.beneficiaries}
                    </p>
                  </div>
                ) : null}
                {Array.isArray(selectedEvent.collaborators) &&
                selectedEvent.collaborators.length > 0 ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs font-bold tracking-wider text-[#3B82F6] uppercase">
                      COLLABORATORS
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedEvent.collaborators.map(
                        (collaborator, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white"
                          >
                            {collaborator}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ) : null}
                {(Array.isArray(selectedEvent.gallery)
                  ? selectedEvent.gallery
                  : Array.isArray(selectedEvent.images)
                    ? selectedEvent.images.slice(1)
                    : []
                ).length > 0 ? (
                  <div className="mt-4">
                    <div className="text-xs font-bold tracking-wider text-[#3B82F6] uppercase">
                      GALLERY
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(Array.isArray(selectedEvent.gallery)
                        ? selectedEvent.gallery
                        : Array.isArray(selectedEvent.images)
                          ? selectedEvent.images.slice(1)
                          : []
                      ).map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative h-32 w-full overflow-hidden rounded-lg"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Event gallery ${index + 1}`}
                            fill
                            sizes="150px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {selectedEvent.registrationLink ? (
                  <a
                    href={selectedEvent.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/10 py-3 text-xs font-semibold text-[#3B82F6] transition-all hover:bg-[#3B82F6]/20"
                  >
                    Register for This Event
                  </a>
                ) : null}
                {selectedEvent.googleCalendarLink ? (
                  <a
                    href={selectedEvent.googleCalendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-3 text-xs font-semibold text-white transition-all hover:bg-white/10"
                  >
                    Open in Google Calendar
                  </a>
                ) : null}
                <div className="modal-actions mt-6 flex justify-end">
                  <a href="/calendar" className="primary-button small-button">
                    Calendar page <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-footer-meta">
        <div className="footer-strap">
          <span>RCPU</span>
          <span>{clubData.name}</span>
        </div>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/events">Events</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="social-row">
          {socialData.instagram ? (
            <a href={socialData.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          ) : null}
          {socialData.linkedin ? (
            <a href={socialData.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
          <a
            href={`mailto:${clubData.name.includes("Presidency") ? "rotaract@presidencyuniversity.in" : "contact@rotaract"}`}
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
