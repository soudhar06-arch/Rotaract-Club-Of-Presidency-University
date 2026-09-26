import clubData from "@/data/club.json";
import { BackButton } from "@/components/shared/back-button";
import { Sparkles, Compass, Target, Award, HeartHandshake, Globe, Briefcase, Users, Megaphone, ArrowRight } from "lucide-react";
import Link from "next/link";

const AVENUE_CARDS = [
  { icon: Users, name: "Club Service", desc: "Building strong fellowship, internal team culture, orientation drives, and member bonding." },
  { icon: HeartHandshake, name: "Community Service", desc: "Organizing blood donation camps, literacy drives, environmental conservation, and hunger relief." },
  { icon: Briefcase, name: "Professional Development", desc: "Empowering students through career workshops, leadership summits, resume reviews, and industry panels." },
  { icon: Globe, name: "International Service", desc: "Fostering global peace, cultural exchanges like Outbound R.I.D.E, and joint international dialogues." },
  { icon: Megaphone, name: "Public Relations & Media", desc: "Managing brand identity, social media impact, press releases, and digital documentary archives." },
  { icon: Award, name: "Youth & Sports Development", desc: "Promoting athletics, inter-college tournaments, physical wellness, and team spirit." },
];

export default function AboutPage() {
  return (
    <div className="section-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <BackButton fallbackRoute="/#about" className="mb-6" />

        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Rotaract Club of Presidency University • RID 3192
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase font-sans">
            We Are RCPU. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-400 to-indigo-400">We Are Team Leviathan.</span>
          </h1>

          <p className="mt-4 text-xl font-semibold text-zinc-200">One team. One vision. Limitless impact.</p>
          <div className="mt-6 max-w-4xl space-y-4 text-base leading-relaxed text-zinc-300">
            <p>We are the Rotaract Club of Presidency University — Team Leviathan. A powerhouse of passionate young leaders, bold ideas, unstoppable energy, and a shared commitment to making a difference.</p>
            <p>Under Rotary International District 3192, we bring together driven individuals who believe that leadership is earned through action, service creates change, and fellowship turns a group of individuals into one unstoppable team.</p>
            <p>From transforming communities to building careers, creating unforgettable memories to connecting across borders, we don&apos;t just participate — we lead, innovate, and make things happen.</p>
            <p>Through Community Service, Professional Development, International Service, Club Service, Public Relations, Fellowship, and Sports, we turn ideas into initiatives, challenges into opportunities, and ambition into measurable impact.</p>
            <p>We are more than a club. We are a community, a family, and a force that moves forward together.</p>
            <p className="font-semibold text-white">We are RCPU. We are Leviathan. And we&apos;re just getting started.</p>
            <p className="font-mono text-sm font-bold tracking-[0.2em] text-[#3B82F6]">SERVICE. LEADERSHIP. FELLOWSHIP. IMPACT.</p>
          </div>
        </div>

        {/* Charter & Institutional Metadata */}
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Charter Number</span>
            <p className="mt-2 text-2xl font-bold text-white font-mono">{clubData.charterNumber}</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Rotary District</span>
            <p className="mt-2 text-base font-bold text-white">{clubData.rotaryDistrict}</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Partner Rotary Club</span>
            <p className="mt-2 text-base font-bold text-white">{clubData.partnerRotaryClub}</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Institutional Campus</span>
            <p className="mt-2 text-base font-bold text-white">{clubData.university}</p>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-br from-[#3B82F6]/10 via-[#0F1117] to-[#0F1117] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center gap-3 text-[#3B82F6]">
              <Target className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Our Mission</h3>
            </div>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {clubData.mission}
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-br from-indigo-500/10 via-[#0F1117] to-[#0F1117] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center gap-3 text-indigo-400">
              <Compass className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Our Vision</h3>
            </div>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {clubData.vision}
            </p>
          </div>
        </div>

        {/* 6 Avenues of Service */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase text-[#3B82F6] tracking-widest">Pillars of Impact</span>
            <h2 className="mt-2 text-3xl font-bold text-white tracking-tight uppercase">The 6 Avenues of Service</h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Rotaract Club of Presidency University operates across six structured avenues to deliver holistic youth leadership and social change.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AVENUE_CARDS.map((avenue, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/10 bg-[#0F1117]/80 backdrop-blur-xl hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                  <avenue.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{avenue.name}</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{avenue.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to make an impact?</h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Apply for membership or explore our flagship case study archives.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-[#3B82F6]/25"
            >
              <span>Join RCPU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
            >
              <span>Explore Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

