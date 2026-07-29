"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Shield } from "lucide-react";
import { ROUTES } from "@/constants";
import { ThemeToggle } from "@/components/shared";

const NAV_ITEMS = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "About", href: "#mission", id: "mission" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Events", href: "#events", id: "events" },
  { label: "Gallery", href: "#gallery", id: "gallery" },
  { label: "Leadership", href: "#board", id: "board" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate Scroll Progress Percentage
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setIsScrolled(window.scrollY > 20);

      // 2. Scroll-Spy Active Section Detection
      const sections = NAV_ITEMS.map((item) =>
        document.getElementById(item.id),
      ).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-40">
      {/* Top Scroll Progress Line */}
      <div className="h-[2px] w-full overflow-hidden bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--color-brand-accent-blue)] via-blue-400 to-[color:var(--color-brand-rotary-gold)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Glass Header */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "shadow-large border-b border-white/10 bg-[#050505]/80 py-3 backdrop-blur-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container-shell flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href={ROUTES.HOME} className="group flex items-center gap-3">
            <div className="shadow-glow h-9 w-9 rounded-xl bg-gradient-to-tr from-[color:var(--color-brand-accent-blue)] to-blue-700 p-0.5 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0A0A] text-white">
                <Shield className="h-4 w-4 text-[color:var(--color-brand-accent-blue)]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-geist text-sm leading-none font-bold tracking-tight text-white transition-colors group-hover:text-[color:var(--color-brand-accent-blue)]">
                ROTARACT
              </span>
              <span className="font-mono text-[10px] tracking-wider text-[color:var(--color-text-muted)]">
                PRESIDENCY UNIV
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items with Scroll-Spy Indicator */}
          <div className="shadow-small hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-[color:var(--color-text-muted)] hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="shadow-small absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[color:var(--color-brand-accent-blue)] to-blue-600"
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

          {/* Right Action CTA & Theme Toggle */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href={ROUTES.JOIN}
              className="shadow-small inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[color:var(--color-brand-accent-blue)] px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-105 hover:bg-[color:var(--color-brand-accent-blue)]/90 active:scale-95"
            >
              <span>Join Club</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/10"
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

      {/* Mobile Glass Menu Drawer */}
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
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block border-b border-white/5 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2">
                <Link
                  href={ROUTES.JOIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="shadow-small inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-accent-blue)] py-3 text-xs font-semibold text-white"
                >
                  <span>Join Rotaract Club</span>
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
