"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { SocialIcons } from "@/components/shared/social-icons";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="contact"
      className="section-shell relative z-10 border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
        >
          GET IN TOUCH
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Contact & Headquarters
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-[#9A9A9A]"
        >
          Have questions about membership, sponsorships, or community
          partnerships? Send us a message or visit our campus office.
        </motion.p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Info Column (5 Cols) */}
        <div className="glass-card flex flex-col justify-between p-8 lg:col-span-5">
          <div>
            <h3 className="text-xl font-bold text-white">
              Direct Communication
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#9A9A9A]">
              We welcome inquiries from students, faculty, fellow Rotaract
              clubs, and prospective corporate partners.
            </p>

            <div className="mt-8 space-y-5 text-xs text-[#D4D4D4]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                <div>
                  <p className="font-semibold text-white">
                    Campus Headquarters
                  </p>
                  <p className="mt-1 text-[#9A9A9A]">
                    Presidency University, Rajanukunte, Yelahanka, Bengaluru,
                    Karnataka 560064
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <div>
                  <p className="font-semibold text-white">Official Email</p>
                  <a
                    href="mailto:rotaract@presidencyuniversity.in"
                    className="text-[#9A9A9A] hover:text-[#3B82F6]"
                  >
                    rotaract@presidencyuniversity.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <div>
                  <p className="font-semibold text-white">Phone Support</p>
                  <p className="text-[#9A9A9A]">+91 (080) 2309-3500</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="mb-3 text-xs font-semibold text-white">
              Connect on Social Media
            </p>
            <SocialIcons />
          </div>
        </div>

        {/* Form Column (7 Cols) */}
        <div className="glass-card p-8 lg:col-span-7">
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                Message Sent Successfully!
              </h3>
              <p className="mt-2 text-xs text-[#9A9A9A]">
                Thank you for reaching out to Rotaract Club of Presidency
                University. Our team will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-2 text-xs font-semibold text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-bold text-white">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#D4D4D4]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#D4D4D4]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@presidencyuniversity.in"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#D4D4D4]">
                  Subject / Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Membership Inquiry / Event Collaboration"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#D4D4D4]">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you?"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="shadow-glow inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-8 py-3.5 text-xs font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
              >
                <span>{loading ? "Sending..." : "Submit Inquiry"}</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
