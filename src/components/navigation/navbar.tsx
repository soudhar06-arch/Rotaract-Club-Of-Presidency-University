"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { ROUTES } from "@/constants";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const NAV_ITEMS = [
  { id: "hero", label: "Home", href: ROUTES.HOME },
  { id: "mission", label: "About", href: ROUTES.HOME + "#mission" },
  { id: "projects", label: "Projects", href: ROUTES.HOME + "#projects" },
  { id: "events", label: "Events", href: ROUTES.HOME + "#events" },
  { id: "gallery", label: "Gallery", href: ROUTES.HOME + "#gallery" },
  { id: "board", label: "Board", href: ROUTES.HOME + "#board" },
  { id: "contact", label: "Contact", href: ROUTES.CONTACT },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate Scroll Progress Percentage
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      setScrolled(window.scrollY > 20);

      // 2. Scroll-Spy Section Detector
      if (pathname === "/") {
        const sectionIds = [
          "hero",
          "mission",
          "projects",
          "events",
          "gallery",
          "board",
          "contact",
        ];
        const scrollPosition = window.scrollY + 200;

        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const section = document.getElementById(sectionIds[i]);
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-navigation border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-glass)] py-3 backdrop-blur-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-shell flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href={ROUTES.HOME}
          className="group flex items-center gap-3 focus-visible:outline-none"
        >
          <div className="shadow-small flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--color-brand-accent-blue)] to-[#002857] text-lg font-extrabold text-white transition-transform group-hover:scale-105">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-base font-bold tracking-tight text-[color:var(--color-text-primary)]">
              Rotaract Club
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
              <span>Presidency University</span>
              <Sparkles className="h-2.5 w-2.5" />
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Animated Pill Indicator */}
        <nav className="shadow-small relative hidden items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 px-2 py-1.5 backdrop-blur-md lg:flex">
          {NAV_ITEMS.map((item) => {
            const isSelected =
              pathname === "/"
                ? activeSection === item.id
                : pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  isSelected
                    ? "text-white"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="shadow-small absolute inset-0 -z-10 rounded-full bg-[color:var(--color-brand-accent-blue)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href={ROUTES.JOIN}
            className="shadow-small inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-brand-accent-blue)] px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02] hover:bg-[color:var(--color-brand-accent-blue)]/90 active:scale-[0.98]"
          >
            <span>Join Rotaract</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 text-[color:var(--color-text-primary)]"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar Scroll Indicator */}
      <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-[color:var(--color-brand-accent-blue)] via-[color:var(--color-brand-rotary-gold)] to-[color:var(--color-brand-accent-blue)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="shadow-large overflow-hidden border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] lg:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`border-b border-[color:var(--color-border)]/50 py-2 text-sm font-semibold transition-colors last:border-0 ${
                    activeSection === item.id
                      ? "font-bold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]"
                      : "text-[color:var(--color-text-primary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href={ROUTES.JOIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="shadow-small flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-accent-blue)] py-3 text-sm font-semibold text-white"
                >
                  <span>Join Rotaract</span>
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
