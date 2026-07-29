import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, HeartPulse, BookOpen, Users } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Initiatives & Projects",
  description:
    "Explore flagship projects and social impact initiatives undertaken by the Rotaract Club of Presidency University.",
};

const PROJECTS = [
  {
    title: "Green Campus Revolution",
    category: "Environmental Sustainability",
    icon: Leaf,
    image: "/images/project-featured.png",
    desc: "A long-term reforestation and urban greening campaign planting over 1,000 native tree saplings across university and local civic spaces.",
    metrics: [
      "1,000+ Saplings Planted",
      "300+ Student Volunteers",
      "State Forest Dept Partner",
    ],
    status: "Active Flagship",
  },
  {
    title: "Annual Mega Blood Donation Drive",
    category: "Public Health",
    icon: HeartPulse,
    image: "/images/event-blood-drive.png",
    desc: "Organized in collaboration with Red Cross Blood Bank, mobilizing over 450 campus donors to save critical patient lives.",
    metrics: ["450+ Units Donated", "Red Cross Certified", "Annual Drive"],
    status: "Completed (2026)",
  },
  {
    title: "Digital Literacy for Rural Schools",
    category: "Education & Youth Empowerment",
    icon: BookOpen,
    image: "/images/hero-community.png",
    desc: "Establishing computer hardware labs and conducting interactive coding/digital skills workshops for primary school students.",
    metrics: ["15 Workshops", "500+ Students Taught", "3 School Labs Built"],
    status: "Ongoing Initiative",
  },
  {
    title: "Youth Leadership & Governance Summit",
    category: "Professional Development",
    icon: Users,
    image: "/images/gallery-youth-summit.png",
    desc: "A premier university conference uniting student leaders with industry executives, public servants, and Rotary governors.",
    metrics: ["250 Attendees", "12 Expert Speakers", "District Accredited"],
    status: "Annual Summit",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-16 pt-28 pb-20">
      {/* Header */}
      <section className="container-shell max-w-3xl space-y-3 px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-xs font-semibold tracking-wider text-[color:var(--color-brand-rotary-gold)] uppercase">
          Social Impact & Action
        </span>
        <h1 className="text-display-l font-bold text-[color:var(--color-text-primary)]">
          Our Initiatives & Community Projects
        </h1>
        <p className="text-body-large text-[color:var(--color-text-secondary)]">
          Rotaract projects address urgent community challenges through
          sustainable execution, student teamwork, and strategic partnerships.
        </p>
      </section>

      {/* Projects Grid */}
      <section className="container-shell px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {PROJECTS.map((project, idx) => (
            <div
              key={idx}
              className="shadow-medium hover-lift group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-[color:var(--color-surface-glass)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-primary)] backdrop-blur-md">
                  <project.icon className="h-3.5 w-3.5 text-[color:var(--color-brand-accent-blue)] dark:text-[color:var(--color-brand-rotary-gold)]" />
                  <span>{project.category}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4 p-8">
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-[color:var(--color-bg-secondary)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[color:var(--color-brand-rotary-gold)] uppercase">
                    {project.status}
                  </span>
                  <h2 className="text-heading-m font-bold text-[color:var(--color-text-primary)]">
                    {project.title}
                  </h2>
                  <p className="text-body-small leading-relaxed text-[color:var(--color-text-secondary)]">
                    {project.desc}
                  </p>
                </div>

                <div className="space-y-2 border-t border-[color:var(--color-border)] pt-4">
                  <span className="block font-mono text-xs font-bold text-[color:var(--color-text-muted)]">
                    Key Metrics:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.metrics.map((m, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-text-primary)]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-shell px-4 text-center sm:px-6 lg:px-8">
        <div className="shadow-medium mx-auto max-w-xl space-y-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-10">
          <h3 className="text-heading-m font-bold">Have a project idea?</h3>
          <p className="text-body-small text-[color:var(--color-text-secondary)]">
            We partner with non-profits, student clubs, and corporate sponsors
            to expand community reach.
          </p>
          <Link
            href={ROUTES.CONTACT}
            className="shadow-small inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-brand-accent-blue)] px-6 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <span>Partner With Us</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
