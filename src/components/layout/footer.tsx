"use client";

import Link from "next/link";
import { ArrowRight, Shield, Heart } from "lucide-react";
import { ROUTES } from "@/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505] text-white">
      <div className="container-shell px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-8">
          {/* Col 1: Brand & Charter */}
          <div className="space-y-4 md:col-span-5">
            <Link href={ROUTES.HOME} className="group flex items-center gap-3">
              <div className="shadow-glow h-10 w-10 rounded-xl bg-gradient-to-tr from-[color:var(--color-brand-accent-blue)] to-blue-700 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0A0A] text-white">
                  <Shield className="h-5 w-5 text-[color:var(--color-brand-accent-blue)]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-geist text-base leading-none font-bold tracking-tight text-white">
                  ROTARACT CLUB
                </span>
                <span className="font-mono text-xs tracking-wider text-[color:var(--color-text-muted)]">
                  PRESIDENCY UNIVERSITY
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-[color:var(--color-text-muted)]">
              Chartered under Rotary District 3191. Empowering students through
              service, international understanding, and executive leadership.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 md:col-span-3">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[color:var(--color-text-muted)]">
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="transition-colors hover:text-white"
                >
                  About Us & Philosophy
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.PROJECTS}
                  className="transition-colors hover:text-white"
                >
                  Flagship Initiatives
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.EVENTS}
                  className="transition-colors hover:text-white"
                >
                  Upcoming Events & Drives
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.GALLERY}
                  className="transition-colors hover:text-white"
                >
                  Photo Gallery Albums
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.AWARDS}
                  className="transition-colors hover:text-white"
                >
                  District Awards
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter Inquiries */}
          <div className="space-y-3 md:col-span-4">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
              Stay Connected
            </h3>
            <p className="text-xs text-[color:var(--color-text-muted)]">
              Subscribe for updates on community drives and campus events.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="email"
                placeholder="Enter student email..."
                required
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder:text-[color:var(--color-text-muted)] focus-visible:ring-1 focus-visible:ring-[#3B82F6] focus-visible:outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center rounded-xl bg-[#3B82F6] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[color:var(--color-text-muted)] sm:flex-row">
          <p>
            © {new Date().getFullYear()} Rotaract Club of Presidency University.
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.PRIVACY}
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href={ROUTES.TERMS}
              className="transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
            <div className="flex items-center gap-1">
              <span>Built with Service</span>
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
