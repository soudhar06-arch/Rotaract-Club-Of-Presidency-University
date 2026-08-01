"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { submitJoinApplication } from "@/services/api";
import { ROUTES } from "@/constants";

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    department: "",
    yearOfStudy: "1st Year",
    avenuesOfInterest: [] as string[],
    statementOfPurpose: "",
  });

  const avenuesList = [
    "Club Service",
    "Community Service",
    "Professional Development",
    "International Service",
    "Public Relations & Media",
    "Editorial & Content",
  ];

  const handleCheckboxChange = (avenue: string) => {
    setFormData((prev) => {
      const exists = prev.avenuesOfInterest.includes(avenue);
      if (exists) {
        return {
          ...prev,
          avenuesOfInterest: prev.avenuesOfInterest.filter((a) => a !== avenue),
        };
      } else {
        return {
          ...prev,
          avenuesOfInterest: [...prev.avenuesOfInterest, avenue],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitJoinApplication(formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell relative z-10 min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-3xl">
        {/* Back Link */}
        <Link
          href={ROUTES.HOME}
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#3B82F6] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>

        {/* Form Container */}
        <div className="glass-card p-8 sm:p-12">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl">
                Application Received!
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#9A9A9A]">
                Thank you for applying to the Rotaract Club of Presidency
                University. Our Membership Committee will review your
                application and contact you via email for the interview round.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href={ROUTES.HOME}
                  className="shadow-glow rounded-xl bg-[#3B82F6] px-6 py-3 text-xs font-semibold text-white"
                >
                  Explore Homepage
                </Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-[#3B82F6]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>MEMBERSHIP APPLICATION 2026–2027</span>
                </div>
                <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                  Join Rotaract Presidency
                </h1>
                <p className="mt-2 text-xs text-[#9A9A9A]">
                  Complete the application below to begin your journey of
                  leadership and service.
                </p>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-[#3B82F6] text-white uppercase">
                  1. Personal & Academic Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#D4D4D4]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="e.g. Aarav Sharma"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#D4D4D4]">
                      Presidency University Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="student@presidencyuniversity.in"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#D4D4D4]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#D4D4D4]">
                      Roll / Registration No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.rollNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, rollNumber: e.target.value })
                      }
                      placeholder="20241CSE0042"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#D4D4D4]">
                      Year of Study *
                    </label>
                    <select
                      value={formData.yearOfStudy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearOfStudy: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[#D4D4D4]">
                    School / Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="School of Engineering / Management / Design"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Avenues of Interest */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <h3 className="text-sm font-bold tracking-wider text-[#3B82F6] text-white uppercase">
                  2. Avenues of Interest (Select all that apply)
                </h3>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {avenuesList.map((avenue) => {
                    const isChecked =
                      formData.avenuesOfInterest.includes(avenue);
                    return (
                      <button
                        key={avenue}
                        type="button"
                        onClick={() => handleCheckboxChange(avenue)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-medium transition-all ${
                          isChecked
                            ? "border-[#3B82F6] bg-[#3B82F6]/20 text-white"
                            : "border-white/10 bg-white/[0.03] text-[#9A9A9A] hover:bg-white/[0.06]"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                            isChecked
                              ? "bg-[#3B82F6] text-white"
                              : "border border-white/20"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="h-3 w-3" />}
                        </div>
                        <span>{avenue}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SOP */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <h3 className="text-sm font-bold tracking-wider text-[#3B82F6] text-white uppercase">
                  3. Statement of Purpose
                </h3>
                <label className="block text-xs text-[#9A9A9A]">
                  Why do you wish to join Rotaract Presidency? What qualities or
                  experience will you bring to the club? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.statementOfPurpose}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statementOfPurpose: e.target.value,
                    })
                  }
                  placeholder="Share your motivations, skills, and previous volunteering experience..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="shadow-glow inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-8 py-3.5 text-xs font-semibold text-white transition-all hover:bg-blue-600 active:scale-95"
                >
                  <span>
                    {loading
                      ? "Submitting Application..."
                      : "Submit Application"}
                  </span>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
