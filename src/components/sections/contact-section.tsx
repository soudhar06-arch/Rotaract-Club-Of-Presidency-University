"use client";

import { motion } from "framer-motion";
import ContactSolutionForm from "@/components/ui/contact-4";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="section-shell relative z-10 border-t border-white/[0.06] py-16"
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
          Contact & University Address
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base text-[#9A9A9A]"
        >
          Have questions about membership, sponsorships, or community
          partnerships? Send us a message or visit our campus.
        </motion.p>
      </div>

      <div className="mt-8">
        <ContactSolutionForm
          badge="ROTARACT PRESIDENCY"
          headline="Connect With Our"
          headlineAccent="Executive Team"
          subheadline="Presidency University Campus, Dibburu, Itgalpur, Rajankunte, Yelahanka, Bengaluru, Karnataka 560064"
          contactInfo={{
            email: "rotaractcpu@gmail.com",
            phone: "+91 8884466773",
          }}
          ctaLabel="Submit Inquiry"
        />
      </div>
    </section>
  );
}
