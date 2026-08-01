"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { ROUTES } from "@/constants";

export default function EventDetailPage() {
  return (
    <div className="space-y-12 pt-28 pb-20">
      <div className="container-shell max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.EVENTS}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--color-text-muted)] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Events</span>
        </Link>

        <div className="space-y-3">
          <span className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs font-bold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
            Public Health Drive
          </span>
          <h1 className="text-display-l font-bold text-white">
            Annual Mega Blood Donation Drive 2026
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-y border-white/10 py-4 text-xs text-[color:var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#3B82F6]" />
            <span>August 15, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#3B82F6]" />
            <span>09:00 AM - 04:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#3B82F6]" />
            <span>Auditorium Block A, Presidency University</span>
          </div>
        </div>

        <div className="glass-card relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
          <Image
            src="/images/event-blood-drive.png"
            alt="Blood Donation Event"
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-12">
          <div className="text-body space-y-6 leading-relaxed text-[color:var(--color-text-muted)] lg:col-span-8">
            <h2 className="text-heading-m font-bold text-white">
              About the Event
            </h2>
            <p>
              The Rotaract Club of Presidency University, in partnership with
              Rotary District 3191 and Red Cross Blood Bank, hosts its annual
              flagship Blood Donation Drive. This initiative aims to mobilize
              over 400 voluntary donors to support regional blood banks during
              emergency deficits.
            </p>

            <h3 className="text-heading-s font-bold text-white">
              What Donors Receive
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                "Official Red Cross Donor Certificate",
                "Complimentary health checkup & blood group report",
                "Refreshment package provided on site",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="glass-card space-y-4 p-6">
              <h3 className="text-heading-s font-bold text-white">
                Event Registration
              </h3>
              <p className="text-xs text-[color:var(--color-text-muted)]">
                Registration is free for all university students, faculty, and
                local community members.
              </p>
              <button
                onClick={() => alert("Registration confirmed for demo!")}
                className="shadow-small inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
              >
                <span>Confirm RSVP</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
