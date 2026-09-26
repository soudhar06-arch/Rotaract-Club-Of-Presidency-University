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

export default function FaqPage() {
  const { data: faqItems, loading, error } = useCMS<FaqItem[]>("faq", []);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqItems.map((f) => f.category)));
    return ["All", ...cats];
  }, [faqItems]);

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCat =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [faqItems, selectedCategory, searchQuery]);

  return (
    <div className="section-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p role="status" className="text-sm text-zinc-400">{loading ? "Loading?" : error || (faqItems.length === 0 ? "No published records yet." : "")}</p>
        <BackButton fallbackRoute="/#faq" className="mb-6" />

        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Knowledge Base & FAQ
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase font-sans">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400">Questions.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Everything you need to know about joining Rotaract Club of Presidency University, participating in drives, Google Calendar sync, and sponsorships.
          </p>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25 border border-[#3B82F6]"
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="mt-10 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center border border-white/10 rounded-3xl bg-white/[0.02]">
              <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No questions found</h3>
              <p className="text-xs text-zinc-400 mt-1">Try adjusting your search terms or category filters.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id || index}
                  value={faq.id || `faq-${index}`}
                  className="border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl rounded-2xl px-6 py-2 transition-all duration-300 hover:border-[#3B82F6]/40 data-[state=open]:border-[#3B82F6]/60 shadow-lg"
                >
                  <AccordionTrigger className="text-left font-bold text-white hover:text-[#3B82F6] text-base py-4 hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 font-bold">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300 text-sm leading-relaxed pb-5 pt-1">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Callout */}
        <div className="mt-16 p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0E121E] via-[#141A2E] to-[#0E121E] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Still have questions?</h3>
            <p className="text-xs text-zinc-400">Reach out directly to our Secretariat or Executive Council.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
          >
            <span>Contact Secretariat</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
