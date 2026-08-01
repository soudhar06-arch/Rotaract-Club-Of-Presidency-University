"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/shared/count-up";
import { Users, Heart, Award, Calendar } from "lucide-react";

const STATS = [
  {
    icon: Users,
    label: "Active Members",
    value: 250,
    suffix: "+",
    description:
      "Passionate student leaders across engineering, business, & design.",
  },
  {
    icon: Heart,
    label: "Blood Units Donated",
    value: 450,
    suffix: "+",
    description: "Collected through annual mega blood donation drives.",
  },
  {
    icon: Calendar,
    label: "Projects Completed",
    value: 65,
    suffix: "+",
    description: "Community, professional, and environmental initiatives.",
  },
  {
    icon: Award,
    label: "District Awards",
    value: 12,
    suffix: "+",
    description: "Conferred by Rotary International District 3191.",
  },
];

export function ImpactStatsSection() {
  return (
    <section className="section-shell relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-[#3B82F6] uppercase"
        >
          MEASURABLE IMPACT
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-heading-xl mt-3 font-bold tracking-tight text-white"
        >
          Our Footprint in Numbers
        </motion.h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card flex flex-col items-center p-8 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-extrabold text-white sm:text-4xl">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-white">
                {stat.label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#9A9A9A]">
                {stat.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
