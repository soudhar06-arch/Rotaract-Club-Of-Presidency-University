"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ROUTES } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#050505] text-white">
      <div className="container-shell px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Main Brand Info (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-[#101010] p-1">
                <Image
                  src="/logos/club_logo.svg"
                  alt="Rotaract Logo"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-wider text-white uppercase">
                  ROTARACT CLUB
                </span>
                <span className="text-xs font-medium tracking-widest text-[#9A9A9A] uppercase">
                  PRESIDENCY UNIVERSITY
                </span>
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-[#9A9A9A]">
              The official Rotaract Club of Presidency University is a premier
              student-led organization sponsored by Rotary International
              District 3191. Dedicated to leadership development, community
              impact, and global fellowship.
            </p>

            <div className="flex items-center gap-3 text-xs text-[#71717A]">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Chartered under Rotary International District 3191</span>
            </div>
          </div>

          {/* Quick Links (3 Cols) */}
          <div className="space-y-4 lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-widest text-white uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#9A9A9A]">
              <li>
                <Link
                  href="/#hero"
                  className="transition-colors hover:text-white"
                >
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="transition-colors hover:text-white"
                >
                  About & Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="transition-colors hover:text-white"
                >
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/#events"
                  className="transition-colors hover:text-white"
                >
                  Events & Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/#gallery"
                  className="transition-colors hover:text-white"
                >
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/#leadership"
                  className="transition-colors hover:text-white"
                >
                  Board of Directors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Governance (4 Cols) */}
          <div className="space-y-4 lg:col-span-4">
            <h3 className="text-xs font-semibold tracking-widest text-white uppercase">
              Official Headquarters
            </h3>
            <ul className="space-y-3 text-sm text-[#9A9A9A]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                <span>
                  Presidency University Campus, Dibbur, Itgalpur, Rajanukunte,
                  Yelahanka, Bengaluru, Karnataka 560064
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <a
                  href="mailto:rotaract@presidencyuniversity.in"
                  className="transition-colors hover:text-white"
                >
                  rotaract@presidencyuniversity.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <span>+91 (080) 2309-3500</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href={ROUTES.JOIN}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition-all hover:border-[#3B82F6] hover:bg-[#3B82F6]"
              >
                <span>Join Rotaract Club</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs text-[#71717A] md:flex-row">
          <p>
            © {currentYear} Rotaract Club of Presidency University. All Rights
            Reserved.
          </p>

          <div className="flex items-center gap-6">
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
            <Link
              href={ROUTES.COLLABORATE}
              className="transition-colors hover:text-white"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
