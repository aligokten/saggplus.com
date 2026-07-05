"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Sofa,
  Waves,
  HardHat,
  Hammer,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";
import { services, type Service } from "@/lib/content";
import SectionHeading from "./SectionHeading";

const icons: Record<Service["icon"], LucideIcon> = {
  compass: Compass,
  sofa: Sofa,
  waves: Waves,
  "hard-hat": HardHat,
  hammer: Hammer,
  "monitor-smartphone": MonitorSmartphone,
};

export default function Services() {
  return (
    <section id="hizmetlerimiz" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Tasarımdan uygulamaya uçtan uca hizmet"
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6 }}
                className="group glass rounded-3xl p-7 sm:p-8 hover:bg-white/10 transition-colors"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/20 text-accent group-hover:scale-110 transition-transform">
                  <Icon size={24} strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
