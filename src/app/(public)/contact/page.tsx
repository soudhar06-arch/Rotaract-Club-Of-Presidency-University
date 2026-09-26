"use client";

import { useState, useEffect } from "react";
import { BackButton } from "@/components/shared/back-button";
import { Mail, MapPin, Send, CheckCircle2, Sparkles, ArrowRight, Phone } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    instagram: "",
    linkedin: "",
    location: "",
    membershipFormUrl: "",
  });

  useEffect(() => {
    let active = true;
    fetch("/api/cms?module=config")
      .then((res) => res.json())
      .then((res) => {
        if (active && res.success && res.data) {
          setContactInfo((prev) => ({
            ...prev,
            email: res.data.email || "",
            phone: res.data.phone || "",
            instagram: res.data.instagram || "",
            linkedin: res.data.linkedin || "",
            location: res.data.universityAddress || "",
            membershipFormUrl: res.data.membershipFormUrl || "",
          }));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.message }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Message could not be delivered.");
      setSubmitted(true);
      
    } catch (error) { setError(error instanceof Error ? error.message : "Message could not be delivered."); }
    finally { setLoading(false); }
  };

  return (
    <div className="section-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <BackButton fallbackRoute="/" className="mb-6" />

        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Get In Touch
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase font-sans">
            Let&apos;s Connect & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400">Collaborate.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Have a proposal for community service, sponsorship, joint inter-club initiative, or membership inquiry? Reach out to our Secretariat.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-[#3B82F6]">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">UNIVERSITY ADDRESS</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{contactInfo.location}</p>
            </div>

            <div className="border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-[#3B82F6]">
                <Mail className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">EMAIL SECRETARIAT</span>
              </div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-sm font-semibold text-white hover:text-[#3B82F6] transition-colors block"
              >
                {contactInfo.email}
              </a>
            </div>

            <div className="border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-[#3B82F6]">
                <Phone className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">OFFICIAL CONTACT</span>
              </div>
              <a
                href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                className="text-sm font-semibold text-white hover:text-[#3B82F6] transition-colors block"
              >
                {contactInfo.phone}
              </a>
            </div>

            <div className="border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl rounded-2xl p-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block">SOCIAL MEDIA HANDLES</span>
              <div className="flex items-center gap-3">
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </a>
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-white space-y-3">
              <h3 className="text-sm font-bold">Looking to join RCPU?</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Fill out our official membership application form directly.
              </p>
              <a
                href={contactInfo.membershipFormUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg"
              >
                <span>Apply for Membership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 bg-[#0E121E]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white tracking-tight">Send a Direct Message</h2>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Thank you for contacting the Secretariat. A member of our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <><p role="alert" className="text-sm text-red-300">{error}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Your Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Collaboration / Sponsorship Inquiry"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Message *</label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Sending..." : "Submit Message"}</span>
                  </button>
                </form></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
