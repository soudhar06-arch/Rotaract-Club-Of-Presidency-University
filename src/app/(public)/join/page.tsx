"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";

export default function JoinPage() {
  return (
    <div className="space-y-16 pt-28 pb-20">
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Membership Application
        </span>
        <h1 className="text-display-l font-bold text-white">
          Become a Rotaract Member
        </h1>
        <p className="text-body-large text-[color:var(--color-text-muted)]">
          Join over 350 university student leaders driving community welfare,
          networking, and professional growth.
        </p>
      </section>

      <section className="container-shell grid max-w-4xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Benefits Sidebar */}
        <div className="glass-card space-y-6 p-8 lg:col-span-5">
          <h2 className="text-heading-s font-bold text-white">
            Why Join Rotaract?
          </h2>
          <div className="space-y-3 text-xs text-[color:var(--color-text-muted)]">
            {[
              "Lead community service projects",
              "Access Rotary District 3191 network",
              "Participate in national youth summits",
              "Certificate of active membership",
              "Build lifelong friendships & mentorships",
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="glass-card space-y-6 p-8 lg:col-span-7">
          <h2 className="text-heading-m font-bold text-white">
            Application Form
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="mb-1 block font-semibold text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold text-slate-300">
                  University Email
                </label>
                <input
                  type="email"
                  placeholder="student@presidency.edu.in"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold text-slate-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold text-slate-300">
                  School / Department
                </label>
                <input
                  type="text"
                  placeholder="School of Computer Science"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold text-slate-300">
                  Year of Study
                </label>
                <select className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-white">
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-300">
                Why do you want to join?
              </label>
              <textarea
                rows={3}
                placeholder="Share your interest in service and leadership..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white"
              />
            </div>
            <button
              type="submit"
              className="shadow-small inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
            >
              <span>Submit Membership Application</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
