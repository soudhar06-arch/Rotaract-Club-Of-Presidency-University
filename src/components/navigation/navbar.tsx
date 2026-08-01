"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

const NAV_ITEMS = [
  { label: "Home", id: "hero", route: "/" },
  { label: "About", id: "about", route: "/#about" },
  { label: "Projects", id: "projects", route: "/#projects" },
  { label: "Events", id: "events", route: "/events" },
  { label: "Calendar", id: "calendar", route: "/calendar" },
  { label: "Gallery", id: "gallery", route: "/gallery" },
  { label: "Leadership", id: "leadership", route: "/#leadership" },
  { label: "Contact", id: "contact", route: "/#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeItem, setActiveItem] = useState<string>(() => {
    if (pathname === "/calendar") return "calendar";
    if (pathname === "/events" || pathname.startsWith("/events/"))
      return "events";
    if (pathname === "/gallery" || pathname.startsWith("/gallery/"))
      return "gallery";
    if (pathname === "/join") return "join";
    return "hero";
  });
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isHomePage = pathname === "/";

  // 1. Determine active navbar item based on pathname and scroll position
  const syncActiveState = useCallback(() => {
    if (pathname === "/calendar") {
      setActiveItem("calendar");
    } else if (pathname === "/events" || pathname.startsWith("/events/")) {
      setActiveItem("events");
    } else if (pathname === "/gallery" || pathname.startsWith("/gallery/")) {
      setActiveItem("gallery");
    } else if (pathname === "/join") {
      setActiveItem("join");
    } else if (isHomePage) {
      if (typeof window !== "undefined" && window.location.hash) {
        const hashId = window.location.hash.replace("#", "");
        if (NAV_ITEMS.some((item) => item.id === hashId)) {
          setActiveItem(hashId);
        }
      }
    }
  }, [pathname, isHomePage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      syncActiveState();
    }, 0);
    return () => clearTimeout(timer);
  }, [syncActiveState]);

  // 2. Scroll Spy for Homepage using IntersectionObserver
  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  // 3. Scroll Progress & Sticky Bar effect
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Handle hash scrolling after cross-page navigation
  useEffect(() => {
    if (isHomePage && typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && NAV_ITEMS.some((item) => item.id === hash)) {
        const timer = setTimeout(() => {
          setActiveItem(hash);
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [isHomePage, pathname]);

  // 5. Popstate & Hash Change Listener for Browser Back/Forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      if (isHomePage) {
        const hashId = window.location.hash.replace("#", "");
        if (hashId && NAV_ITEMS.some((item) => item.id === hashId)) {
          setActiveItem(hashId);
          const targetEl = document.getElementById(hashId);
          if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
        } else {
          setActiveItem("hero");
        }
      } else {
        syncActiveState();
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, [isHomePage, syncActiveState]);

  // 5. Unified Navigation Click Handler
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof NAV_ITEMS)[0],
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (item.id === "calendar") {
      setActiveItem("calendar");
      router.push("/calendar");
      return;
    }

    if (item.id === "events" && pathname !== "/events") {
      setActiveItem("events");
      router.push("/events");
      return;
    }

    if (item.id === "gallery" && pathname !== "/gallery") {
      setActiveItem("gallery");
      router.push("/gallery");
      return;
    }

    // Homepage section scrolling logic
    if (isHomePage) {
      const targetElement = document.getElementById(item.id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setActiveItem(item.id);
        window.history.pushState(
          null,
          "",
          item.id === "hero" ? "/" : `#${item.id}`,
        );
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveItem("hero");
      }
    } else {
      // Navigate from non-homepage to target section on homepage
      setActiveItem(item.id);
      router.push(item.id === "hero" ? "/" : `/#${item.id}`);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      {/* Top Accent Progress Bar */}
      <div className="h-[2px] w-full overflow-hidden bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Luxury Glass Header Container */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "shadow-large border-b border-white/[0.08] bg-[#050505]/85 py-3 backdrop-blur-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container-shell flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Official Brand Logo */}
          <Link
            href={ROUTES.HOME}
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setActiveItem("hero");
                window.history.pushState(null, "", "/");
              } else {
                setActiveItem("hero");
              }
            }}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-[#101010] p-1 transition-transform group-hover:scale-105">
              <Image
                src="/logos/club_logo.svg"
                alt="Rotaract Emblem"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold tracking-wider text-white uppercase sm:text-sm">
                ROTARACT CLUB
              </span>
              <span className="text-[10px] font-medium tracking-widest text-[#9A9A9A] uppercase">
                PRESIDENCY UNIVERSITY
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with Gliding Active Pill */}
          <div className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl md:flex">
            {NAV_ITEMS.map((item) => {
              const isSelected = activeItem === item.id;
              return (
                <a
                  key={item.id}
                  href={item.route}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
                    isSelected
                      ? "font-semibold text-white"
                      : "text-[#9A9A9A] hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 -z-10 rounded-full bg-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right Action CTA (Apply for Membership) */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={ROUTES.JOIN}
              onClick={() => setActiveItem("join")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                pathname === ROUTES.JOIN
                  ? "bg-[#3B82F6] text-white shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                  : "border border-white/10 bg-white/[0.05] text-white hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
              }`}
            >
              <span>Apply for Membership</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white transition-colors hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Glass Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-[#050505]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="space-y-3 px-6 py-6">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.route}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`block border-b border-white/5 py-2.5 text-sm font-medium transition-colors ${
                    activeItem === item.id
                      ? "font-bold text-[#3B82F6]"
                      : "text-[#9A9A9A] hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3">
                <Link
                  href={ROUTES.JOIN}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveItem("join");
                  }}
                  className="shadow-glow inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3 text-xs font-semibold text-white"
                >
                  <span>Apply for Membership</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
