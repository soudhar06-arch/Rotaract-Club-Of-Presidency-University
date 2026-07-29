"use client";

import Link from "next/link";
import { ROUTES } from "@/constants";
import { siteConfig } from "@/config/site";
import { Mail, ArrowRight, Heart } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/shared";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)]">
      {/* Top Newsletter & Branding Banner */}
      <div className="border-b border-[color:var(--color-border)]/60 py-12">
        <div className="container-shell px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-6">
              <h3 className="text-heading-m font-bold">
                Stay Updated with Chapter Impact
              </h3>
              <p className="text-body-small text-[color:var(--color-text-secondary)]">
                Subscribe to receive monthly newsletters, upcoming event alerts,
                and volunteer opportunities.
              </p>
            </div>
            <div className="lg:col-span-6">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="ml-auto flex max-w-md items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your university email..."
                  required
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] px-4 py-2.5 text-xs text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-rotary-gold)] focus-visible:outline-none"
                />
                <button
                  type="submit"
                  className="shadow-small inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[color:var(--color-brand-accent-blue)] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-16">
        <div className="container-shell px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Column 1: Brand */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="shadow-small flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-brand-accent-blue)] text-base font-extrabold text-white">
                  R
                </div>
                <span className="font-geist text-base font-bold tracking-tight text-[color:var(--color-text-primary)]">
                  Rotaract Club of Presidency University
                </span>
              </div>
              <p className="text-body-small max-w-sm text-[color:var(--color-text-secondary)]">
                Chartered under Rotary District 3191. Empowering student
                leadership, community service, and youth fellowship.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] p-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-accent-blue)] hover:text-[color:var(--color-brand-accent-blue)]"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] p-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-accent-blue)] hover:text-[color:var(--color-brand-accent-blue)]"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] p-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-accent-blue)] hover:text-[color:var(--color-brand-accent-blue)]"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href={ROUTES.HOME}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.ABOUT}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.EVENTS}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.GALLERY}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Initiatives */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
                Initiatives
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href={ROUTES.HOME + "#projects"}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    Green Campus Drive
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.EVENTS}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    Blood Donation Campaign
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.HOME + "#board"}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    Board Leadership
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.JOIN}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-accent-blue)]"
                  >
                    Membership Join
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
                Contact & Campus
              </h4>
              <p className="text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                Presidency University Campus, Itgalpur, Rajanakunte, Yelahanka,
                Bengaluru, Karnataka 560064
              </p>
              <p className="font-mono text-xs text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                contact@rotaract-presidency.org
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[color:var(--color-border)]/60 py-6 text-xs text-[color:var(--color-text-muted)]">
        <div className="container-shell flex flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Rotaract Club of Presidency University.
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.PRIVACY}
              className="hover:text-[color:var(--color-text-primary)]"
            >
              Privacy Policy
            </Link>
            <Link
              href={ROUTES.TERMS}
              className="hover:text-[color:var(--color-text-primary)]"
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
