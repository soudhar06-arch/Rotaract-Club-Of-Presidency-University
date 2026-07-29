"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div id="contact" className="scroll-mt-24 space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Get In Touch
        </span>
        <h1 className="text-display-l font-bold text-white">
          Contact Rotaract Chapter
        </h1>
        <p className="text-body-large text-[color:var(--color-text-muted)]">
          Have questions about membership, events, or partnerships? Send us a
          message and our leadership team will respond promptly.
        </p>
      </section>

      <section className="container-shell grid max-w-5xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Contact Info Sidebar */}
        <div className="glass-card space-y-6 p-8 lg:col-span-5">
          <h2 className="text-heading-s font-bold text-white">
            Contact Information
          </h2>

          <div className="space-y-4 text-xs text-[color:var(--color-text-muted)]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#3B82F6]" />
              <div>
                <span className="block font-semibold text-white">
                  Campus Address
                </span>
                <span>
                  Presidency University Campus, Itgalpur, Rajanakunte,
                  Yelahanka, Bengaluru, Karnataka 560064
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#3B82F6]" />
              <div>
                <span className="block font-semibold text-white">
                  Email Inquiry
                </span>
                <span className="font-mono">
                  rotaract@presidencyuniversity.in
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#3B82F6]" />
              <div>
                <span className="block font-semibold text-white">
                  Chapter Helpdesk
                </span>
                <span className="font-mono">+91 80 2309 3500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card space-y-6 p-8 lg:col-span-7">
          <h2 className="text-heading-m font-bold text-white">Send Message</h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold text-slate-300">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold text-slate-300">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-300">
                Subject
              </label>
              <input
                type="text"
                placeholder="Membership query / Event inquiry..."
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-300">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Type your message here..."
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
              />
            </div>
            <button
              type="submit"
              className="shadow-small inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
            >
              <span>Send Message</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
