"use client";

import { motion } from "framer-motion";
import type { ServiceRecord } from "@/lib/services";
import { SERVICE_ICONS } from "@/lib/serviceIcons";
import SectionHeading from "./SectionHeading";
import TiltCard from "./motion/TiltCard";

export default function Services({ services }: { services: ServiceRecord[] }) {
  if (services.length === 0) return null;

  return (
    <section id="hizmetlerimiz" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Tasarımdan uygulamaya uçtan uca hizmet"
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 [perspective:1200px]">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.compass;
            return (
              <TiltCard
                key={service.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-3xl p-7 sm:p-8 hover:bg-white/10 transition-colors overflow-hidden"
              >
                {/* Kartın üst kenarında soldan sağa çizilen ışık çizgisi */}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-6 top-0 h-px origin-left bg-gradient-to-r from-transparent via-accent to-transparent"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-6 text-sm font-semibold tabular-nums text-white/15 transition-colors group-hover:text-accent/60"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <motion.div
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 + (i % 3) * 0.1 }}
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/20 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                >
                  <Icon size={24} strokeWidth={1.75} />
                </motion.div>
                <h3 className="relative mt-6 text-lg font-semibold text-ink">
                  {service.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">
                  {service.description}
                </p>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
