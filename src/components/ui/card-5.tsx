"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent, addToUserGoogleCalendar } from "@/lib/google-calendar";
import { Calendar, MapPin, Clock, ExternalLink, PlusCircle, X } from "lucide-react";

export interface Card5Props {
  event?: CalendarEvent;
  onClose?: () => void;
}

const defaultMediaCard = {
  title: "Rotaract Annual Youth Leadership Conclave",
  category: "Professional",
  description:
    "Join district leaders and guest speakers for an immersive full-day workshop on career development, public speaking, and community initiative building.",
  imageSrc: "/gallery/gallery-1.jpeg",
  imageAlt: "Rotaract Event",
  date: "2026-09-15",
  time: "10:00 AM - 04:00 PM",
  venue: "Auditorium Hall 2, Presidency University",
  googleCalendarLink: "https://calendar.google.com",
};

export function Card5({ event, onClose }: Card5Props) {
  const displayEvent = event || {
    id: "default",
    title: defaultMediaCard.title,
    category: defaultMediaCard.category,
    description: defaultMediaCard.description,
    fullDescription: defaultMediaCard.description,
    image: defaultMediaCard.imageSrc,
    images: [defaultMediaCard.imageSrc],
    date: defaultMediaCard.date,
    time: defaultMediaCard.time,
    startTime: "10:00 AM",
    endTime: "04:00 PM",
    venue: defaultMediaCard.venue,
    location: defaultMediaCard.venue,
    googleCalendarLink: defaultMediaCard.googleCalendarLink,
    status: "upcoming" as const,
    rawStart: new Date().toISOString(),
    rawEnd: new Date().toISOString(),
  };

  const description = displayEvent.fullDescription || displayEvent.description || "";

  const renderParagraphs = (text: string) => {
    if (!text) return null;
    return text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p, i) => (
        <p key={i} className="mb-3 last:mb-0">
          {p}
        </p>
      ));
  };

  return (
    <Card className="max-w-xl w-full overflow-hidden border-white/10 bg-[#0c0c0e]/95 backdrop-blur-2xl shadow-2xl rounded-3xl p-0">
      <CardContent className="p-0 relative">
        <div className="relative aspect-16/9 w-full overflow-hidden">
          <Image
            src={displayEvent.image}
            alt={displayEvent.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="default" className="bg-[#3B82F6] text-white border-0">
              {displayEvent.category}
            </Badge>
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-xs text-white">
              {displayEvent.status === "upcoming" ? "Upcoming" : "Past Event"}
            </Badge>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            title="Close event details"
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/90 backdrop-blur-md transition-all hover:scale-110 hover:bg-[#3B82F6] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </CardContent>

      <CardHeader className="space-y-3 p-6 pb-3">
        <CardTitle className="text-xl font-bold text-white leading-snug">
          {displayEvent.title}
        </CardTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#9A9A9A] pt-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>{displayEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>{displayEvent.time}</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <MapPin className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" />
            <span className="truncate">{displayEvent.venue}</span>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <div className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-2">
          DESCRIPTION
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <CardDescription className="leading-relaxed text-xs text-[#D4D4D4] pt-1">
            {renderParagraphs(description)}
          </CardDescription>
        </div>
      </div>

      <CardFooter className="gap-3 border-t border-white/10 p-6 pt-4 flex-col sm:flex-row justify-between">
        <Button
          onClick={() => addToUserGoogleCalendar(displayEvent)}
          className="bg-[#3B82F6] text-white hover:bg-blue-600 w-full sm:w-auto rounded-xl text-xs py-5 shadow-glow"
        >
          <PlusCircle className="mr-1.5 h-4 w-4" />
          Add to Google Calendar
        </Button>

        {displayEvent.registrationLink && (
          <a
            href={displayEvent.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full rounded-xl text-xs py-5 border-white/10 text-white hover:bg-white/10">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Register Now
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}

export default Card5;
