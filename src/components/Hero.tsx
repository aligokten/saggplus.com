"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { company } from "@/lib/content";
import NavLink from "./NavLink";
import RevealText from "./motion/RevealText";
import BlueprintDrawing from "./motion/BlueprintDrawing";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  heroImage,
  announcementEnabled,
}: {
  heroImage: string;
  announcementEnabled: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Kaydırırken görsel yavaş, metin hızlı yukarı kayar; ikisi de solar.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const drawingY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      ref={ref}
      className={`relative min-h-screen flex items-center px-4 sm:px-6 pb-16 overflow-hidden ${
        announcementEnabled ? "pt-36" : "pt-28"
      }`}
    >
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{
          y: imageY,
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
        }}
        aria-hidden="true"
      >
        <motion.div style={{ scale: imageScale }} className="h-full w-full">
          {/* Açılışta yavaşça yaklaşan "Ken Burns" efekti */}
          <motion.div
            initial={{ scale: 1.18, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: EASE }}
            className="h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: drawingY }}
        className="pointer-events-none absolute right-2 lg:right-[max(1.5rem,calc((100vw-80rem)/2))] top-1/2 -translate-y-1/2 hidden md:block w-[min(640px,50vw)] opacity-40 lg:opacity-70"
      >
        <BlueprintDrawing className="h-auto w-full" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-6xl w-full"
      >
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs sm:text-sm font-medium text-ink-muted mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            SAGG İnşaat Mimarlık Akustik
          </motion.p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            <RevealText mode="load" delay={0.25} stagger={0.08} text="Hayallerin" />{" "}
            <RevealText
              mode="load"
              delay={0.41}
              stagger={0.08}
              text="gerçeğe dönüştüğü"
              wordClassName="bg-gradient-to-r from-accent via-[#ff8a5c] to-accent-3 bg-clip-text text-transparent"
            />{" "}
            <RevealText mode="load" delay={0.57} stagger={0.08} text="yere hoşgeldiniz." />
          </h1>

          {/* Başlığın altında çizilen turuncu çizgi */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 1.0, ease: EASE }}
            className="mt-6 h-[2px] w-32 origin-left bg-gradient-to-r from-accent to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-ink-muted"
          >
            {company.shortDescription}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="shown"
            transition={{ staggerChildren: 0.12, delayChildren: 1.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, shown: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.6, ease: EASE }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                href="/#projeler"
                className="inline-flex items-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-[#171717] hover:bg-accent transition-colors"
              >
                Projelerimizi İncele
              </NavLink>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, shown: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.6, ease: EASE }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                href="/#iletisim"
                className="inline-flex items-center rounded-full glass px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/10 transition-colors"
              >
                Bize Ulaşın
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Aşağı kaydır göstergesi */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-muted"
        >
        Kaydır
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
          />
        </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
