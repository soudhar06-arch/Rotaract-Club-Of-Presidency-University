"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import faqData from "@/data/faq.json";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqCategory {
  title: string;
  description?: React.ReactNode;
  items: FaqItem[];
}

export interface Faq5Props {
  categories?: FaqCategory[];
  className?: string;
}

// Group FAQ data by category from faq.json
const groupFaqsByCategory = (): FaqCategory[] => {
  const categoryMap: Record<string, FaqItem[]> = {};

  faqData.forEach((item) => {
    const cat = item.category || "General";
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push({
      question: item.question,
      answer: item.answer,
    });
  });

  return Object.keys(categoryMap).map((catTitle) => ({
    title: catTitle,
    items: categoryMap[catTitle],
  }));
};

export const DEFAULT_FAQ_CATEGORIES: FaqCategory[] = groupFaqsByCategory();

export function Faq5({
  categories = DEFAULT_FAQ_CATEGORIES,
  className,
}: Faq5Props) {
  return (
    <div className={cn("space-y-12", className)}>
      {categories.map((category, catIndex) => (
        <div key={catIndex} className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              {category.title}
            </h3>
            {category.description && (
              <p className="mt-1 text-xs text-[#9A9A9A] sm:text-sm">
                {category.description}
              </p>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {category.items.map((item, itemIndex) => (
              <AccordionItem
                key={itemIndex}
                value={`cat-${catIndex}-item-${itemIndex}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 transition-all data-[state=open]:border-[#3B82F6]/50 data-[state=open]:bg-white/[0.06]"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-semibold text-white hover:text-[#3B82F6] hover:no-underline sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-xs leading-relaxed text-[#9A9A9A] sm:text-sm">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export default Faq5;
