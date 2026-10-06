"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import clubData from "@/data/club.json";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [config, setConfig] = useState({
    universityAddress: "",
    phone: "",
    email: "",
    membershipFormUrl: "",
  });

  useEffect(() => {
    let active = true;
    fetch("/api/cms?module=config")
      .then((res) => res.json())
      .then((res) => {
        if (active && res.success && res.data) {
          setConfig((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
              student-led organization operating under {clubData.rotaryDistrict}
              . Partnered with {clubData.partnerRotaryClub}. Dedicated to
              leadership development, community impact, and global fellowship.
            </p>

            <div className="flex items-center gap-3 text-xs text-[#71717A]">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Chartered under {clubData.rotaryDistrict} (Charter #
                {clubData.charterNumber})
              </span>
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
                  href="/events"
                  className="transition-colors hover:text-white"
                >
                  Featured Events
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="transition-colors hover:text-white"
                >
                  Events & Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-white"
                >
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/board"
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
              UNIVERSITY ADDRESS
            </h3>
            <ul className="space-y-3 text-sm text-[#9A9A9A]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                <span>{config.universityAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <a
                  href={`mailto:${config.email}`}
                  className="transition-colors hover:text-white"
                >
                  {config.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <a
                  href={`tel:${config.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {config.phone}
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={config.membershipFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/10"
              >
                <span>Apply for Membership</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs text-[#71717A] sm:flex-row">
          <p>
            © {currentYear} Rotaract Club of Presidency University. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
