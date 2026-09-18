"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { NAV_ITEMS, type NavItemConfig } from "@/config/navigation";

export function Navbar() {
  const pathname = usePathname();

  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isHomePage = pathname === "/";
  const isProgrammaticScroll = useRef(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  /**
   * Derive the currently active nav item ID from pathname + scroll section.
   *
   * Priority:
   * 1. For page-type items — match by pageRoute prefix.
   * 2. For section-type items on the homepage — use IntersectionObserver-driven
   *    activeSection state.
   * 3. Fallback: "hero"
   */
  const currentActiveId = (() => {
    // Check page-type items first (prefix match so /events/[slug] still highlights Events)
    for (const item of NAV_ITEMS) {
      if (item.type === "page" && item.pageRoute) {
        if (
          pathname === item.pageRoute ||
          pathname.startsWith(item.pageRoute + "/")
        ) {
          return item.id;
        }
      }
    }
    // On homepage, use scroll-spy
    if (isHomePage) return activeSection;
    return "hero";
  })();

  // 1. IntersectionObserver — homepage section scroll-spy
  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = NAV_ITEMS.filter((i) => i.sectionId).map(
      (i) => i.sectionId!
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        // Pick the entry with the largest intersection ratio when multiple fire
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
        const best = intersecting.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b
        );
        setActiveSection(best.target.id);
      },
      { root: null, rootMargin: "-15% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  // 2. GPU-accelerated scroll progress bar + isScrolled flag (no re-render on scroll)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;

          if (progressBarRef.current && totalHeight > 0) {
            const scale = Math.min(1, Math.max(0, scrollY / totalHeight));
            progressBarRef.current.style.transform = `scaleX(${scale})`;
          }

          setIsScrolled(scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Handle initial hash scroll on homepage mount (with header offset)
  useEffect(() => {
    if (!isHomePage) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    // Defer until layout is ready
    const timer = setTimeout(() => {
      const targetEl = document.getElementById(hash);
      if (!targetEl) return;

      isProgrammaticScroll.current = true;
      setActiveSection(hash);

      const headerHeight =
        (document.querySelector("header") as HTMLElement | null)
          ?.getBoundingClientRect().height ?? 80;
      const targetPos =
        targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetPos, behavior: "smooth" });

      const resetTimer = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 900);
      return () => clearTimeout(resetTimer);
    }, 120);

    return () => clearTimeout(timer);
  }, [isHomePage]);

  // 4. Mobile menu scroll lock + Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  /**
   * Unified navigation handler.
   *
   * Section items:
   *   - If already on homepage → preventDefault + smooth scroll.
   *   - If on another page → navigate to "/" then let the hash effect scroll.
   *
   * Page items:
   *   - If on the target page → no-op (already there) or scroll to top.
   *   - Otherwise → router.push(route).
   */
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItemConfig
  ) => {
    setMobileMenuOpen(false);

    if (item.type === "section" && item.sectionId) {
      if (isHomePage) {
        e.preventDefault();
        const targetId = item.sectionId;
        const targetEl = document.getElementById(targetId);

        if (targetEl) {
          isProgrammaticScroll.current = true;
          setActiveSection(targetId);
          window.history.pushState(
            null,
            "",
            targetId === "hero" ? "/" : `#${targetId}`
          );
          const headerHeight =
            (document.querySelector("header") as HTMLElement | null)
              ?.getBoundingClientRect().height ?? 80;
          const targetPos =
            targetEl.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;
          window.scrollTo({ top: targetPos, behavior: "smooth" });
          setTimeout(() => {
            isProgrammaticScroll.current = false;
          }, 900);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveSection("hero");
        }
      }
      // When not on homepage, the <a href="/#section"> will navigate normally;
      // the hash effect on homepage mount will handle the scroll.
    } else if (item.type === "page" && item.pageRoute) {
      // If already on the page, just scroll to top
      if (pathname === item.pageRoute) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      // Otherwise let Next.js Link / router handle it (href is already correct)
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      {/* Top Accent Progress Bar (GPU Hardware Accelerated) */}
      <div className="h-[2px] w-full overflow-hidden bg-transparent">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 origin-left transition-transform duration-75 ease-out"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Luxury Glass Header Container */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "shadow-large border-b border-white/[0.08] bg-[#050505]/90 py-3 backdrop-blur-2xl"
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
                setActiveSection("hero");
                window.history.pushState(null, "", "/");
              } else {
                setActiveSection("hero");
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

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl md:flex">
            {NAV_ITEMS.map((item) => {
              const isSelected = currentActiveId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.route}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-[#3B82F6] font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      : "text-[#9A9A9A] hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right Action CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={ROUTES.JOIN}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                pathname === ROUTES.JOIN
                  ? "bg-[#3B82F6] text-white shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                  : "border border-[#3B82F6]/40 bg-[#3B82F6]/10 text-white hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]"
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
                    currentActiveId === item.id
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
                  onClick={() => setMobileMenuOpen(false)}
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
