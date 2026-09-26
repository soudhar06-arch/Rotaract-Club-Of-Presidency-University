"use client";
import { useCMS } from "@/hooks/use-cms";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const { data: records } = useCMS<{ id: string; quote: string; author: string; role: string; organization: string }[]>("testimonials", []);
  const testimonials = records.map(p => ({ ...p, content: p.quote, batch: p.organization }));
  return (
    <section className="section-shell relative z-10 border-t border-white/[0.06] bg-[#0A0A0A]/40 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
        >
          ALUMNI & MEMBER VOICES
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Transformative Leadership Journeys
        </motion.h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card relative flex flex-col justify-between p-8"
          >
            <Quote className="h-8 w-8 text-[#3B82F6]/40" />

            <p className="mt-4 text-sm leading-relaxed text-[#D4D4D4]">
              &ldquo;{item.content}&rdquo;
            </p>

            <div className="mt-6 border-t border-white/10 pt-4">
              <h4 className="text-sm font-bold text-white">{item.author}</h4>
              <p className="text-xs font-medium text-[#3B82F6]">{item.role}</p>
              <p className="text-[10px] text-[#71717A]">{item.batch}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
