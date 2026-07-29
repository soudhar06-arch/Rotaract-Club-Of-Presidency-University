import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Users, Award } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the mission, history, leadership, and values of the Rotaract Club of Presidency University.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity & Ethics",
    desc: "Upholding complete transparency, accountability, and honor in every initiative.",
  },
  {
    icon: Heart,
    title: "Selfless Service",
    desc: "Putting community needs first through dedicated youth-led social impact projects.",
  },
  {
    icon: Users,
    title: "Inclusive Fellowship",
    desc: "Welcoming students across disciplines to build meaningful, lifelong bonds.",
  },
  {
    icon: Award,
    title: "Leadership Excellence",
    desc: "Training tomorrow's civic leaders through real-world governance experience.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 pt-28 pb-20">
      {/* Hero Header */}
      <section className="container-shell max-w-3xl space-y-4 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Who We Are
        </span>
        <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
          Building Future Leaders Through Community Impact
        </h1>
        <p className="text-body-large text-[color:var(--color-text-secondary)]">
          The Rotaract Club of Presidency University (Chartered under Rotary
          District 3191) brings together motivated students to drive meaningful
          change, foster international understanding, and develop professional
          leadership skills.
        </p>
      </section>

      {/* Story & History Section */}
      <section className="section-shell rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/40 py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-accent-blue)] uppercase dark:text-[color:var(--color-brand-rotary-gold)]">
              Our Journey
            </span>
            <h2 className="text-heading-l font-bold text-[color:var(--color-text-primary)]">
              From Campus Initiative to District Leader
            </h2>
            <p className="text-body leading-relaxed text-[color:var(--color-text-secondary)]">
              Founded by student pioneers, our chapter has grown into one of the
              most active youth organizations in Bengaluru. We bridge academic
              excellence with hands-on social responsibility across
              environmental sustainability, public health, literacy, and youth
              governance.
            </p>
            <div className="grid grid-cols-2 gap-4 border-t border-[color:var(--color-border)] pt-4">
              <div>
                <span className="font-geist block text-3xl font-extrabold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                  2021
                </span>
                <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                  Charter Year
                </span>
              </div>
              <div>
                <span className="font-geist block text-3xl font-extrabold text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                  250+
                </span>
                <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                  Active Student Members
                </span>
              </div>
            </div>
          </div>

          <div className="shadow-large relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--color-border)] lg:col-span-6">
            <Image
              src="/images/hero-community.png"
              alt="Rotaract club members history"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="container-shell px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-xl space-y-2 text-center">
          <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
            Guiding Philosophy
          </span>
          <h2 className="text-heading-xl font-bold text-[color:var(--color-text-primary)]">
            Our Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((val, idx) => (
            <div
              key={idx}
              className="shadow-small hover-lift space-y-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-accent-blue)]/10 text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]">
                <val.icon className="h-6 w-6" />
              </div>
              <h3 className="text-heading-s font-bold text-[color:var(--color-text-primary)]">
                {val.title}
              </h3>
              <p className="text-body-small text-[color:var(--color-text-secondary)]">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="container-shell px-4 text-center sm:px-6 lg:px-8">
        <div className="shadow-medium mx-auto max-w-2xl space-y-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-10">
          <h3 className="text-heading-m font-bold">Want to serve with us?</h3>
          <p className="text-body-small text-[color:var(--color-text-secondary)]">
            Applications are open for university students across all academic
            departments.
          </p>
          <Link
            href={ROUTES.JOIN}
            className="shadow-small inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-brand-accent-blue)] px-6 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <span>Become a Member</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
