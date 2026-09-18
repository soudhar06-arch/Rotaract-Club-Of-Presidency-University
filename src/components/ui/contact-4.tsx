"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ArrowRight, Sprout, CheckCircle2 } from "lucide-react";

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface ServiceOption {
  value: string;
  label: string;
}

export interface ContactFormProps {
  badge?: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  contactInfo: ContactInfo;
  serviceOptions: ServiceOption[];
  ctaLabel: string;
  onSubmit?: (data: ContactFormData) => void;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  service: string;
  message: string;
}

const defaultProps: ContactFormProps = {
  badge: "Connect With Us",
  headline: "Get In Touch With",
  headlineAccent: "Rotaract Club",
  subheadline:
    "We partner with students, faculty, fellow Rotaract clubs, and corporate partners to drive measurable youth impact.",
  contactInfo: {
    email: "rotaractcpu@gmail.com",
    phone: "+91 8884466773",
  },
  serviceOptions: [
    { value: "membership", label: "Membership Inquiry" },
    { value: "sponsorship", label: "Corporate Sponsorship" },
    { value: "collaboration", label: "Inter-Club Collaboration" },
    { value: "community", label: "Community Project Idea" },
    { value: "other", label: "General Questions" },
  ],
  ctaLabel: "Send Message",
};

export default function ContactSolutionForm(props: Partial<ContactFormProps>) {
  const {
    badge,
    headline,
    headlineAccent,
    subheadline,
    contactInfo,
    serviceOptions,
    ctaLabel,
    onSubmit,
  } = { ...defaultProps, ...props };

  const [form, setForm] = useState<ContactFormData>({
    fullName: "",
    email: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      onSubmit?.(form);
    }, 800);
  };

  return (
    <section className="bg-transparent flex w-full items-center justify-center py-8">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Side Content */}
        <div className="flex flex-col gap-6">
          {badge && (
            <Badge variant="default" className="self-start">
              <Sprout className="h-3.5 w-3.5 text-primary mr-1" />
              {badge}
            </Badge>
          )}

          <h1 className="text-white text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            {headline}{" "}
            <span className="text-[#3B82F6] block">{headlineAccent}</span>
          </h1>

          <p className="text-[#9A9A9A] max-w-md text-base leading-relaxed">
            {subheadline}
          </p>

          <Separator className="bg-[#3B82F6]/40 my-2 w-16 h-1 rounded-full" />

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="bg-white/[0.03] border border-white/10 flex items-center gap-4 rounded-2xl p-4">
              <div className="bg-[#3B82F6]/10 flex size-12 shrink-0 items-center justify-center rounded-xl text-[#3B82F6]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-[#9A9A9A] uppercase">
                  Email Us
                </p>
                <a href={`mailto:${contactInfo.email}`} className="text-white text-sm font-semibold hover:text-[#3B82F6] transition-colors">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 flex items-center gap-4 rounded-2xl p-4">
              <div className="bg-[#3B82F6]/10 flex size-12 shrink-0 items-center justify-center rounded-xl text-[#3B82F6]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-[#9A9A9A] uppercase">
                  Call Us
                </p>
                <p className="text-white text-sm font-semibold">
                  {contactInfo.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Card Form */}
        <Card className="bg-white/[0.03] border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="flex flex-col gap-5 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6] mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Delivered!</h3>
                <p className="mt-2 text-xs text-[#9A9A9A] max-w-xs">
                  Thank you for reaching out. A club representative will get back to you shortly.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    required
                    placeholder="Alex Rivera"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="alex@presidencyuniversity.in"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="service">Area of Interest</Label>
                  <Select
                    value={form.service}
                    onValueChange={(val) => handleChange("service", val)}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Choose a topic..." />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Tell us how we can collaborate or assist you..."
                    rows={4}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#3B82F6] text-white hover:bg-blue-600 group mt-2 w-full rounded-xl py-6 text-sm font-semibold shadow-glow transition-all active:scale-95"
                >
                  <span>{loading ? "Sending..." : ctaLabel}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
