"use client";

import { useState, useMemo } from "react";
import { useCMS } from "@/hooks/use-cms";
import { BackButton } from "@/components/shared/back-button";
import { Search, X, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-default-1",
    question: "What is Rotaract?",
    answer:
      "Rotaract is a youth-focused service organization that brings together leadership, fellowship, and community impact through Rotary values.",
    category: "General",
  },
  {
    id: "faq-default-2",
    question: "Who can join Rotaract?",
    answer:
      "Anyone who is passionate about service, leadership, and personal growth can apply to become part of the club.",
    category: "Membership",
  },
  {
    id: "faq-default-3",
    question: "What kinds of activities do members do?",
    answer:
      "Members participate in community service drives, leadership workshops, networking sessions, campus events, and social impact initiatives.",
    category: "Activities",
  },
  {
    id: "faq-default-4",
    question: "Why should I join Rotaract?",
    answer:
      "Joining Rotaract helps students build confidence, collaborate with peers, gain leadership exposure, and make a real difference in the community.",
    category: "Benefits",
  },
  {
    id: "faq-default-5",
    question: "Does the club organize events?",
    answer:
      "Yes. The club regularly hosts both service-focused and community-building events designed to create impact and bring members together.",
    category: "Events",
  },
  {
    id: "faq-default-6",
    question: "Can students from different backgrounds join?",
    answer:
      "Yes. Rotaract is open to students who want to contribute, learn, and grow together in a welcoming environment.",
    category: "General",
  },
];

export default function FaqPage() {
  const { data: faqItems, loading, error } = useCMS<FaqItem[]>("faq", []);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const activeFaqItems = faqItems.length > 0 ? faqItems : DEFAULT_FAQS;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(activeFaqItems.map((f) => f.category)));
    return ["All", ...cats];
  }, [activeFaqItems]);

  const filteredFaqs = useMemo(() => {
    return activeFaqItems.filter((item) => {
      const matchesCat =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeFaqItems, selectedCategory, searchQuery]);

  return (
    <div className="section-shell min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p role="status" className="text-sm text-zinc-400">
          {loading
            ? "Loading?"
            : error ||
              (faqItems.length === 0
                ? "Using sample questions while the CMS is empty."
                : "")}
        </p>
        <BackButton fallbackRoute="/#faq" className="mb-6" />

        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 font-mono text-xs font-semibold text-[#3B82F6] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Knowledge Base & FAQ
          </div>

          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-white uppercase sm:text-6xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Questions.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Everything you need to know about joining Rotaract Club of
            Presidency University, participating in drives, Google Calendar
            sync, and sponsorships.
          </p>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    selectedCategory === cat
                      ? "border border-[#3B82F6] bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25"
                      : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-xs text-white placeholder-zinc-500 transition-colors focus:border-[#3B82F6] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="mt-10 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <HelpCircle className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
              <h3 className="text-lg font-bold text-white">
                No questions found
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Try adjusting your search terms or category filters.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id || index}
                  value={faq.id || `faq-${index}`}
                  className="rounded-2xl border border-white/10 bg-[#0E121E]/90 px-6 py-2 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-[#3B82F6]/40 data-[state=open]:border-[#3B82F6]/60"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-bold text-white hover:text-[#3B82F6] hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="rounded-full border border-[#3B82F6]/20 bg-[#3B82F6]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#3B82F6] uppercase">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-5 text-sm leading-relaxed text-zinc-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Callout */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0E121E] via-[#141A2E] to-[#0E121E] p-8 sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">
              Still have questions?
            </h3>
            <p className="text-xs text-zinc-400">
              Reach out directly to our Secretariat or Executive Council.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-[#3B82F6]/25 transition-colors hover:bg-blue-600"
          >
            <span>Contact Secretariat</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
