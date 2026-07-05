"use client";

import { motion } from "framer-motion";
import { company } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center px-4 sm:px-6 pt-28">
      <div className="mx-auto max-w-6xl w-full">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs sm:text-sm font-medium text-ink-muted mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-3" />
          {company.city} · {company.founded}&apos;den beri
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl"
        >
          Mimariden inşaata,{" "}
          <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-3 bg-clip-text text-transparent">
            tek vizyonda
          </span>{" "}
          buluşan tasarım ofisi.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-5 max-w-2xl text-lg sm:text-xl font-medium italic text-accent"
        >
          {company.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mt-4 max-w-2xl text-base sm:text-lg text-ink-muted"
        >
          {company.shortDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projeler"
            className="inline-flex items-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors"
          >
            Projelerimizi İncele
          </a>
          <a
            href="#iletisim"
            className="inline-flex items-center rounded-full glass px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/10 transition-colors"
          >
            Bize Ulaşın
          </a>
        </motion.div>
      </div>
    </section>
  );
}
