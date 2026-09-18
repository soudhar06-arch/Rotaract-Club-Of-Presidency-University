"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { CountUp } from "@/components/shared/count-up";

export interface Hero3NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface Hero3Stat {
  value: string;
  label: string;
}

export interface Hero3Props {
  logo?: ReactNode;
  logoText?: string;
  navItems?: Hero3NavItem[];
  signInText?: string;
  signInHref?: string;
  tagline?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  backgroundImage?: string;
  stats?: Hero3Stat[];
  scrollText?: string;
  scrollHref?: string;
}

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.65, bounce: 0 },
  },
};

export function Hero3({
  logo,
  logoText = "Rotaract Presidency",
  navItems = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Calendar", href: "/calendar" },
    { label: "FAQ", href: "/faq" },
  ],
  signInText = "Admin Access",
  signInHref = "/admin/login",
  tagline = "Chartered under Rotary District 3191.",
  titleLine1 = "Architecting Impact",
  titleLine2 = "Across Campus & Beyond.",
  description = "Empowering Presidency University youth through service initiatives, professional development, and community impact.",
  primaryCtaText = "Apply for Membership",
  primaryCtaHref = "/join",
  secondaryCtaText = "Explore Our Impact",
  secondaryCtaHref = "#about",
  backgroundImage = "/gallery/gallery-1.jpeg",
  stats = [
    { value: "500+", label: "Active Members" },
    { value: "50+", label: "Projects Executed" },
    { value: "10K+", label: "Lives Impacted" },
  ],
  scrollText = "Scroll to Discover",
  scrollHref = "#about",
}: Hero3Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="dark bg-[#050505] text-white relative min-h-screen w-full overflow-hidden font-sans">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            priority
            className="pointer-events-none h-full w-full object-cover brightness-40 select-none"
          />
        </div>
      )}

      <motion.header
        initial={{ opacity: 0, y: -14, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0 }}
        className="absolute top-0 left-0 z-30 w-full"
      >
        <div className="flex max-w-full items-center justify-between px-6 py-6 sm:px-10 md:px-16 lg:px-20">
          <Link
            href="/"
            className="text-white flex items-center gap-2.5 text-xl font-bold tracking-tight"
          >
            <span className="text-[#3B82F6] flex items-center justify-center">
              {logo || <ShieldCheck className="size-7" />}
            </span>
            <span>{logoText}</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group text-[#9A9A9A] hover:text-white flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:translate-y-0.5" />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href={signInHref}
              className="border-white/10 bg-white/[0.04] text-white hover:bg-[#3B82F6] rounded-xl border px-5 py-2 text-xs font-semibold backdrop-blur-sm transition-all duration-200"
            >
              {signInText}
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-white hover:bg-white/10 flex items-center justify-center rounded-xl p-2 transition-colors md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="bg-[#050505]/95 fixed inset-0 z-50 flex flex-col p-6 backdrop-blur-md md:hidden"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-white flex items-center gap-2.5 text-lg font-bold tracking-tight"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-[#3B82F6] flex items-center justify-center">
                  {logo || <ShieldCheck className="size-7" />}
                </span>
                <span>{logoText}</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:bg-white/10 flex items-center justify-center rounded-xl p-2 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-12 flex flex-col gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="border-white/10 text-white hover:text-[#3B82F6] flex items-center justify-between border-b pb-3 text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="h-4 w-4 text-[#9A9A9A]" />
                  )}
                </a>
              ))}
            </nav>

            <div className="mt-auto">
              <Link
                href={signInHref}
                onClick={() => setMobileMenuOpen(false)}
                className="border-white/10 bg-[#3B82F6] text-white flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                {signInText}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex min-h-screen max-w-7xl flex-col justify-between px-6 pt-32 pb-12 sm:px-10 md:px-16 md:pt-40 lg:px-20 lg:pt-48">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.38 }}
          className="flex flex-1 flex-col justify-center"
        >
          <div className="max-w-4xl">
            {tagline && (
              <motion.p
                variants={item}
                className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase mb-4"
              >
                {tagline}
              </motion.p>
            )}

            <motion.h1
              variants={item}
              className="text-white mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {titleLine1 && <span className="block">{titleLine1}</span>}
              {titleLine2 && <span className="block text-[#3B82F6]">{titleLine2}</span>}
            </motion.h1>

            {description && (
              <motion.p
                variants={item}
                className="leading-relaxed mb-6 max-w-2xl text-base text-[#9A9A9A]"
              >
                {description}
              </motion.p>
            )}

            <motion.div
              variants={item}
              className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              {primaryCtaText && (
                <Link
                  href={primaryCtaHref}
                  className="rounded-xl bg-[#3B82F6] px-8 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-blue-600 sm:text-base"
                >
                  {primaryCtaText}
                </Link>
              )}
              {secondaryCtaText && (
                <a
                  href={secondaryCtaHref}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-white transition-colors duration-200 hover:text-[#3B82F6] sm:text-base"
                >
                  <span>{secondaryCtaText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="border-white/10 mt-12 border-t pt-8 sm:mt-16"
        >
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            {stats.length > 0 && (
              <div className="flex flex-col divide-y divide-white/10 md:flex-row md:items-center md:divide-x md:divide-y-0">
                {stats.map((stat) => (
                  <motion.div
                    variants={item}
                    key={stat.label}
                    className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0"
                  >
                    <span className="text-white text-3xl font-bold tracking-tight sm:text-4xl">
                      <CountUp value={stat.value} once={false} />
                    </span>

                    <span className="text-xs text-[#9A9A9A] uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {scrollText && (
              <motion.a
                variants={item}
                href={scrollHref}
                className="text-[#9A9A9A] hover:text-white flex items-center gap-2 self-start text-xs font-semibold transition-colors sm:text-sm md:self-auto"
              >
                <span>{scrollText}</span>
                <ArrowDown className="h-4 w-4 text-[#3B82F6]" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero3;
